import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, EntitlementService, MessageSeverity, SeatUsage, TenantEntitlementsResponse} from "@app-global";
import {
    DEFAULT_BILLING_CURRENCY, FeatureCell, LicenseSummary, PAYABLE_ACTIONS, PendingChange, PlanFeature, PlanOffer,
    SubscriptionOverview, SubscriptionStatus, SubscriptionSummary, describeChange, featureCell, isPurchaseBlocked, isQuantityFeature, billingLabel, termLabel
} from "../domains/subscription.models";
import {SubscriptionService, errorMessageOf} from "../services";

@Component({
    standalone: false,
    templateUrl: './templates/license-info.html'
})
export class LicenseInfoView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) public pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    readonly termLabel = termLabel;
    readonly billingLabel = billingLabel;

    readonly describeChange = describeChange;
    withdrawing = false;
    overview: SubscriptionOverview | null = null;
    plans: PlanOffer[] = [];
    moduleFeatures: PlanFeature[] = [];
    quantityFeatures: PlanFeature[] = [];
    usage: TenantEntitlementsResponse | null = null;
    isLoading = false;
    errorMessage: string | null = null;

    constructor(private service: SubscriptionService,
                private entitlements: EntitlementService,
                private alertService: AlertService) {}

    get license(): LicenseSummary | null { return this.overview?.license ?? null; }
    get subscription(): SubscriptionSummary | null { return this.overview?.subscription ?? null; }
    get currency(): string {
        return this.subscription?.currencyCode ?? this.plans[0]?.currencyCode ?? DEFAULT_BILLING_CURRENCY;
    }

    get subscriptionStatusClass(): string { return STATUS_CLASS[this.subscription?.status ?? 'Expired']; }
    get subscriptionStatusText(): string { return STATUS_TEXT[this.subscription?.status ?? 'Expired']; }
    /** Nothing can be bought now: paused (resume first), or a license state only support can fix. */
    get purchaseBlocked(): boolean { return this.needsSupport || this.subscription?.status === 'Paused'; }
    /** A paused subscription also has a suspended license, but the tenant can fix that by resuming. */
    get needsSupport(): boolean { return isPurchaseBlocked(this.license) && this.subscription?.status !== 'Paused'; }

    get statusClass(): string {
        const license = this.license;
        if (!license) { return 'grey'; }
        if (license.isExpired) { return license.inGracePeriod ? 'warn' : 'danger'; }
        if (license.status !== 'Active') { return 'danger'; }
        return license.showExpiryWarning ? 'warn' : 'success';
    }

    get statusText(): string {
        const license = this.license;
        if (!license) { return 'No license'; }
        if (license.status !== 'Active') { return license.status; }
        if (license.isExpired) { return license.inGracePeriod ? 'Expired (grace period)' : 'Expired'; }
        return 'Active';
    }

    ngOnInit() { this.load(); }

    load(refresh = false) {
        this.isLoading = true;
        this.errorMessage = null;
        this.service.getOverview(refresh)
            .pipe(finalize(() => this.isLoading = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: overview => {
                    this.overview = overview;
                    this.plans = [...overview.plans].sort((a, b) => a.sortOrder - b.sortOrder);
                    this.moduleFeatures = overview.features.filter(f => !isQuantityFeature(f));
                    this.quantityFeatures = overview.features.filter(isQuantityFeature);
                },
                error: err => this.errorMessage = errorMessageOf(err, 'Could not load your subscription. Please try again.')
            });

        // Usage is optional on this page: if it fails, the license details still show.
        this.entitlements.load(refresh)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(usage => this.usage = usage);
    }

    cell(feature: PlanFeature, plan: PlanOffer): FeatureCell { return featureCell(feature, plan.id); }

    isPayable(plan: PlanOffer): boolean { return PAYABLE_ACTIONS.includes(plan.action); }

    /** Button text for a plan, following the action the API decided. */
    planActionLabel(plan: PlanOffer): string {
        switch (plan.action) {
            case 'Renew': return 'Renew';
            case 'Upgrade': return 'Upgrade';
            case 'Downgrade': return 'Switch at period end';
            default: return 'Choose';
        }
    }

    /** Withdraws a scheduled change, e.g. keeps a subscription that was set to cancel. */
    withdraw(change: PendingChange) {
        if (this.withdrawing || !confirm(`Withdraw the scheduled change "${describeChange(change)}"?`)) { return; }

        this.withdrawing = true;
        this.service.cancelChange(change.id)
            .pipe(finalize(() => this.withdrawing = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.alertService.showMessage('Subscription', 'The scheduled change was withdrawn.', MessageSeverity.success);
                    this.load(true);
                },
                error: err => this.alertService.showMessage('Subscription', errorMessageOf(err, 'The change could not be withdrawn.'), MessageSeverity.error)
            });
    }

    /** Share of the seat limit in use, for the usage bar; 0 for unlimited seats. */
    seatPercent(seat: SeatUsage): number {
        return seat.limit ? Math.min(100, Math.round(seat.used / seat.limit * 100)) : 0;
    }

    seatBarClass(seat: SeatUsage): string {
        const percent = this.seatPercent(seat);
        return percent >= 100 ? 'danger' : percent >= 80 ? 'warn' : 'success';
    }

    trackById(_: number, item: {id: number}) { return item.id; }
    trackByCode(_: number, item: {code?: string; userTypeCode?: string}) { return item.code ?? item.userTypeCode; }
}

const STATUS_CLASS: Record<SubscriptionStatus, string> = {
    Active: 'success', PastDue: 'warn', Paused: 'info', Canceled: 'grey', Expired: 'danger', Suspended: 'danger'
};

const STATUS_TEXT: Record<SubscriptionStatus, string> = {
    Active: 'Active', PastDue: 'Renewal due', Paused: 'Paused', Canceled: 'Canceled', Expired: 'Expired', Suspended: 'Suspended'
};
