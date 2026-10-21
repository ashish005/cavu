import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {CATEGORY_ICON, CATEGORY_LABEL, ComplianceLookups, Dashboard, REGISTRATION_STATE, STATUS_BADGE, TaskRow, dueText} from "../domains/compliance.models";
import {ComplianceApiService, errorMessageOf} from "../services/compliance-api.service";

/** Where compliance stands: overdue, due this week, waiting for review, on-time rate, licences to renew, setup prompts. */
@Component({standalone: false, templateUrl: './templates/dashboard.html'})
export class ComplianceDashboardView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    readonly badge = STATUS_BADGE;
    readonly regState = REGISTRATION_STATE;
    readonly categoryLabel = CATEGORY_LABEL;
    readonly categoryIcon = CATEGORY_ICON;
    readonly dueText = dueText;
    lookups: ComplianceLookups | null = null;
    data: Dashboard | null = null;
    loading = false;
    error: string | null = null;
    openTaskId: string | null = null;

    constructor(private api: ComplianceApiService) {}

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.lookups = l, error: e => this.error = errorMessageOf(e, 'Could not load compliance.')});
        this.load();
    }

    load() {
        this.loading = true;
        this.api.dashboard().pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => this.data = d,
            error: e => this.error = errorMessageOf(e, 'Could not load the dashboard.')
        });
    }

    /** Height of a trend bar (share of the busiest month). */
    bar(n: number) {
        const max = Math.max(1, ...(this.data?.trend ?? []).map(m => m.onTime + m.late + m.missed));
        return `${Math.round(n / max * 100)}%`;
    }

    trackById(_: number, r: TaskRow) { return r.id; }
}
