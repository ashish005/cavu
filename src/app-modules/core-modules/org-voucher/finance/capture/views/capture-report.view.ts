import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {financeErrorOf} from "../../services/finance-api.service";
import {CaptureApiService} from "../capture-api.service";
import {CAPTURE_STATUS_LABEL, CAPTURE_STATUS_TONE, DocumentStat, ProviderReport, ProviderStat} from "../capture.models";

/**
 * OCR comparison report: per reader over a period, how often it read the document, how fast, how sure it was, how
 * often it agreed with the other readers, and how often it was right compared with what reviewers finally recorded
 * (converted documents only), field by field; then the documents compared, with their alignment and disagreements.
 */
@Component({standalone: false, templateUrl: './templates/capture-report.html'})
export class FinanceCaptureReportView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    readonly statusLabel = CAPTURE_STATUS_LABEL;
    readonly statusTone = CAPTURE_STATUS_TONE;
    from: string | null = null;
    to: string | null = null;
    report: ProviderReport | null = null;
    /** Readers with at least one reading (the others have nothing to show). */
    used: ProviderStat[] = [];
    loading = false;
    error: string | null = null;

    constructor(private api: CaptureApiService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.error = null;
        this.api.providerReport(this.from, this.to).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.report = r; this.from = r.from; this.to = r.to; this.used = r.providers.filter(p => p.readings > 0); },
            error: e => this.error = financeErrorOf(e, 'The report could not be loaded.')
        });
    }

    rate(n: number | null) { return n === null ? '—' : `${n}%`; }
    rateClass(n: number | null) { return n === null ? 'text-muted' : n >= 90 ? 'text-success' : n >= 70 ? 'text-warning' : 'text-danger'; }
    successRate(p: ProviderStat) { return p.readings ? Math.round(100 * p.succeeded / p.readings) : null; }
    seconds(ms: number | null) { return ms === null ? '—' : ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s`; }

    open(d: DocumentStat) {
        this.router.navigate(['../'], {relativeTo: this.route, queryParams: {capture: d.captureId}});
    }

    /** CSV of the per-reader figures, for sharing. */
    download() {
        const r = this.report;
        if (!r) { return; }
        const head = ['Reader', 'Engine', 'Readings', 'Succeeded', 'Failed', 'Avg ms', 'Avg confidence', 'Agreement %', 'Accuracy %', 'Checked', ...r.fieldKeys.map(k => k.label + ' %')];
        const rows = this.used.map(p => [p.label, p.engine, p.readings, p.succeeded, p.failed, p.avgDurationMs ?? '', p.avgConfidence ?? '', p.agreement ?? '', p.accuracy ?? '',
            p.checked, ...r.fieldKeys.map(k => p.fieldAccuracy[k.key] ?? '')]);
        const csv = [head, ...rows].map(line => line.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
        const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv'}));
        const a = document.createElement('a');
        a.href = url;
        a.download = `ocr-comparison-${r.from}-${r.to}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    trackProvider = (_: number, p: ProviderStat) => p.provider;
    trackDoc = (_: number, d: DocumentStat) => d.captureId;
}
