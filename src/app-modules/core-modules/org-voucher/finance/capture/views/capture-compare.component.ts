import {Component, DestroyRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Subscription, finalize, interval, switchMap} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {financeErrorOf} from "../../services/finance-api.service";
import {CaptureApiService} from "../capture-api.service";
import {COMPARE_STATUS_LABEL, COMPARE_STATUS_TONE, Capture, CaptureComparison, CaptureReading, CompareField} from "../capture.models";

const POLL_MS = 3000;

/**
 * Compare readers: what each OCR provider read from the document, field by field, with the consensus and the value
 * now on the document. Run more providers, re-run one, copy the consensus (or a single value, or one reader's lines)
 * into the document. Polls while readings are running.
 */
@Component({selector: 'capture-compare', standalone: false, templateUrl: './templates/capture-compare.html'})
export class CaptureCompareComponent implements OnChanges, OnDestroy {
    @Input({required: true}) captureId!: string;
    /** The document can still be changed (under review or failed). */
    @Input() editable = false;
    @Input() currency = '';
    /** The document after values were copied into it. */
    @Output() applied = new EventEmitter<Capture>();

    private readonly destroyRef = inject(DestroyRef);
    readonly statusLabel = COMPARE_STATUS_LABEL;
    readonly statusTone = COMPARE_STATUS_TONE;
    data: CaptureComparison | null = null;
    /** Readers chosen to run (ready ones not yet run, by default). */
    chosen = new Set<string>();
    loading = false;
    busy = false;
    error: string | null = null;
    showLines: string | null = null;
    private poll: Subscription | null = null;

    constructor(private api: CaptureApiService, private alerts: AlertService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['captureId']) { this.data = null; this.load(); }
    }

    ngOnDestroy() { this.poll?.unsubscribe(); }

    load(quiet = false) {
        if (!quiet) { this.loading = true; }
        this.error = null;
        this.api.readings(this.captureId).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => this.show(d),
            error: e => this.error = financeErrorOf(e, 'The readings could not be loaded.')
        });
    }

    private show(d: CaptureComparison) {
        const first = !this.data;
        this.data = d;
        if (first) {
            const done = new Set(d.readings.map(r => r.provider));
            this.chosen = new Set(d.runnable.filter(p => !p.simulated && !done.has(p.code)).map(p => p.code));
        }
        this.schedulePoll();
    }

    private schedulePoll() {
        if (!this.data?.running) { this.poll?.unsubscribe(); this.poll = null; return; }
        if (this.poll) { return; }
        this.poll = interval(POLL_MS).pipe(switchMap(() => this.api.readings(this.captureId)), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { this.data = d; if (!d.running) { this.poll?.unsubscribe(); this.poll = null; } },
            error: () => { this.poll?.unsubscribe(); this.poll = null; }
        });
    }

    reading(provider: string): CaptureReading | undefined { return this.data?.readings.find(r => r.provider === provider); }
    /** Columns: the providers that have (or are getting) a reading, the document's own reader first. */
    get columns(): CaptureReading[] { return this.data?.readings ?? []; }

    toggle(code: string) { this.chosen.has(code) ? this.chosen.delete(code) : this.chosen.add(code); }

    run(providers: string[], again = false) {
        if (!providers.length) { return; }
        this.busy = true;
        this.api.compare(this.captureId, providers, again).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { this.data = d; this.chosen.clear(); this.schedulePoll(); },
            error: e => this.alerts.showMessage('Compare', financeErrorOf(e, 'The readers could not be started.'), MessageSeverity.error)
        });
    }

    runChosen() { this.run([...this.chosen]); }

    /** Copies values into the document: all agreed fields, one field, or one reader's lines. */
    apply(source: string, fields: string[] = []) {
        if (!this.editable) { return; }
        this.busy = true;
        this.api.applyReading(this.captureId, source, fields).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: c => {
                this.applied.emit(c);
                this.alerts.showMessage('Compare', fields.length === 1 ? 'Value copied to the document.' : 'Values copied to the document.', MessageSeverity.success);
                this.load(true);
            },
            error: e => this.alerts.showMessage('Compare', financeErrorOf(e, 'The values could not be copied.'), MessageSeverity.error)
        });
    }

    cellOf(f: CompareField, provider: string) { return f.cells.find(c => c.provider === provider); }

    cellClass(f: CompareField, provider: string): string {
        const c = this.cellOf(f, provider);
        if (!c?.value) { return 'text-muted'; }
        return c.agrees === true ? 'text-success' : c.agrees === false ? 'text-danger' : '';
    }

    alignmentClass(a: number | null) { return a === null ? 'grey' : a >= 90 ? 'success' : a >= 70 ? 'warn' : 'danger'; }

    seconds(ms: number | null) { return ms === null ? '' : ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s`; }

    trackField = (_: number, f: CompareField) => f.key;
    trackReading = (_: number, r: CaptureReading) => r.id;
}
