import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {
    LicenseSummary, PlanFeature, PlanOffer, SUBSCRIPTION_BILLING_CURRENCY, SubscriptionOverview, featureValue, isPurchaseBlocked
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

    readonly currency = SUBSCRIPTION_BILLING_CURRENCY;
    overview: SubscriptionOverview | null = null;
    plans: PlanOffer[] = [];
    isLoading = false;
    errorMessage: string | null = null;

    constructor(private service: SubscriptionService) {}

    get license(): LicenseSummary | null { return this.overview?.license ?? null; }
    get purchaseBlocked(): boolean { return isPurchaseBlocked(this.license); }

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
                },
                error: err => this.errorMessage = errorMessageOf(err, 'Could not load your subscription. Please try again.')
            });
    }

    featureValue(feature: PlanFeature, plan: PlanOffer): string | null { return featureValue(feature, plan.id); }

    trackById(_: number, item: {id: number}) { return item.id; }
}
