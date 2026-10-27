import {Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize, map} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {todayIso, addDaysIso} from "../../domains/finance.models";
import {financeErrorOf} from "../../services/finance-api.service";
import {PickerOption} from "../../views/finance-picker.component";
import {QuoteApiService, VendorQuoteApiService} from "../quote-api.service";
import {
    Quote, QuoteApprovalStepSetting, QuoteChargeBasis, QuoteChargeSetting, QuoteCustomer, QuoteInput, QuoteLineInput, QuoteLookups, VendorQuote, VendorQuoteRow
} from "../quote.models";

/** A line being edited: the request plus where a vendor-priced item comes from (display only). */
type EditorLine = QuoteLineInput & {vendorLabel?: string | null};

/**
 * Create or change a quote (drafts and approved quotes; a sent quote is revised instead). The customer, the items —
 * typed in, or priced from a vendor's quotation at cost + markup — section headings, optional extras, then service,
 * handling or freight charges (a fixed amount or a % of the items), and a preview of totals, margin and the approval
 * steps the quote will need. Contacts, owner, notes, terms, currency and files sit under "More". Totals here are a
 * preview; the server computes the stored ones with the tax engine.
 */
@Component({selector: 'fin-quote-editor', standalone: false, templateUrl: './templates/quote-editor.html'})
export class QuoteEditorComponent implements OnInit {
    @Input() quote: Quote | null = null;
    @Input({required: true}) lookups!: QuoteLookups;
    @Output() closed = new EventEmitter<void>();
    @Output() saved = new EventEmitter<Quote>();

    private readonly destroyRef = inject(DestroyRef);
    model!: Omit<QuoteInput, 'lines'>;
    lines: EditorLine[] = [];
    charges: EditorLine[] = [];
    customerLabel: string | null = null;
    prospect = false;
    files: {id: string; fileName: string}[] = [];
    uploading = false;
    showMore = false;
    busy = false;
    error: string | null = null;

    // "Add from a vendor quote"
    vendorPicker = false;
    vendorQuotes: VendorQuoteRow[] | null = null;
    vendorQuote: VendorQuote | null = null;
    vendorPicked = new Set<string>();
    vendorMarkup: number | null = null;

    constructor(private api: QuoteApiService, private vendorApi: VendorQuoteApiService, private alerts: AlertService) {}

