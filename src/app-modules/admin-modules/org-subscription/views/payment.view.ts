import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription, finalize} from "rxjs";
import {AlertService, EntitlementService, MessageSeverity} from "@app-global";
import {
    DEFAULT_BILLING_CURRENCY, LicenseSummary, PAYABLE_ACTIONS, PAYMENT_MODE_OPTIONS, PaymentModeOption, PlanFeature, PlanOffer,
    PaymentSetup, PurchaseQuote, SubscriptionOverview, SubscriptionPurchaseRequest, featureCell, isPurchaseBlocked, billingLabel, termLabel
} from "../domains/subscription.models";
import {SubscriptionService, errorMessageOf, newIdempotencyKey} from "../services";

/** Router state handed to the success page. */
export const PURCHASE_RESULT_STATE_KEY = 'subscriptionPurchase';

const optional = (value: string | null | undefined): string | null => (value ?? '').trim() || null;

@Component({
    standalone: false,
    templateUrl: './templates/payment.html'
})
export class PaymentView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) public pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    readonly termLabel = termLabel;
    readonly billingLabel = billingLabel;

    readonly paymentModes = PAYMENT_MODE_OPTIONS;

    overview: SubscriptionOverview | null = null;
    plans: PlanOffer[] = [];
    selectedPlan: PlanOffer | null = null;
    /** Set when moduleGuard sent the user here because the current plan lacks this module. */
    requestedModule: PlanFeature | null = null;
    /** Set when the requested plan is cheaper than the current one: it is scheduled, not paid for here. */
    requestedDowngrade: PlanOffer | null = null;

    /** The server's price for the selected plan today; the purchase is charged from the same rules. */
    quote: PurchaseQuote | null = null;
    quoteError: string | null = null;
    isQuoting = false;
    private quoteRequest: Subscription | null = null;

    /** False: pay online on the gateway page. True: record a payment already made elsewhere (only when allowed). */
    payByReference = false;

    isLoading = false;
    loadError: string | null = null;
    submitting = false;
    submitError: string | null = null;

    readonly customForm: FormGroup;

    /**
     * Key of the last submitted request and what it contained. Resubmitting the same request (for example after a
     * timeout) reuses the key so the API replays the first result instead of billing twice; any change gets a new key.
     */
    private attempt: {key: string; fingerprint: string} | null = null;

    constructor(private fb: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private alertService: AlertService,
                private service: SubscriptionService,
                private entitlements: EntitlementService) {
        this.customForm = this.fb.group({
            billingName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
            billingEmail: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
            billingContactNo: ['', [Validators.maxLength(30)]],
            billingAddress: ['', [Validators.maxLength(500)]],
            taxNumber: ['', [Validators.maxLength(50)]],
            paymentMode: [null, Validators.required],
            paymentReferenceNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            remark: ['', [Validators.maxLength(500)]]
        });
    }

    get f() { return this.customForm.controls; }
    get license(): LicenseSummary | null { return this.overview?.license ?? null; }

    /** Why nothing can be bought right now, or null. */
    get blockedReason(): string | null {
        switch (this.overview?.subscription?.status) {
            case 'Paused': return 'Your subscription is paused. Resume it before renewing or changing the plan.';
            case 'Suspended': return 'Your subscription is suspended. Online purchases are not available; please contact support.';
        }
        return isPurchaseBlocked(this.license)
            ? `Your license is ${this.license!.status.toLowerCase()}. Online purchases are not available; please contact support.`
            : null;
    }
    get purchaseBlocked(): boolean { return this.blockedReason !== null; }

    get currency(): string {
        return this.quote?.currencyCode ?? this.selectedPlan?.currencyCode ?? DEFAULT_BILLING_CURRENCY;
    }

    get selectedMode(): PaymentModeOption | null {
        return this.paymentModes.find(m => m.id === this.f['paymentMode'].value) ?? null;
    }

    get payment(): PaymentSetup | null { return this.overview?.payment ?? null; }
    get canPayOnline(): boolean { return !!this.payment?.gatewayCode; }
    get canPayByReference(): boolean { return !!this.payment?.manualEnabled; }
    get noPaymentMethod(): boolean { return !!this.overview && !this.canPayOnline && !this.canPayByReference; }

    /** Switches between the gateway and recording a reference; reference fields are only required for the latter. */
    usePayByReference(on: boolean) {
        if (this.submitting) { return; }
        this.payByReference = on && this.canPayByReference;
        this.submitError = null;
        this.attempt = null;
        for (const name of ['paymentMode', 'paymentReferenceNumber']) {
            const control = this.f[name];
            if (this.payByReference) {
                control.setValidators(name === 'paymentMode'
                    ? [Validators.required]
                    : [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
            } else {
                control.clearValidators();
            }
            control.updateValueAndValidity({emitEvent: false});
        }
    }

    get canSubmit(): boolean {
        return !!this.selectedPlan && !!this.quote && this.quote.planId === this.selectedPlan.id
            && !this.isQuoting && !this.submitting && !this.purchaseBlocked && !this.noPaymentMethod;
    }

    invalid(control: string): boolean {
        const c = this.f[control];
        return c.invalid && (c.touched || c.dirty);
    }

    ngOnInit() { this.load(); }

    load(refresh = false) {
        this.isLoading = true;
        this.loadError = null;
        this.service.getOverview(refresh)
            .pipe(finalize(() => this.isLoading = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: overview => this.apply(overview),
                error: err => this.loadError = errorMessageOf(err, 'Could not load plans. Please try again.')
            });
    }

    selectPlan(plan: PlanOffer) {
        if (!plan.isPurchasable || this.submitting) { return; }
        this.selectedPlan = plan;
        this.submitError = null;
        this.loadQuote(plan);
        // Keep the URL shareable and refresh-safe.
        this.router.navigate([], {relativeTo: this.route, queryParams: {planId: plan.id}, replaceUrl: true});
    }

    /** Fetches the server price for the plan; a newer selection cancels an older request. */
    private loadQuote(plan: PlanOffer) {
        this.quoteRequest?.unsubscribe();
        this.quote = null;
        this.quoteError = null;
        if (this.purchaseBlocked) { return; }

        this.isQuoting = true;
        this.quoteRequest = this.service.getQuote(plan.id)
            .pipe(finalize(() => this.isQuoting = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: quote => this.quote = quote,
                error: err => this.quoteError = errorMessageOf(err, 'Could not price this plan. Please try again.')
            });
    }

    selectPaymentMode(mode: PaymentModeOption) {
        if (this.submitting) { return; }
        this.f['paymentMode'].setValue(mode.id);
        this.f['paymentMode'].markAsTouched();
    }

    onSubmit() {
        this.customForm.markAllAsTouched();
        if (!this.canSubmit || this.customForm.invalid) { return; }

        if (!this.payByReference) {
            this.payOnline();
            return;
        }

        const v = this.customForm.getRawValue();
        const body: Omit<SubscriptionPurchaseRequest, 'idempotencyKey'> = {
            planId: this.selectedPlan!.id,
            paymentMode: v.paymentMode,
            paymentReferenceNumber: v.paymentReferenceNumber.trim(),
            billingName: v.billingName.trim(),
            billingEmail: v.billingEmail.trim(),
            billingContactNo: optional(v.billingContactNo),
            billingAddress: optional(v.billingAddress),
            taxNumber: optional(v.taxNumber),
            remark: optional(v.remark)
        };

        const fingerprint = JSON.stringify(body);
        if (this.attempt?.fingerprint !== fingerprint) {
            this.attempt = {key: newIdempotencyKey(), fingerprint};
        }

        this.submitting = true;
        this.submitError = null;
        this.customForm.disable({emitEvent: false});

        this.service.purchase({...body, idempotencyKey: this.attempt.key})
            .pipe(
                finalize(() => {
                    this.submitting = false;
                    this.customForm.enable({emitEvent: false});
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: result => {
                    this.attempt = null;
                    // The new plan's modules and seats apply right away; refresh guards and menus.
                    this.entitlements.load(true).subscribe();
                    this.alertService.showMessage('Subscription', result.isReplay
                        ? 'This payment was already recorded.'
                        : 'Payment recorded and your license is updated.', MessageSeverity.success);
                    this.router.navigate(['../payment-success'], {relativeTo: this.route, state: {[PURCHASE_RESULT_STATE_KEY]: result}});
                },
                error: err => this.submitError = errorMessageOf(err, 'The payment could not be recorded. Please try again.')
            });
    }

    /** Opens the gateway's hosted page. The gateway sends the browser back to payment-return, which confirms the payment. */
    private payOnline() {
        const v = this.customForm.getRawValue();
        const body = {
            planId: this.selectedPlan!.id,
            billingName: v.billingName.trim(),
            billingEmail: v.billingEmail.trim(),
            billingContactNo: optional(v.billingContactNo),
            billingAddress: optional(v.billingAddress),
            taxNumber: optional(v.taxNumber)
        };

        // A resubmit of the same details reuses the key, so the server returns the same checkout instead of a second one.
        const fingerprint = JSON.stringify(body);
        if (this.attempt?.fingerprint !== fingerprint) {
            this.attempt = {key: newIdempotencyKey(), fingerprint};
        }

        this.submitting = true;
        this.submitError = null;
        this.service.startCheckout({...body, idempotencyKey: this.attempt.key})
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: checkout => {
                    if (checkout.status === 'Pending' && checkout.checkoutUrl) {
                        // Leaving the app: keep the button disabled until the browser navigates away.
                        window.location.assign(checkout.checkoutUrl);
                        return;
                    }
                    this.submitting = false;
                    this.router.navigate(['../payment-return'], {relativeTo: this.route, queryParams: {checkout: checkout.id}});
                },
                error: err => {
                    this.submitting = false;
                    this.submitError = errorMessageOf(err, 'The payment could not be started. Please try again.');
                }
            });
    }

    trackById(_: number, item: {id: number}) { return item.id; }

    private apply(overview: SubscriptionOverview) {
        this.overview = overview;
        this.plans = overview.plans.filter(p => PAYABLE_ACTIONS.includes(p.action)).sort((a, b) => a.sortOrder - b.sortOrder);

        const requested = Number(this.route.snapshot.queryParamMap.get('planId'));
        this.requestedDowngrade = overview.plans.find(p => p.id === requested && p.action === 'Downgrade') ?? null;
        const moduleCode = this.route.snapshot.queryParamMap.get('module')?.toLowerCase();
        this.requestedModule = moduleCode
            ? overview.features.find(f => f.kind === 'Module' && f.code.toLowerCase() === moduleCode) ?? null
            : null;
        const module = this.requestedModule;

        this.selectedPlan =
            this.plans.find(p => p.id === requested) ??
            (module ? this.plans.find(p => featureCell(module, p.id).included) : undefined) ??
            this.plans.find(p => p.isCurrent) ??
            this.plans.find(p => p.isRecommended) ??
            this.plans[0] ?? null;

        if (this.selectedPlan) {
            this.loadQuote(this.selectedPlan);
        }

        // Online is the default; paying by reference only when it is the sole option.
        this.usePayByReference(!this.canPayOnline && this.canPayByReference);

        // Prefill billing details from the organisation's registered contact, without overwriting user input.
        const contact = overview.billingContact;
        if (contact && this.customForm.pristine) {
            this.customForm.patchValue({billingName: contact.name, billingEmail: contact.email, billingContactNo: contact.contactNo});
        }
    }
}
