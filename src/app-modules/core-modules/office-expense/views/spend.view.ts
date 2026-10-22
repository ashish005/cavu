import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {ExpenseApiService, expenseErrorOf} from "../expense-api.service";
import {SpendReport} from "../expense.models";

/** Posted expense spend by category, employee, month, cost centre or merchant (functional currency); exports to CSV. */
@Component({standalone: false, templateUrl: './templates/spend.html'})
export class ExpenseSpendView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    readonly groups = [
        {key: 'category', label: 'Category'}, {key: 'employee', label: 'Employee'}, {key: 'month', label: 'Month'},
        {key: 'cost_center', label: 'Cost centre'}, {key: 'merchant', label: 'Merchant'}
    ];
    groupBy = 'category';
    from: string | null = null;
    to: string | null = null;
    report: SpendReport | null = null;
    loading = false;
    error: string | null = null;

    constructor(private api: ExpenseApiService) {}

    ngOnInit() { this.run(); }

    get max() { return Math.max(1, ...(this.report?.rows ?? []).map(r => r.amount)); }
    get groupLabel() { return this.groups.find(g => g.key === this.groupBy)?.label ?? ''; }

    run() {
        this.loading = true;
        this.error = null;
        this.api.spend(this.from, this.to, this.groupBy).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.report = r; this.from = r.from; this.to = r.to; },
            error: e => this.error = expenseErrorOf(e, 'The report could not be loaded.')
        });
    }

    exportCsv() {
        const r = this.report;
        if (!r) { return; }
        const rows = [[this.groupLabel, 'Claims', 'Expenses', 'Amount', 'Tax', 'Billable'], ...r.rows.map(x => [x.label, x.claims, x.lines, x.amount, x.tax, x.billable])];
        const csv = rows.map(row => row.map(c => { const s = String(c ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(',')).join('\n');
        const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8'}));
        const a = document.createElement('a');
        a.href = url; a.download = `expense-spend-by-${r.groupBy}_${r.from}_${r.to}.csv`; a.click();
        URL.revokeObjectURL(url);
    }
}