    get currency() { return (this.model.currencyCode || this.lookups.branchCurrency).toUpperCase(); }
    get salesTaxes() { return this.lookups.taxCodes.filter(t => t.scope !== 'Purchases'); }
    get standardCharges() { return this.lookups.settings.standardCharges ?? []; }
    chargeLabel(code: string | null) { return this.lookups.chargeTypes.find(t => t.code === code)?.label ?? 'Charge'; }

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
        const all: EditorLine[] = q ? q.lines.map(l => ({
            lineType: l.lineType, description: l.description, details: l.details, productId: l.productId, unit: l.unit, quantity: l.quantity, unitPrice: l.unitPrice,
            unitCost: l.unitCost, discountRate: l.discountRate, taxCodeId: l.taxCodeId, accountId: l.accountId, isOptional: l.isOptional, isSelected: l.isSelected,
            vendorQuoteLineId: l.vendorQuoteLineId, markupPercent: l.markupPercent, chargeType: l.chargeType, chargeBasis: l.chargeBasis, chargeRate: l.chargeRate,
            vendorLabel: l.vendorQuoteLineId ? [l.vendorQuoteNumber, l.vendorName].filter(Boolean).join(' · ') : null
        })) : [this.blank()];
        this.lines = all.filter(l => l.lineType !== 'Charge');
        this.charges = all.filter(l => l.lineType === 'Charge');
        this.vendorMarkup = s.defaultMarkupPercent;
    }

    private blank(): EditorLine {
        return {lineType: 'Item', description: '', details: null, productId: null, unit: null, quantity: 1, unitPrice: 0, unitCost: null, discountRate: 0,
            taxCodeId: this.lookups.defaultTaxCodeId, accountId: null, isOptional: false, isSelected: true, vendorQuoteLineId: null,
            markupPercent: null, chargeType: null, chargeBasis: null, chargeRate: null};
    }

    addLine() { this.lines.push(this.blank()); }
    addSection() { this.lines.push({...this.blank(), lineType: 'Section', quantity: 0, taxCodeId: null}); }
    removeLine(i: number) { this.lines.splice(i, 1); }
    move(i: number, by: -1 | 1) {
        const j = i + by;
        if (j < 0 || j >= this.lines.length) { return; }
        [this.lines[i], this.lines[j]] = [this.lines[j], this.lines[i]];
    }
    /** Stop taking the cost from the vendor quote; the cost stays as it was and can be changed. */
    detachVendor(l: EditorLine) { l.vendorQuoteLineId = null; l.vendorLabel = null; }

    // ---------- Charges ----------

    addCharge(c: QuoteChargeSetting | null = null) {
        this.charges.push({...this.blank(), lineType: 'Charge', description: c?.label ?? 'Handling charge', chargeType: c?.type ?? 'handling',
            chargeBasis: c?.basis ?? 'fixed', chargeRate: c && c.basis !== 'fixed' ? c.rate : null, unitPrice: c && c.basis === 'fixed' ? c.rate : 0,
            taxCodeId: c?.taxCodeId ?? this.lookups.defaultTaxCodeId});
    }
    /** The organisation's standard charges not on the quote yet. */
    addStandardCharges() {
        const missing = this.standardCharges.filter(c => !this.charges.some(x => x.chargeType === c.type && x.description.trim().toLowerCase() === c.label.trim().toLowerCase()));
        if (!missing.length) { this.alerts.showMessage('Quote', 'The standard charges are already on this quote.', MessageSeverity.info); return; }
        missing.forEach(c => this.addCharge(c));
    }
    setChargeType(l: EditorLine, type: string) {
        const was = this.chargeLabel(l.chargeType);
        l.chargeType = type;
        if (!l.description.trim() || l.description === was) { l.description = this.chargeLabel(type); }
    }
    setChargeBasis(l: EditorLine, basis: QuoteChargeBasis) {
        l.chargeBasis = basis;
        if (basis === 'fixed') { l.chargeRate = null; } else { l.unitPrice = 0; l.quantity = 1; }
    }

    // ---------- From a vendor quote ----------

    openVendorPicker() {
        this.vendorPicker = true;
        this.vendorQuote = null;
        this.vendorQuotes = null;
        this.vendorApi.open().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: list => this.vendorQuotes = list,
            error: e => { this.vendorQuotes = []; this.alerts.showMessage('Vendor quotes', financeErrorOf(e, 'Vendor quotes could not be loaded.'), MessageSeverity.error); }
        });
    }

    pickVendorQuote(v: VendorQuoteRow) {
        this.vendorApi.quote(v.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => {
                this.vendorQuote = d;
                const used = new Set(this.lines.map(l => l.vendorQuoteLineId).filter(Boolean));
                this.vendorPicked = new Set(d.lines.filter(l => !used.has(l.id)).map(l => l.id));
            },
            error: e => this.alerts.showMessage('Vendor quotes', financeErrorOf(e, 'The vendor quote could not be opened.'), MessageSeverity.error)
        });
    }

    toggleVendorLine(id: string) { if (this.vendorPicked.has(id)) { this.vendorPicked.delete(id); } else { this.vendorPicked.add(id); } }

    /** The picked vendor lines as items: cost in this quote's currency, price at cost + markup. */
    addVendorLines() {
        const v = this.vendorQuote;
        if (!v || !this.vendorPicked.size) { return; }
        const factor = (v.currencyRate || 1) / (+(this.model.currencyRate ?? 0) || 1);
        const markup = this.vendorMarkup === null || (this.vendorMarkup as any) === '' ? null : +this.vendorMarkup;
        const label = [v.row.number, v.row.vendorName].filter(Boolean).join(' · ');
        // Replace an empty first line rather than leaving it behind.
        if (this.lines.length === 1 && !this.lines[0].description.trim()) { this.lines = []; }
        v.lines.filter(l => this.vendorPicked.has(l.id)).forEach(l => {
            const cost = Math.round(l.unitCost * factor * 10000) / 10000;
            this.lines.push({...this.blank(), description: l.description, unit: l.unit, quantity: l.quantity, unitCost: cost, markupPercent: markup,
                unitPrice: markup === null ? cost : this.round(cost * (1 + markup / 100)), vendorQuoteLineId: l.id, vendorLabel: label});
        });
        this.vendorPicker = false;
    }

    // ---------- Customer ----------

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
            next: r => {
                if (r.taxCodeId) {
                    [...this.lines, ...this.charges].filter(l => l.lineType !== 'Section' && (!l.taxCodeId || l.taxCodeId === this.lookups.defaultTaxCodeId))
                        .forEach(l => l.taxCodeId = r.taxCodeId);
                }
            },
            error: () => {}
        });
    }

    setProspect(on: boolean) {
        this.prospect = on;
        if (on) { this.model.customerAccountId = null; this.customerLabel = null; } else { this.model.customerName = null; }
    }

    // ---------- Totals preview ----------

    private round(v: number) { return Math.round(v * 100) / 100; }
    private num(v: any) { return v === null || v === '' || v === undefined ? null : +v; }
    private rate(id: string | null) { return id ? (this.lookups.taxCodes.find(t => t.id === id)?.rate ?? 0) : 0; }

    /** The unit price: cost + markup when a markup is set, else as typed. */
    price(l: EditorLine) {
        const cost = this.num(l.unitCost), markup = this.num(l.markupPercent);
        return cost !== null && markup !== null ? this.round(cost * (1 + markup / 100)) : +l.unitPrice || 0;
    }
    priced(l: EditorLine) { return this.num(l.unitCost) !== null && this.num(l.markupPercent) !== null; }
    private itemNet(l: EditorLine) { return this.round((+l.quantity || 0) * this.price(l) * (1 - (+l.discountRate || 0) / 100)); }
    private exTax(l: EditorLine, amount: number) {
        const r = this.rate(l.taxCodeId) / 100;
        return this.model.pricesIncludeTax ? amount / (1 + r) : amount;
    }
    private counted() { return this.lines.filter(l => l.lineType === 'Item' && (!l.isOptional || l.isSelected)); }
    private get itemsCost() { return this.counted().reduce((t, l) => t + (+l.quantity || 0) * (this.num(l.unitCost) ?? 0), 0); }
    private get itemsSales() { return this.counted().reduce((t, l) => t + this.exTax(l, this.itemNet(l)), 0); }

    net(l: EditorLine) {
        if (l.lineType === 'Section') { return 0; }
        if (l.lineType !== 'Charge') { return this.itemNet(l); }
        const r = +(l.chargeRate ?? 0) || 0;
        switch (l.chargeBasis) {
            case 'percent_cost': return this.round(this.itemsCost * r / 100);
            case 'percent_sales': return this.round(this.itemsSales * r / 100);
            default: return this.round((+l.quantity || 1) * (+l.unitPrice || 0));
        }
    }
    tax(l: EditorLine) {
        const amount = this.net(l);
        const r = this.rate(l.taxCodeId) / 100;
        return this.model.pricesIncludeTax ? amount - amount / (1 + r) : amount * r;
    }
    lineMargin(l: EditorLine) {
        const cost = this.num(l.unitCost), net = this.exTax(l, this.itemNet(l));
        return cost === null || !net ? null : Math.round((net - (+l.quantity || 0) * cost) / net * 1000) / 10;
    }
    private included() { return [...this.counted(), ...this.charges]; }
    private exTaxNet(l: EditorLine) { return this.model.pricesIncludeTax ? this.net(l) - this.tax(l) : this.net(l); }
    get chargesTotal() { return this.charges.reduce((t, l) => t + this.exTaxNet(l), 0); }
    get subTotal() { return this.included().reduce((t, l) => t + this.exTaxNet(l), 0); }
    get taxTotal() { return this.included().reduce((t, l) => t + this.tax(l), 0); }
    get total() { return this.subTotal + this.taxTotal + (+this.model.adjustment || 0); }
    get costTotal() { return this.itemsCost + this.charges.reduce((t, l) => t + (+l.quantity || 1) * (this.num(l.unitCost) ?? 0), 0); }
    get vendorCost() { return this.counted().filter(l => l.vendorQuoteLineId).reduce((t, l) => t + (+l.quantity || 0) * (this.num(l.unitCost) ?? 0), 0); }
    get margin() {
        const costed = [...this.counted().filter(l => this.num(l.unitCost) !== null), ...this.charges];
        if (!costed.some(l => l.lineType === 'Item')) { return null; }
        const net = costed.reduce((t, l) => t + this.exTaxNet(l), 0);
        return net ? Math.round((net - this.costTotal) / net * 1000) / 10 : null;
    }

    /** The approval steps this quote would need as it stands (same rules as the server). */
    get approvalPreview(): {name: string; role: string | null; why: string[]}[] {
        const s = this.lookups.settings;
        const steps: QuoteApprovalStepSetting[] = s.approvalSteps?.length ? s.approvalSteps
            : (s.approvalAmount === null && s.maxDiscountWithoutApproval === null && s.minMarginPercent === null) ? []
                : [{name: 'Manager approval', totalAtLeast: s.approvalAmount, discountAbove: s.maxDiscountWithoutApproval, marginBelow: s.minMarginPercent, always: false, approverRoleId: null}];
        const base = this.total * (+(this.model.currencyRate ?? 0) || 1);
        const disc = Math.max(0, ...this.lines.filter(l => l.lineType === 'Item').map(l => +l.discountRate || 0));
        const margin = this.margin;
        return steps.map(st => {
            const why: string[] = [];
            if (st.always) { why.push('every quote'); }
            if (st.totalAtLeast !== null && base >= st.totalAtLeast) { why.push(`total ≥ ${st.totalAtLeast}`); }
            if (st.discountAbove !== null && disc > st.discountAbove) { why.push(`discount > ${st.discountAbove}%`); }
            if (st.marginBelow !== null && margin !== null && margin < st.marginBelow) { why.push(`margin < ${st.marginBelow}%`); }
            return {name: st.name, role: this.lookups.roles.find(r => r.code === st.approverRoleId)?.label ?? null, why};
        }).filter(x => x.why.length);
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
        const charges = this.charges.filter(l => (l.description ?? '').trim());
        const bad = charges.find(l => l.chargeBasis !== 'fixed' && !(+(l.chargeRate ?? 0) > 0));
        if (bad) { this.error = `Enter the percentage for ${bad.description}.`; return; }
        const num = (v: any) => this.num(v);
        const body: QuoteInput = {
            ...m, customerName: (m.customerName ?? '').trim() || null, currencyCode: (m.currencyCode ?? '').trim().toUpperCase() || null, currencyRate: num(m.currencyRate),
            probability: num(m.probability), adjustment: +m.adjustment || 0, fileIds: this.files.map(f => f.id),
            lines: [...lines, ...charges].map(({vendorLabel, ...l}) => ({...l, description: l.description.trim(), quantity: +l.quantity || (l.lineType === 'Charge' ? 1 : 0),
                unitPrice: l.lineType === 'Item' ? this.price(l) : +l.unitPrice || 0, unitCost: num(l.unitCost), discountRate: +l.discountRate || 0,
                markupPercent: l.lineType === 'Item' ? num(l.markupPercent) : null, chargeRate: num(l.chargeRate)}))
        };
        this.busy = true;
        this.api.save(this.quote?.id ?? null, body).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: q => { this.alerts.showMessage('Quotes', `${q.number} saved.`, MessageSeverity.success); this.saved.emit(q); },
            error: e => this.error = financeErrorOf(e, 'The quote could not be saved.')
        });
    }
}
