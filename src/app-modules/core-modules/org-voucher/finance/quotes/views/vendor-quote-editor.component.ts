import {Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize, map} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {todayIso, PartyOption} from "../../domains/finance.models";
import {FinanceApiService, financeErrorOf} from "../../services/finance-api.service";
import {PickerOption} from "../../views/finance-picker.component";
import {VendorQuoteApiService} from "../quote-api.service";
import {QuoteLookups, VendorQuote, VendorQuoteInput, VendorQuoteLineInput} from "../quote.models";

/**
 * Record or change a vendor's quotation: the vendor (a supplier on the books, or just a name), their reference, dates,
 * lead time and terms, currency, the client quote it is for, and the lines — what they will supply at what cost.
 */
@Component({selector: 'fin-vendor-quote-editor', standalone: false, templateUrl: './templates/vendor-quote-editor.html'})
export class VendorQuoteEditorComponent implements OnInit {
    @Input() vendorQuote: VendorQuote | null = null;
    @Input({required: true}) lookups!: QuoteLookups;
    /** For a new vendor quote: the client quote it prices. */
    @Input() salesQuoteId: string | null = null;
    @Output() closed = new EventEmitter<void>();
    @Output() saved = new EventEmitter<VendorQuote>();

    private readonly destroyRef = inject(DestroyRef);
    model!: Omit<VendorQuoteInput, 'lines'>;
    lines: VendorQuoteLineInput[] = [];
    vendorLabel: string | null = null;
    newVendor = false;
    busy = false;
    error: string | null = null;

    constructor(private api: VendorQuoteApiService, private finance: FinanceApiService, private alerts: AlertService) {}

    get currency() { return (this.model.currencyCode || this.lookups.functionalCurrency).toUpperCase(); }
    get used() { return this.vendorQuote?.row.usedLines ?? 0; }

    ngOnInit() {
        const v = this.vendorQuote;
        this.model = v ? {
            vendorAccountId: v.row.vendorAccountId, vendorName: v.row.vendorName, vendorReference: v.row.vendorReference, subject: v.row.subject,
            quoteDate: v.row.quoteDate, validUntil: v.row.validUntil, leadTimeDays: v.row.leadTimeDays, paymentTerms: v.paymentTerms, currencyCode: v.row.currencyCode,
            currencyRate: v.currencyRate !== 1 ? v.currencyRate : null, salesQuoteId: v.row.salesQuoteId, notes: v.notes
        } : {
            vendorAccountId: null, vendorName: null, vendorReference: null, subject: null, quoteDate: todayIso(), validUntil: null, leadTimeDays: null,
            paymentTerms: null, currencyCode: this.lookups.functionalCurrency, currencyRate: null, salesQuoteId: this.salesQuoteId, notes: null
        };
        this.vendorLabel = v?.row.vendorAccountId ? v.row.vendorName : null;
        this.newVendor = !!v && !v.row.vendorAccountId;
        this.lines = v ? v.lines.map(l => ({description: l.description, code: l.code, unit: l.unit, quantity: l.quantity, unitCost: l.unitCost, taxRate: l.taxRate}))
            : [this.blank()];
    }

    private blank(): VendorQuoteLineInput { return {description: '', code: null, unit: null, quantity: 1, unitCost: 0, taxRate: 0}; }
    addLine() { this.lines.push(this.blank()); }

    searchVendors = (term: string | null): Observable<PickerOption[]> =>
        this.finance.parties('Bill', term).pipe(map((list: PartyOption[]) => list.map(p => ({id: p.accountId, label: p.name, sub: p.number, data: p}))));

    pickVendor(o: PickerOption) {
        const p = o.data as PartyOption;
        this.model.vendorAccountId = p.accountId;
        this.model.vendorName = p.name;
        this.vendorLabel = p.name;
        if (p.currencyCode) { this.model.currencyCode = p.currencyCode; }
    }

    setNewVendor(on: boolean) {
        this.newVendor = on;
        if (on) { this.model.vendorAccountId = null; this.vendorLabel = null; } else { this.model.vendorName = null; }
    }

    net(l: VendorQuoteLineInput) { return Math.round((+l.quantity || 0) * (+l.unitCost || 0) * 100) / 100; }
    get subTotal() { return this.lines.reduce((t, l) => t + this.net(l), 0); }
    get taxTotal() { return this.lines.reduce((t, l) => t + this.net(l) * (+l.taxRate || 0) / 100, 0); }

    save() {
        this.error = null;
        const m = this.model;
        if (!m.vendorAccountId && !(m.vendorName ?? '').trim()) { this.error = 'Choose the vendor, or type their name.'; return; }
        const lines = this.lines.filter(l => (l.description ?? '').trim());
        if (!lines.length) { this.error = 'Add at least one line.'; return; }
        const num = (v: any) => v === null || v === '' || v === undefined ? null : +v;
        const body: VendorQuoteInput = {
            ...m, vendorName: (m.vendorName ?? '').trim() || null, currencyCode: (m.currencyCode ?? '').trim().toUpperCase() || null, currencyRate: num(m.currencyRate),
            leadTimeDays: num(m.leadTimeDays), validUntil: m.validUntil || null,
            lines: lines.map(l => ({...l, description: l.description.trim(), quantity: +l.quantity || 0, unitCost: +l.unitCost || 0, taxRate: +l.taxRate || 0}))
        };
        this.busy = true;
        this.api.save(this.vendorQuote?.row.id ?? null, body).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: v => { this.alerts.showMessage('Vendor quotes', `${v.row.number} saved.`, MessageSeverity.success); this.saved.emit(v); },
            error: e => this.error = financeErrorOf(e, 'The vendor quote could not be saved.')
        });
    }
}
