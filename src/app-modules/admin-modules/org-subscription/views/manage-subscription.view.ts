import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs";
import {AlertService, EntitlementService, MessageSeverity} from "@app-global";
import {
    DEFAULT_BILLING_CURRENCY, PlanOffer, SubscriptionChangePreview, SubscriptionChangeRequest, SubscriptionChangeType,
    SubscriptionOverview, SubscriptionSummary, addDays, describeChange, toIsoDate, billingLabel, termLabel
} from "../domains/subscription.models";
import {SubscriptionService, errorMessageOf, newIdempotencyKey} from "../services";

export type ManageAction = 'change' | 'pause' | 'resume' | 'cancel';

const CHANGE_TYPE: Record<ManageAction, SubscriptionChangeType> = {
    change: 'ChangePlan', pause: 'Pause', resume: 'Resume', cancel: 'Cancel'
};

const optional = (value: string | null | undefined): string | null => (value ?? '').trim() || null;

/**
 * Change plan, pause, resume or cancel. Every change is previewed by the API first (what happens, when, and what
 * blocks it), then confirmed. Upgrades are paid on the payment page; everything else is applied now or scheduled.
 */
@Component({
    standalone: false,
    templateUrl: './templates/manage-subscription.html'
})
export class ManageSubscriptionView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) public pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    readonly termLabel = termLabel;
    readonly billingLabel = billingLabel;
    readonly describeChange = describeChange;
    readonly today = toIsoDate(new Date());

    overview: SubscriptionOverview | null = null;
    action: ManageAction = 'change';

    isLoading = false;
    loadError: string | null = null;

    preview: SubscriptionChangePreview | null = null;
    previewError: string | null = null;
    isPreviewing = false;

    submitting = false;
    submitError: string | null = null;

    readonly form: FormGroup;

    /** Same request resubmitted (e.g. after a timeout) reuses the key, so the API applies it only once. */
    private attempt: {key: string; fingerprint: string} | null = null;

    constructor(private fb: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private alertService: AlertService,
                private entitlements: EntitlementService,
                private service: SubscriptionService) {
        this.form = this.fb.group({
            planId: [null],
            effectiveOn: [this.today],
            resumeOn: [null],
            reason: ['', [Validators.maxLength(500)]]
        });

        // A preview describes exactly what was reviewed; any edit needs a fresh one.
        this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.preview = null;
            this.previewError = null;
            this.submitError = null;
        });
    }

    get subscription(): SubscriptionSummary | null { return this.overview?.subscription ?? null; }
    get currency(): string { return this.subscription?.currencyCode ?? DEFAULT_BILLING_CURRENCY; }

    /** Actions the subscription allows right now, in display order. */
    get availableActions(): ManageAction[] {
        const sub = this.subscription;
        if (!sub) { return []; }
        const actions: ManageAction[] = [];
        if (sub.canChangePlan) { actions.push('change'); }
        if (sub.canPause) { actions.push('pause'); }
        if (sub.canResume) { actions.push('resume'); }
        if (sub.canCancel) { actions.push('cancel'); }
        return actions;
    }

    /** Plans the tenant can move to: cheaper ones are scheduled, dearer ones go to payment. */
    get targetPlans(): PlanOffer[] {
        return (this.overview?.plans ?? [])
            .filter(p => !p.isCurrent && (p.action === 'Downgrade' || p.action === 'Upgrade'))
            .sort((a, b) => a.sortOrder - b.sortOrder);
    }

    /** Latest resume date for a pause starting on the chosen day. */
    get maxResumeOn(): string | null {
        const sub = this.subscription;
        const start = this.form.value.effectiveOn || this.today;
        if (!sub) { return null; }
        if (this.action === 'resume' && sub.pausedOn) { return addDays(sub.pausedOn, sub.maxPauseDays); }
        return addDays(start, sub.maxPauseDays);
    }

    get confirmLabel(): string {
        const p = this.preview;
        if (!p) { return 'Confirm'; }
        if (p.requiresPayment) { return 'Continue to payment'; }
        switch (p.type) {
            case 'ChangePlan': return 'Schedule switch';
            case 'Pause': return p.isImmediate ? 'Pause now' : 'Schedule pause';
            case 'Resume': return p.isImmediate ? 'Resume now' : 'Set resume date';
            case 'Cancel': return 'Cancel at period end';
        }
    }

    ngOnInit() { this.load(); }

    load(refresh = false) {
        this.isLoading = true;
        this.loadError = null;
        this.service.getOverview(refresh)
            .pipe(finalize(() => this.isLoading = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: overview => this.apply(overview),
                error: err => this.loadError = errorMessageOf(err, 'Could not load your subscription. Please try again.')
            });
    }

    setAction(action: ManageAction) {
        if (this.submitting || action === this.action) { return; }
        this.router.navigate([], {relativeTo: this.route, queryParams: {action}, replaceUrl: true});
        this.action = action;
        this.resetForm();
    }

    review() {
        this.form.markAllAsTouched();
        if (this.form.invalid || this.isPreviewing) { return; }

        this.isPreviewing = true;
        this.previewError = null;
        this.service.previewChange({...this.body(), idempotencyKey: newIdempotencyKey()})
            .pipe(finalize(() => this.isPreviewing = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: preview => this.preview = preview,
                error: err => this.previewError = errorMessageOf(err, 'Could not check this change. Please try again.')
            });
    }

    confirm() {
        const preview = this.preview;
        if (!preview?.allowed || this.submitting) { return; }

        if (preview.requiresPayment) {
            this.router.navigate(['../payment'], {relativeTo: this.route, queryParams: {planId: preview.targetPlanId}});
            return;
        }

        const body = this.body();
        const fingerprint = JSON.stringify(body);
        if (this.attempt?.fingerprint !== fingerprint) {
            this.attempt = {key: newIdempotencyKey(), fingerprint};
        }

        this.submitting = true;
        this.submitError = null;
        this.service.requestChange({...body, idempotencyKey: this.attempt.key})
            .pipe(finalize(() => this.submitting = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    this.attempt = null;
                    const message = result.applied
                        ? 'Your subscription has been updated.'
                        : `Scheduled for ${result.change.effectiveOn}: ${describeChange(result.change)}.`;
                    this.alertService.showMessage('Subscription', message, MessageSeverity.success);
                    // Pause and resume change what the organisation may do right away.
                    this.entitlements.load(true).subscribe();
                    this.router.navigate(['../info'], {relativeTo: this.route});
                },
                error: err => this.submitError = errorMessageOf(err, 'The change could not be saved. Please try again.')
            });
    }

    trackById(_: number, item: {id: number}) { return item.id; }

    private apply(overview: SubscriptionOverview) {
        this.overview = overview;

        const requested = this.route.snapshot.queryParamMap.get('action') as ManageAction | null;
        const available = this.availableActions;
        this.action = requested && available.includes(requested) ? requested : available[0] ?? 'change';
        this.resetForm();
    }

    private resetForm() {
        const sub = this.subscription;
        const requestedPlan = Number(this.route.snapshot.queryParamMap.get('planId'));
        const planId = this.targetPlans.find(p => p.id === requestedPlan)?.id ?? this.targetPlans[0]?.id ?? null;
        const resumeDefault = sub ? addDays(this.today, Math.min(30, sub.maxPauseDays || 30)) : null;

        this.form.reset({
            planId,
            effectiveOn: this.today,
            resumeOn: this.action === 'pause' ? resumeDefault : null,
            reason: ''
        });

        const planControl = this.form.controls['planId'];
        planControl.setValidators(this.action === 'change' ? [Validators.required] : []);
        planControl.updateValueAndValidity({emitEvent: false});

        this.preview = null;
        this.previewError = null;
        this.submitError = null;
        this.attempt = null;
    }

    private body(): Omit<SubscriptionChangeRequest, 'idempotencyKey'> {
        const v = this.form.getRawValue();
        const type = CHANGE_TYPE[this.action];
        return {
            type,
            planId: type === 'ChangePlan' ? Number(v.planId) : null,
            effectiveOn: type === 'Pause' || type === 'Resume' ? (v.effectiveOn || null) : null,
            resumeOn: type === 'Pause' ? (v.resumeOn || null) : null,
            reason: optional(v.reason)
        };
    }
}
