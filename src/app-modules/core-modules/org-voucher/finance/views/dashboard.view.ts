import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FinanceDashboard, KINDS} from "../domains/finance.models";
import {FinanceApiService, financeErrorOf} from "../services/finance-api.service";
import {ROUTE_OF_KIND} from "./documents.view";

/** Finance at a glance: cash, what customers owe, what is owed, this month's result, aging, overdue items, things to do. */
@Component({standalone: false, templateUrl: './templates/dashboard.html'})
export class FinanceDashboardView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    readonly kinds = KINDS;
    readonly routes = ROUTE_OF_KIND;
    data: FinanceDashboard | null = null;
    error: string | null = null;
    loading = false;

    constructor(private api: FinanceApiService) {}

    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.api.dashboard().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { this.data = d; this.loading = false; this.error = null; },
            error: e => { this.loading = false; this.error = financeErrorOf(e, 'The dashboard could not be loaded.'); }
        });
    }

    /** Bar height (percent of the largest month). */
    bar(value: number) {
        const max = Math.max(1, ...(this.data?.trend ?? []).flatMap(t => [t.income, t.expenses]));
        return Math.max(2, Math.round(Math.abs(value) / max * 100));
    }

    agingRows(a: FinanceDashboard['receivableAging']) {
        return [{label: 'Not due', value: a.current}, {label: '1–30 days', value: a.days1To30}, {label: '31–60', value: a.days31To60},
            {label: '61–90', value: a.days61To90}, {label: 'Over 90', value: a.over90}];
    }

    share(value: number, total: number) { return total ? Math.round(value / total * 100) : 0; }

    docLink(kind: keyof typeof ROUTE_OF_KIND) { return ['../', ...ROUTE_OF_KIND[kind].split('/')]; }
}
