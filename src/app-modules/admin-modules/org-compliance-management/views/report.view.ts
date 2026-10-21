import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {CATEGORIES, CATEGORY_LABEL, ComplianceCategory, ComplianceLookups, Report} from "../domains/compliance.models";
import {ComplianceApiService, errorMessageOf} from "../services/compliance-api.service";

/** Compliance status by obligation for a period (by due date): filed on time, late, not needed, open, overdue, paid. CSV export. */
@Component({standalone: false, templateUrl: './templates/report.html'})
export class ComplianceReportView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    readonly categories = CATEGORIES;
    readonly categoryLabel = CATEGORY_LABEL;
    lookups: ComplianceLookups | null = null;
    from = `${new Date().getFullYear()}-01-01`;
    to = '';
    category: ComplianceCategory | null = null;
    branchId: string | null = null;
    report: Report | null = null;
    loading = false;
    error: string | null = null;

    constructor(private api: ComplianceApiService) {}

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => { this.lookups = l; this.to = this.to || l.today; this.load(); }, error: e => this.error = errorMessageOf(e, 'Could not load compliance.')});
    }

    load() {
        this.loading = true;
        this.api.report({from: this.from || null, to: this.to || null, category: this.category, branchId: this.branchId})
            .pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: r => this.report = r,
                error: e => this.error = errorMessageOf(e, 'The report could not be loaded.')
            });
    }

    exportCsv() {
        const r = this.report;
        if (!r) { return; }
        const rows: (string | number | null)[][] = [
            ['Obligation', 'Area', 'Country', 'Due', 'On time', 'Late', 'Not needed', 'Open', 'Overdue', 'On-time %', `Paid (${r.currencyCode})`],
            ...r.rows.map(x => [x.name, CATEGORY_LABEL[x.category], x.countryCode, x.due, x.onTime, x.late, x.waived, x.open, x.overdue, x.onTimeRate, x.amountPaid]),
            ['Total', '', '', r.due, r.onTime, r.late, r.waived, r.open, r.overdue, r.onTimeRate, '']
        ];
        const csv = rows.map(line => line.map(c => { const s = String(c ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(',')).join('\n');
        const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8'}));
        const a = document.createElement('a');
        a.href = url; a.download = `compliance-${r.from}-${r.to}.csv`; a.click();
        URL.revokeObjectURL(url);
    }
}
