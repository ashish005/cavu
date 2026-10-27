import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {EMPTY, expand, finalize, last, switchMap, timer} from "rxjs";
import {AlertService, DateFormatCell, MessageSeverity, ViewExtender} from "@app-global";
import {FinanceGridEvents, financeErrorOf} from "../../services/finance-api.service";
import {formatMoney} from "../../grid-cells/finance-cells";
import {CaptureApiService} from "../../capture/capture-api.service";
import {Capture} from "../../capture/capture.models";
import {QuoteApiService, VendorQuoteApiService, VendorQuoteGridService} from "../quote-api.service";
import {VendorQuoteNumberCell, VendorQuoteStatusCell} from "../quote-cells";
import {QuoteLookups, VendorComparisonItem, VendorQuote, VendorQuoteComparison, VendorQuoteQueryOptions, VendorQuoteRow} from "../quote.models";

/**
 * Third parties' quotations: recorded by hand or read from a scan, compared side by side per item, shortlisted,
 * selected or rejected, and priced into client quotes at cost + markup. Deep links `?vq=<id>`, `?new=1`,
 * `?compare=<client quote id>`.
 */
@Component({standalone: false, templateUrl: './templates/vendor-quotes.html'})
export class FinanceVendorQuotesView extends ViewExtender<VendorQuoteRow> implements OnInit {
    override coreState = new VendorQuoteQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    readonly filters: {key: string | null; label: string}[] = [
        {key: 'open', label: 'Open'}, {key: 'received', label: 'Received'}, {key: 'shortlisted', label: 'Shortlisted'}, {key: 'selected', label: 'Selected'},
        {key: 'rejected', label: 'Rejected'}, {key: null, label: 'All'}
    ];
    lookups: QuoteLookups | null = null;
    vendorQuote: VendorQuote | null = null;
    editing: {vendorQuote: VendorQuote | null} | null = null;
    // Compare
    comparePicker: VendorQuoteRow[] | null = null;
    compareIds = new Set<string>();
    comparison: VendorQuoteComparison | null = null;
    // Scan
    scanning: string | null = null;

