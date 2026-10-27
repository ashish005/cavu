import {Component, DestroyRef, EventEmitter, Input, OnChanges, Output, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize, map} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {financeErrorOf} from "../../services/finance-api.service";
import {PickerOption} from "../../views/finance-picker.component";
import {QuoteApiService, VendorQuoteApiService} from "../quote-api.service";
import {Quote, QuoteCustomer, QuoteLookups, QuoteRow, VENDOR_QUOTE_STATUS_LABEL, VENDOR_QUOTE_STATUS_TONE, VendorQuote} from "../quote.models";

type Panel = 'reject' | 'price' | null;

/**
 * One vendor quote: its lines and where they are quoted, shortlisting / selecting / rejecting it (with a reason), and
 * pricing its lines into a client quote at cost + markup — a new quote for a customer, or a draft already started.
 */
@Component({selector: 'fin-vendor-quote-detail', standalone: false, templateUrl: './templates/vendor-quote-detail.html'})
export class VendorQuoteDetailComponent implements OnChanges {
    @Input({required: true}) vendorQuote!: VendorQuote;
    @Input({required: true}) lookups!: QuoteLookups;
    @Output() closed = new EventEmitter<void>();
    @Output() edit = new EventEmitter<VendorQuote>();
    @Output() changed = new EventEmitter<VendorQuote | null>();
    @Output() openQuote = new EventEmitter<string>();

    private readonly destroyRef = inject(DestroyRef);
    readonly statusLabel = VENDOR_QUOTE_STATUS_LABEL as Record<string, string>;
    readonly tone = VENDOR_QUOTE_STATUS_TONE as Record<string, string>;
    panel: Panel = null;
    busy = false;
    error: string | null = null;
    rejectReason = '';
    price = {target: 'new' as 'new' | 'existing', customerAccountId: null as string | null, customerLabel: null as string | null, prospect: '',
        title: '', salesQuoteId: null as string | null, salesQuoteLabel: null as string | null, markup: null as number | null, charges: true,
        lines: {} as Record<string, boolean>};

    constructor(private api: VendorQuoteApiService, private quotes: QuoteApiService, private alerts: AlertService) {}

    get row() { return this.vendorQuote.row; }
    get canDelete() { return !this.row.usedLines; }

    ngOnChanges() { this.panel = null; this.error = null; }

    open(panel: Panel) {
        this.error = null;
        this.panel = this.panel === panel ? null : panel;
        if (panel === 'reject') { this.rejectReason = ''; }
        if (panel === 'price') {
            this.price = {target: this.row.salesQuoteId ? 'existing' : 'new', customerAccountId: null, customerLabel: null, prospect: '', title: this.row.subject ?? '',
                salesQuoteId: this.row.salesQuoteId, salesQuoteLabel: this.row.salesQuoteNumber, markup: this.lookups.settings.defaultMarkupPercent,
                charges: !!this.lookups.settings.standardCharges?.length, lines: Object.fromEntries(this.vendorQuote.lines.map(l => [l.id, !l.usedOnQuotes]))};
        }
    }

    private done(v: VendorQuote, message: string) {
        this.alerts.showMessage('Vendor quotes', message, MessageSeverity.success);
        this.panel = null;
        this.changed.emit(v);
    }

    setStatus(status: string) {
        if (status === 'rejected' && !this.rejectReason.trim()) { this.error = 'Say why it is rejected (price, lead time, specification…).'; return; }
        this.busy = true;
        this.error = null;
        this.api.setStatus(this.row.id, status, status === 'rejected' ? this.rejectReason.trim() : null)
            .pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: v => this.done(v, `${v.row.number} is ${this.statusLabel[v.row.status].toLowerCase()}.`),
                error: e => this.error = financeErrorOf(e, 'The status could not be changed.')
            });
    }

    remove() {
        if (!confirm(`Delete ${this.row.number}?`)) { return; }
        this.busy = true;
        this.api.delete(this.row.id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.changed.emit(null),
            error: e => this.error = financeErrorOf(e, 'The vendor quote could not be deleted.')
        });
    }

    searchCustomers = (term: string | null): Observable<PickerOption[]> =>
        this.quotes.customers(term).pipe(map((list: QuoteCustomer[]) => list.map(c => ({id: c.accountId, label: c.name, sub: c.number}))));
    searchDrafts = (term: string | null): Observable<PickerOption[]> =>
        this.quotes.drafts(term).pipe(map((list: QuoteRow[]) => list.map(q => ({id: q.id, label: `${q.number} · ${q.customerName}`, sub: q.title}))));

    toClientQuote() {
        const p = this.price;
        const lineIds = Object.entries(p.lines).filter(([, on]) => on).map(([id]) => id);
        if (!lineIds.length) { this.error = 'Pick the lines to quote.'; return; }
        if (p.target === 'existing' && !p.salesQuoteId) { this.error = 'Choose the draft quote to add to.'; return; }
        if (p.target === 'new' && !p.customerAccountId && !p.prospect.trim()) { this.error = 'Choose the customer, or type the prospect\'s name.'; return; }
        const markup = p.markup === null || (p.markup as any) === '' ? null : +p.markup;
        this.busy = true;
        this.error = null;
        this.api.toClientQuote(this.row.id, {
            salesQuoteId: p.target === 'existing' ? p.salesQuoteId : null, customerAccountId: p.target === 'new' ? p.customerAccountId : null,
            customerName: p.target === 'new' && !p.customerAccountId ? p.prospect.trim() : null, title: p.title.trim() || null, lineIds, markupPercent: markup,
            addStandardCharges: p.charges
        }).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (q: Quote) => { this.alerts.showMessage('Client quote', `Priced into ${q.number}.`, MessageSeverity.success); this.openQuote.emit(q.id); },
            error: e => this.error = financeErrorOf(e, 'The client quote could not be prepared.')
        });
    }

    file(fileId: string) {
        const tab = window.open('', '_blank');
        this.api.fileUrl(this.row.id, fileId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: url => { if (tab) { tab.location.href = url; } setTimeout(() => URL.revokeObjectURL(url), 60_000); },
            error: e => { tab?.close(); this.alerts.showMessage('Vendor quote', financeErrorOf(e, 'The file could not be opened.'), MessageSeverity.error); }
        });
    }
}
