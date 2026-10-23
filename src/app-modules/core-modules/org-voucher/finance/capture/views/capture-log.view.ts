import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {financeErrorOf} from "../../services/finance-api.service";
import {CaptureApiService} from "../capture-api.service";
import {CaptureProvider, OcrLogStat, OcrRun, RUN_STATUS_TONE} from "../capture.models";

/**
 * OCR log: every call to an OCR provider (document, reader and model, how long, pages and tokens, what came back or
 * the error), with totals per reader. Filters by reader, status, dates and file name; a row opens its document.
 */
@Component({standalone: false, templateUrl: './templates/capture-log.html'})
export class FinanceCaptureLogView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    readonly tone = RUN_STATUS_TONE;
    readonly statuses = ['succeeded', 'running', 'failed', 'error'];
    providers: CaptureProvider[] = [];
    filter = {provider: null as string | null, status: null as string | null, from: null as string | null, to: null as string | null, search: null as string | null};
    page = {skip: 0, take: 50, page: 1, count: 0};
    runs: OcrRun[] = [];
    stats: OcrLogStat[] = [];
    loading = false;
    error: string | null = null;

    constructor(private api: CaptureApiService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.api.settings().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: s => this.providers = s.providers.filter(p => p.code !== 'auto'), error: () => {}});
        this.load();
    }

    load() {
        this.loading = true;
        this.error = null;
        this.api.log({...this.filter, skip: this.page.skip, take: this.page.take}).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: l => { this.runs = l.entities; this.stats = l.stats; this.page.count = l.count; },
            error: e => this.error = financeErrorOf(e, 'The OCR log could not be loaded.')
        });
    }

    search() { this.page = {...this.page, skip: 0, page: 1}; this.load(); }
    toPage(p: {skip: number; take: number; page?: number}) { this.page = {...this.page, skip: p.skip, take: p.take, page: p.page ?? Math.floor(p.skip / p.take) + 1}; this.load(); }

    successRate(s: OcrLogStat) { return s.calls ? Math.round(100 * s.succeeded / s.calls) : 0; }
    size(bytes: number | null) { return bytes === null ? '' : bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`; }

    open(r: OcrRun) { this.router.navigate(['../'], {relativeTo: this.route, queryParams: {capture: r.captureId}}); }

    trackRun = (_: number, r: OcrRun) => r.id;
}