    constructor(public override service: VendorQuoteGridService, public override activatedRoute: ActivatedRoute, private api: VendorQuoteApiService,
                private quotes: QuoteApiService, private capture: CaptureApiService, private events: FinanceGridEvents, private alerts: AlertService,
                private router: Router) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Vendor quote', field: 'number', cellTemplate: VendorQuoteNumberCell},
            {headerName: 'Vendor', field: 'vendorName'},
            {headerName: 'Date', field: 'quoteDate', cellTemplate: DateFormatCell},
            {headerName: 'Valid until', field: 'validUntil', cellTemplate: DateFormatCell},
            {headerName: 'Lead time', field: 'leadTimeDays', class: 'text-right', cellFn: (r: VendorQuoteRow) => r.leadTimeDays === null ? '' : `${r.leadTimeDays} d`},
            {headerName: 'Total', field: 'total', class: 'text-right', cellFn: (r: VendorQuoteRow) => formatMoney(r.total, r.currencyCode)},
            {headerName: 'Client quote', field: 'salesQuoteNumber', cellFn: (r: VendorQuoteRow) => r.salesQuoteNumber ?? ''},
            {headerName: 'Status', field: 'status', cellTemplate: VendorQuoteStatusCell}
        ];
        this.coreState.take = 25;
    }

    get errorText() { return this.errorMsg ? financeErrorOf(this.errorMsg, 'Vendor quotes could not be loaded.') : null; }

    ngOnInit() {
        this.quotes.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: l => this.lookups = l,
            error: e => this.alerts.showMessage('Vendor quotes', financeErrorOf(e, 'Vendor quotes could not be loaded.'), MessageSeverity.error)
        });
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'vendor_quote') { this.openRow(a.row.id); } });
        this.activatedRoute.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(q => {
            const id = q.get('vq');
            if (id && id !== this.vendorQuote?.row.id) { this.open(id); }
            if (q.get('new') === '1' && !this.editing) { this.vendorQuote = null; this.editing = {vendorQuote: null}; }
            const compare = q.get('compare');
            if (compare) { this.compare(compare, []); }
        });
        this.populateGrid();
    }

    setFilter(key: string | null) { this.coreState.status = key; this.coreState.skip = 0; this.coreState.page = 1; this.populateGrid(); }
    search() { this.coreState.skip = 0; this.populateGrid(); }
    actionCb(_: any) {}

    openRow(id: string) { this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {vq: id, new: null, compare: null}, queryParamsHandling: 'merge'}); }

    open(id: string) {
        this.api.quote(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: v => { this.vendorQuote = v; this.editing = null; this.comparison = null; },
            error: e => this.alerts.showMessage('Vendor quotes', financeErrorOf(e, 'The vendor quote could not be opened.'), MessageSeverity.error)
        });
    }

    newVendorQuote() { this.vendorQuote = null; this.comparison = null; this.editing = {vendorQuote: null}; }

    closePanels() {
        this.vendorQuote = null;
        this.editing = null;
        this.comparison = null;
        this.comparePicker = null;
        this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {vq: null, new: null, compare: null}, queryParamsHandling: 'merge', replaceUrl: true});
    }

    closeEditor() { if (this.editing?.vendorQuote) { this.vendorQuote = this.editing.vendorQuote; this.editing = null; } else { this.closePanels(); } }

    saved(v: VendorQuote) {
        this.editing = null;
        this.vendorQuote = v;
        this.refreshGrid();
        this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {vq: v.row.id, new: null}, queryParamsHandling: 'merge', replaceUrl: true});
    }

    changed(v: VendorQuote | null) {
        this.vendorQuote = v;
        if (!v) { this.closePanels(); }
        this.refreshGrid();
    }

    /** A client quote (made or changed from a vendor quote) in the client quotes list. */
    openQuote(id: string) { this.router.navigate(['sales/quotes'], {relativeTo: this.activatedRoute.parent, queryParams: {quote: id}}); }

    // ---------- Compare ----------

    startCompare() {
        this.vendorQuote = null;
        this.comparison = null;
        this.compareIds.clear();
        this.comparePicker = [];
        this.api.open().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: list => this.comparePicker = list,
            error: e => { this.comparePicker = null; this.alerts.showMessage('Vendor quotes', financeErrorOf(e, 'Vendor quotes could not be loaded.'), MessageSeverity.error); }
        });
    }
    compareSelected() { this.compare(null, [...this.compareIds]); }
    toggleCompare(id: string) { if (this.compareIds.has(id)) { this.compareIds.delete(id); } else { this.compareIds.add(id); } }

    compare(salesQuoteId: string | null, ids: string[]) {
        this.api.compare(salesQuoteId, ids).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: c => { this.comparison = c; this.comparePicker = null; this.vendorQuote = null; },
            error: e => this.alerts.showMessage('Compare', financeErrorOf(e, 'The vendor quotes could not be compared.'), MessageSeverity.error)
        });
    }
    cell(item: VendorComparisonItem, vendorQuoteId: string) { return item.cells.find(c => c.vendorQuoteId === vendorQuoteId) ?? null; }
    quoteTotal(id: string) {
        return this.comparison?.items.reduce((t, i) => t + (this.cell(i, id)?.baseAmount ?? 0), 0) ?? 0;
    }
    missing(id: string) { return this.comparison?.items.filter(i => !this.cell(i, id)).length ?? 0; }

    // ---------- Scan a vendor's quotation ----------

    /** Upload the vendor's quotation to document capture, wait for it to be read, and record it as a vendor quote. */
    scan(input: HTMLInputElement) {
        const file = input.files?.[0];
        input.value = '';
        if (!file) { return; }
        this.scanning = `Reading ${file.name}…`;
        // "Journal" so capture never drafts a bill from it; the capture is closed once the vendor quote is made.
        this.capture.upload([file], 'Journal').pipe(
            switchMap(r => {
                const item = r.items[0];
                if (!item) { throw {message: r.problems.join(' ') || 'The file was not accepted.'}; }
                return this.capture.capture(item.id).pipe(
                    expand((c: Capture, i: number) => (c.row.status === 'Queued' || c.row.status === 'Processing') && i < 100 ? timer(3000).pipe(switchMap(() => this.capture.capture(item.id))) : EMPTY),
                    last(),
                    switchMap((c: Capture) => {
                        if (c.row.status === 'Queued' || c.row.status === 'Processing') {
                            throw {message: 'Still reading after five minutes. Open it from Scan bills & receipts later, or record the quote by hand.'};
                        }
                        if (c.row.status === 'Failed') { throw {message: c.row.error || 'The document could not be read.'}; }
                        return this.api.fromCapture(c.row.id, null, null);
                    }));
            }),
            last(), finalize(() => this.scanning = null), takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: v => {
                this.alerts.showMessage('Vendor quotes', `${v.row.number} read from ${file.name}. Check the lines before pricing it.`, MessageSeverity.success);
                this.refreshGrid();
                this.vendorQuote = null;
                this.editing = {vendorQuote: v};
            },
            error: e => this.alerts.showMessage('Scan', financeErrorOf(e, e?.message || 'The quotation could not be read.'), MessageSeverity.error)
        });
    }
}
