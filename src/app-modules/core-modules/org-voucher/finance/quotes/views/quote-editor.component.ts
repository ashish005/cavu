import {Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize, map} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {todayIso, addDaysIso} from "../../domains/finance.models";
import {financeErrorOf} from "../../services/finance-api.service";
import {PickerOption} from "../../views/finance-picker.component";
import {QuoteApiService} from "../quote-api.service";
import {Quote, QuoteCustomer, QuoteInput, QuoteLineInput, QuoteLookups} from "../quote.models";

/**
 * Create or change a quote (drafts and approved quotes; a sent quote is revised instead). A customer or a prospect,
 * dates, owner and probability, then lines — items with quantity, price, cost, discount and tax, section headings,
 * optional extras the customer may choose — and the notes and terms printed on it. Totals here are a preview; the
 * server computes the stored ones with the tax engine.
 */
@Component({selector: 'fin-quote-editor', standalone: false, templateUrl: './templates/quote-editor.html'})
export class QuoteEditorComponent implements OnInit {
    @Input() quote: Quote | null = null;
    @Input({required: true}) lookups!: QuoteLookups;
    @Output() closed = new EventEmitter<void>();
    @Output() saved = new EventEmitter<Quote>();

    private readonly destroyRef = inject(DestroyRef);
    model!: Omit<QuoteInput, 'lines'>;
    lines: QuoteLineInput[] = [];
    customerLabel: string | null = null;
    prospect = false;
    files: {id: string; fileName: string}[] = [];
    uploading = false;
    showMore = false;
    busy = false;
    error: string | null = null;

    constructor(private api: QuoteApiService, private alerts: AlertService) {}

    get currency() { return (this.model.currencyCode || this.lookups.branchCurrency).toUpperCase(); }
    get salesTaxes() { return this.lookups.taxCodes.filter(t => t.scope !== 'Purchases'); }

    ngOnInit() {
        const q = this.quote;
        const s = this.lookups.settings;
        const today = todayIso();
        this.model = q ? {
            customerAccountId: q.customerAccountId, customerName: q.customerName, contactName: q.contactName, contactEmail: q.contactEmail, contactPhone: q.contactPhone,
            address: q.address, title: q.title, issueDate: q.issueDate, validUntil: q.validUntil, expectedCloseDate: q.expectedCloseDate, followUpDate: q.followUpDate,
            ownerUserId: q.ownerUserId, probability: q.probability, leadSource: q.leadSource, reference: q.reference, tags: q.tags, currencyCode: q.currencyCode,
            currencyRate: q.currencyRate !== 1 ? q.currencyRate : null, pricesIncludeTax: q.pricesIncludeTax, autoTax: false, adjustment: q.adjustment, notes: q.notes,
            terms: q.terms, internalNote: q.internalNote, fileIds: []
        } : {
            customerAccountId: null, customerName: null, contactName: null, contactEmail: null, contactPhone: null, address: null, title: null, issueDate: today,
            validUntil: addDaysIso(today, s.defaultValidityDays), expectedCloseDate: null, followUpDate: null, ownerUserId: null, probability: 50, leadSource: null,
            reference: null, tags: null, currencyCode: this.lookups.branchCurrency, currencyRate: null, pricesIncludeTax: this.lookups.pricesIncludeTax, autoTax: true,
            adjustment: 0, notes: s.defaultNotes, terms: s.defaultTerms, internalNote: null, fileIds: []
        };
        this.customerLabel = q?.customerAccountId ? q.customerName : null;
        this.prospect = !!q && q.isProspect;
        this.files = q?.files.map(f => ({id: f.id, fileName: f.fileName})) ?? [];
        this.lines = q ? q.lines.map(l => ({
            lineType: l.lineType, description: l.description, details: l.details, productId: l.productId, unit: l.unit, quantity: l.quantity, unitPrice: l.unitPrice,
            unitCost: l.unitCost, discountRate: l.discountRate, taxCodeId: l.taxCodeId, accountId: l.accountId, isOptional: l.isOptional, isSelected: l.isSelected
        })) : [this.blank()];
    }

    private blank(): QuoteLineInput {
        return {lineType: 'Item', description: '', details: null, productId: null, unit: null, quantity: 1, unitPrice: 0, unitCost: null, discountRate: 0,
            taxCodeId: this.lookups.defaultTaxCodeId, accountId: null, isOptional: false, isSelected: true};
    }

    addLine() { this.lines.push(this.blank()); }
    addSection() { this.lines.push({...this.blank(), lineType: 'Section', quantity: 0, taxCodeId: null}); }
    removeLine(i: number) { this.lines.splice(i, 1); }
    move(i: number, by: -1 | 1) {
        const j = i + by;
        if (j < 0 || j >= this.lines.length) { return; }
        [this.lines[i], this.lines[j]] = [this.lines[j], this.lines[i]];
    }

