import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {
    LicenseSummary, PAYMENT_MODE_OPTIONS, PaymentModeOption, PlanOffer, SUBSCRIPTION_BILLING_CURRENCY,
    SubscriptionOverview, SubscriptionPurchaseRequest, isPurchaseBlocked
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

    readonly currency = SUBSCRIPTION_BILLING_CURRENCY;
    readonly paymentModes = PAYMENT_MODE_OPTIONS;

    overview: SubscriptionOverview | null = null;
    plans: PlanOffer[] = [];
    selectedPlan: PlanOffer | null = null;

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
                private service: SubscriptionService) {
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
    get purchaseBlocked(): boolean { return isPurchaseBlocked(this.license); }

    get selectedMode(): PaymentModeOption | null {
        return this.paymentModes.find(m => m.id === this.f['paymentMode'].value) ?? null;
    }

    /** Mirrors the API rule: renewing the current plan before it lapses extends the current term. */
    get extendsCurrentTerm(): boolean {
        const license = this.license;
        return !!license && !!this.selectedPlan && license.status === 'Active' && !license.isExpired && license.planId === this.selectedPlan.id;
    }

    get canSubmit(): boolean { return !!this.selectedPlan && !this.submitting && !this.purchaseBlocked; }

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
        // Keep the URL shareable and refresh-safe.
        this.router.navigate([], {relativeTo: this.route, queryParams: {planId: plan.id}, replaceUrl: true});
    }

    selectPaymentMode(mode: PaymentModeOption) {
        if (this.submitting) { return; }
        this.f['paymentMode'].setValue(mode.id);
        this.f['paymentMode'].markAsTouched();
    }

    onSubmit() {
        this.customForm.markAllAsTouched();
        if (!this.canSubmit || this.customForm.invalid) { return; }

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
                    this.alertService.showMessage('Subscription', result.isReplay
                        ? 'This payment was already recorded.'
                        : 'Payment recorded and your license is updated.', MessageSeverity.success);
                    this.router.navigate(['../payment-success'], {relativeTo: this.route, state: {[PURCHASE_RESULT_STATE_KEY]: result}});
                },
                error: err => this.submitError = errorMessageOf(err, 'The payment could not be recorded. Please try again.')
            });
    }

    trackById(_: number, item: {id: number}) { return item.id; }

    private apply(overview: SubscriptionOverview) {
        this.overview = overview;
        this.plans = overview.plans.filter(p => p.isPurchasable).sort((a, b) => a.sortOrder - b.sortOrder);

        const requested = Number(this.route.snapshot.queryParamMap.get('planId'));
        this.selectedPlan =
            this.plans.find(p => p.id === requested) ??
            this.plans.find(p => p.isCurrent) ??
            this.plans.find(p => p.isRecommended) ??
            this.plans[0] ?? null;

        // Prefill billing details from the organisation's registered contact, without overwriting user input.
        const contact = overview.billingContact;
        if (contact && this.customForm.pristine) {
            this.customForm.patchValue({billingName: contact.name, billingEmail: contact.email, billingContactNo: contact.contactNo});
        }
    }
}