    searchCustomers = (term: string | null): Observable<PickerOption[]> =>
        this.api.customers(term).pipe(map((list: QuoteCustomer[]) => list.map(c => ({id: c.accountId, label: c.name, sub: [c.number, c.email].filter(Boolean).join(' · '), data: c}))));

    pickCustomer(o: PickerOption) {
        const c = o.data as QuoteCustomer;
        this.model.customerAccountId = c.accountId;
        this.model.customerName = c.name;
        this.customerLabel = c.name;
        this.model.contactName = this.model.contactName || c.contactName;
        this.model.contactEmail = c.email;
        this.model.contactPhone = c.phone;
        this.model.address = c.address;
        if (c.currencyCode) { this.model.currencyCode = c.currencyCode; }
        // The customer's tax (place of supply, exemptions) for lines still on the default.
        this.api.taxSuggestion(c.accountId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { if (r.taxCodeId) { this.lines.filter(l => l.lineType === 'Item' && (!l.taxCodeId || l.taxCodeId === this.lookups.defaultTaxCodeId)).forEach(l => l.taxCodeId = r.taxCodeId); } },
            error: () => {}
        });
    }

    setProspect(on: boolean) {
        this.prospect = on;
        if (on) { this.model.customerAccountId = null; this.customerLabel = null; } else { this.model.customerName = null; }
    }

    // ---------- Totals preview ----------

    private rate(id: string | null) { return id ? (this.lookups.taxCodes.find(t => t.id === id)?.rate ?? 0) : 0; }
    net(l: QuoteLineInput) { return l.lineType === 'Section' ? 0 : Math.round((+l.quantity || 0) * (+l.unitPrice || 0) * (1 - (+l.discountRate || 0) / 100) * 100) / 100; }
    tax(l: QuoteLineInput) {
        const amount = this.net(l);
        const r = this.rate(l.taxCodeId) / 100;
        return this.model.pricesIncludeTax ? amount - amount / (1 + r) : amount * r;
    }
    private counted() { return this.lines.filter(l => l.lineType === 'Item' && (!l.isOptional || l.isSelected)); }
    get subTotal() { return this.counted().reduce((t, l) => t + (this.model.pricesIncludeTax ? this.net(l) - this.tax(l) : this.net(l)), 0); }
    get taxTotal() { return this.counted().reduce((t, l) => t + this.tax(l), 0); }
    get total() { return this.subTotal + this.taxTotal + (+this.model.adjustment || 0); }
    get margin() {
        const items = this.counted().filter(l => l.unitCost !== null && (l.unitCost as any) !== '');
        if (!items.length) { return null; }
        const net = items.reduce((t, l) => t + this.net(l), 0);
        const cost = items.reduce((t, l) => t + (+l.quantity || 0) * (+(l.unitCost ?? 0)), 0);
        return net ? Math.round((net - cost) / net * 1000) / 10 : null;
    }

    // ---------- Files ----------

    upload(input: HTMLInputElement) {
        const file = input.files?.[0];
        input.value = '';
        if (!file) { return; }
        this.uploading = true;
        this.api.upload(file).pipe(finalize(() => this.uploading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: f => this.files.push(f),
            error: e => this.alerts.showMessage('Quote', financeErrorOf(e, 'The file could not be uploaded.'), MessageSeverity.error)
        });
    }

    // ---------- Save ----------

    save() {
        this.error = null;
        const m = this.model;
        if (!m.customerAccountId && !(m.customerName ?? '').trim()) { this.error = 'Choose a customer, or enter the prospect\'s name.'; return; }
        const lines = this.lines.filter(l => (l.description ?? '').trim());
        if (!lines.some(l => l.lineType === 'Item')) { this.error = 'Add at least one item.'; return; }
        const num = (v: any) => v === null || v === '' || v === undefined ? null : +v;
        const body: QuoteInput = {
            ...m, customerName: (m.customerName ?? '').trim() || null, currencyCode: (m.currencyCode ?? '').trim().toUpperCase() || null, currencyRate: num(m.currencyRate),
            probability: num(m.probability), adjustment: +m.adjustment || 0, fileIds: this.files.map(f => f.id),
            lines: lines.map(l => ({...l, description: l.description.trim(), quantity: +l.quantity || 0, unitPrice: +l.unitPrice || 0, unitCost: num(l.unitCost),
                discountRate: +l.discountRate || 0}))
        };
        this.busy = true;
        this.api.save(this.quote?.id ?? null, body).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: q => { this.alerts.showMessage('Quotes', `${q.number} saved.`, MessageSeverity.success); this.saved.emit(q); },
            error: e => this.error = financeErrorOf(e, 'The quote could not be saved.')
        });
    }
}
