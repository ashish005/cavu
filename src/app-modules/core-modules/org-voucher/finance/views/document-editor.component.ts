import {Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize, map} from "rxjs";
import {
    AccountOption, FinanceDoc, FinanceDocInput, FinanceKind, FinanceLine, FinanceLookups, JournalLineInput, KINDS, KindInfo, ModeOption, OpenDoc, TAX_LOCATION_LABEL,
    TaxOption, TaxSuggestion, addDaysIso, todayIso
} from "../domains/finance.models";
import {FinanceApiService, financeErrorOf} from "../services/finance-api.service";
import {PickerOption} from "./finance-picker.component";
import {InventoryApiService} from "../inventory/inventory-api.service";
import {ItemOption, Warehouse} from "../inventory/inventory.models";

interface AllocationRow extends OpenDoc { apply: number | null; }

/**
 * Creates or edits a draft of any finance document. The form adapts to the kind: item lines (invoices, bills, notes),
 * amount and what it pays (receipts, payments), debit/credit lines (journals), or from/to accounts (transfers).
 * Totals shown are a preview; the server computes and stores the real ones.
 */
@Component({
    selector: 'fin-document-editor',
    standalone: false,
    templateUrl: './templates/document-editor.html'
})
export class FinanceDocumentEditorComponent implements OnInit {
    @Input({required: true}) kind!: FinanceKind;
    /** The draft being edited (null for a new document). */
    @Input() doc: FinanceDoc | null = null;
    /** Pre-selected party (e.g. "new invoice" from a customer). */
    @Input() partyAccountId: string | null = null;
    @Output() saved = new EventEmitter<{doc: FinanceDoc; post: boolean}>();
    @Output() cancelled = new EventEmitter<void>();

    private readonly destroyRef = inject(DestroyRef);
    info!: KindInfo;
    lookups: FinanceLookups | null = null;
    lineAccounts: AccountOption[] = [];
    allAccounts: AccountOption[] = [];
    taxes: TaxOption[] = [];
    /** Withholding codes (TDS, backup withholding) of this side. */
    withholdings: TaxOption[] = [];
    /** What the tax rules give for the chosen party (and why). */
    suggestion: TaxSuggestion | null = null;
    readonly locationLabel = TAX_LOCATION_LABEL;
    modes: ModeOption[] = [];
    allocations: AllocationRow[] = [];
    partyLabel = '';
    saving = false;
    error: string | null = null;
    showMore = false;
    /** Active warehouses of the branch (a choice is offered on stocked lines when there are several). */
    warehouses: Warehouse[] = [];
    /** Stock on hand in the branch of each line's item, as the picker reported it. */
    private readonly onHand = new WeakMap<FinanceLine, number | null>();

    form: FinanceDocInput = this.blank();

    constructor(private api: FinanceApiService, private inventory: InventoryApiService) {}

    ngOnInit() {
        this.info = KINDS[this.kind];
        this.form = this.doc ? this.fromDoc(this.doc) : this.blank();
        if (!this.doc && this.partyAccountId) { this.form.partyAccountId = this.partyAccountId; }
        this.partyLabel = this.doc?.partyName ?? '';

        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: l => {
                this.lookups = l;
                const salesSide = this.info.party === 'customer';
                const side = l.taxCodes.filter(t => t.scope === 'Both' || (salesSide ? t.scope === 'Sales' : t.scope === 'Purchases'));
                this.taxes = side.filter(t => t.kind !== 'Withholding');
                this.withholdings = side.filter(t => t.kind === 'Withholding');
                this.modes = l.paymentModes;
                if (!this.doc) {
                    this.form.currencyCode = l.functionalCurrency;
                    this.form.pricesIncludeTax = l.pricesIncludeTax;
                    if (this.info.items && !this.form.lines.length) { this.addLine(); }
                    if (this.info.settlement && !this.form.paymentModeId) { this.form.paymentModeId = l.paymentModes.find(m => m.code === 'ach' || m.code === 'wire')?.id ?? l.paymentModes[0]?.id ?? null; }
                }
            },
            error: e => this.error = financeErrorOf(e, 'Settings could not be loaded.')
        });
        if (this.info.lineAccounts) {
            this.api.accountOptions(this.info.lineAccounts, null).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: a => this.lineAccounts = a, error: () => {}});
        }
        if (this.info.items) {
            this.inventory.warehouses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: w => this.warehouses = w.filter(x => x.isActive), error: () => {}});
        }
        if (this.info.journal) {
            this.api.accountOptions(this.kind === 'Contra' ? 'bank' : 'item', null).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: a => this.allAccounts = a, error: () => {}});
            if (!this.form.journalLines.length) { this.addJournalLine(); if (this.kind === 'Journal') { this.addJournalLine(); } }
        }
        if (this.info.settles && this.form.partyAccountId) { this.loadOpen(); }
        if (this.info.items && this.form.partyAccountId) { this.suggestTax(false); }
    }

    /** The tax the rules give for this party; lines still on the previous suggestion (or none) take the new one. */
    suggestTax(apply = true) {
        if (!this.info.items) { return; }
        const previous = this.suggestion?.taxCodeId ?? null;
        this.api.taxSuggestion(this.kind, this.form.partyAccountId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: sg => {
                this.suggestion = sg;
                if (!apply || !sg.taxCodeId) { return; }
                const fallback = this.defaultTax();
                this.form.lines.forEach(l => { if (!l.taxCodeId || l.taxCodeId === previous || l.taxCodeId === fallback) { l.taxCodeId = sg.taxCodeId; } });
            },
            error: () => this.suggestion = null
        });
    }

    private defaultTax() { return (this.info.party === 'customer' ? this.lookups?.defaultSalesTaxCodeId : this.lookups?.defaultPurchaseTaxCodeId) ?? null; }

    get isNew() { return !this.doc; }
    get functional() { return this.lookups?.functionalCurrency ?? 'USD'; }
    get foreign() { return !!this.form.currencyCode && this.form.currencyCode.toUpperCase() !== this.functional; }

    // ---------- Party ----------

    searchParties = (term: string | null): Observable<PickerOption[]> =>
        this.api.parties(this.kind, term).pipe(map(list => list.map(p => ({
            id: p.accountId, label: p.name, sub: [p.number, p.email, p.termDays !== null ? `${p.termDays} days` : null].filter(Boolean).join(' · '), data: p
        }))));

    pickParty(o: PickerOption) {
        this.form.partyAccountId = o.id;
        this.partyLabel = o.label;
        const p = o.data;
        if (p?.currencyCode && this.lookups && !this.doc) { this.form.currencyCode = p.currencyCode; }
        if (this.info.items && (this.kind === 'Invoice' || this.kind === 'Bill')) {
            this.form.dueDate = addDaysIso(this.form.date, p?.termDays ?? this.lookups?.defaultDueDays ?? 30);
        }
        if (this.info.settles) { this.loadOpen(); }
        this.suggestTax(true);
    }

    // ---------- Item lines ----------

    addLine() {
        this.form.lines.push({description: '', accountId: this.info.lookupKey ? this.lookups?.defaultLineAccounts?.[this.info.lookupKey] ?? null : null,
            quantity: 1, unitPrice: 0, discountRate: 0, taxCodeId: this.suggestion?.taxCodeId ?? this.defaultTax(), withholdingTaxCodeId: null});
    }
    removeLine(i: number) { this.form.lines.splice(i, 1); }

    searchItems = (term: string | null): Observable<PickerOption[]> =>
        this.inventory.itemOptions(this.kind, term).pipe(map(list => list.map(i => ({
            id: i.id, label: i.name,
            sub: [i.code, `${i.price} / ${i.unit}`, i.onHand !== null ? `${+i.onHand} in stock` : null].filter(Boolean).join(' · '), data: i
        }))));

    /** Fills the line from the item: description, unit, price (converted to the document's currency), account and tax. */
    pickItem(l: FinanceLine, o: PickerOption) {
        const i = o.data as ItemOption;
        l.itemId = i.id; l.itemName = i.name; l.itemCode = i.code; l.itemType = i.type; l.unit = i.unit; l.classificationCode = i.classificationCode;
        l.description = i.description;
        const rate = +(this.form.currencyRate ?? 0);
        l.unitPrice = this.foreign && rate > 0 ? Math.round(i.price / rate * 10000) / 10000 : i.price;
        if (i.accountId) { l.accountId = i.accountId; }
        if (i.taxCodeId) { l.taxCodeId = i.taxCodeId; }
        l.warehouseId = i.type === 'Inventory' ? l.warehouseId ?? this.warehouses.find(w => w.isDefault)?.id ?? null : null;
        this.onHand.set(l, i.onHand);
    }

    /** Back to a free-text line (description and amounts stay). */
    clearItem(l: FinanceLine) {
        const locked = this.locksAccount(l);
        l.itemId = null; l.itemName = null; l.itemCode = null; l.itemType = null; l.classificationCode = null; l.warehouseId = null; l.unit = null;
        if (locked) { l.accountId = this.info.lookupKey ? this.lookups?.defaultLineAccounts?.[this.info.lookupKey] ?? null : null; }
        this.onHand.delete(l);
    }

    /** Stocked items on bills and debit notes post to their inventory account; the server fixes it. */
    locksAccount(l: FinanceLine) { return l.itemType === 'Inventory' && (this.kind === 'Bill' || this.kind === 'DebitNote'); }
    stockOf(l: FinanceLine) { return l.itemType === 'Inventory' ? this.onHand.get(l) ?? null : null; }
    /** Selling more than the branch holds will be refused when posted (unless negative stock is allowed). */
    short(l: FinanceLine) { const s = this.stockOf(l); return s !== null && this.info.party === 'customer' && this.kind === 'Invoice' && +l.quantity > s; }

    private code(id: string | null | undefined) { return id ? this.lookups?.taxCodes.find(t => t.id === id) ?? null : null; }

    /** Preview of a line (same rules as the server: discount, tax added or taken out, withholding deducted). */
    preview(l: FinanceLine) {
        const r2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;
        const gross = r2((+l.quantity || 0) * (+l.unitPrice || 0));
        const discount = r2(gross * (+l.discountRate || 0) / 100);
        const after = gross - discount;
        const tax = this.code(l.taxCodeId);
        // Only standard codes charge tax; zero-rated, exempt, out of scope and reverse charge do not.
        const rate = tax && tax.kind === 'Standard' ? tax.rate : 0;
        let net = after, charged = 0;
        if (this.form.pricesIncludeTax && rate) { charged = r2(after - after / (1 + rate / 100)); net = after - charged; }
        else { charged = r2(after * rate / 100); }
        const wht = this.code(l.withholdingTaxCodeId);
        const withheld = wht ? r2(net * wht.rate / 100) : 0;
        return {net, tax: charged, withheld, total: net + charged - withheld, discount};
    }

    get totals() {
        const rows = this.form.lines.map(l => this.preview(l));
        const sub = rows.reduce((s, r) => s + r.net, 0);
        const tax = rows.reduce((s, r) => s + r.tax, 0);
        const discount = rows.reduce((s, r) => s + r.discount, 0);
        const withheld = rows.reduce((s, r) => s + r.withheld, 0);
        return {sub, tax, discount, withheld, total: sub + tax - withheld + (+this.form.adjustment || 0)};
    }

    // ---------- Journal / transfer lines ----------

    addJournalLine() { this.form.journalLines.push({accountId: null, debit: 0, credit: 0, description: null}); }
    removeJournalLine(i: number) { this.form.journalLines.splice(i, 1); }
    get journalTotals() {
        const debit = this.form.journalLines.reduce((s, l) => s + (+l.debit || 0), 0);
        const credit = this.form.journalLines.reduce((s, l) => s + (+l.credit || 0), 0);
        return {debit, credit, difference: Math.round((debit - credit) * 100) / 100};
    }

    // ---------- Receipts / payments: what it pays ----------

    loadOpen() {
        if (!this.info.settles || !this.form.partyAccountId) { this.allocations = []; return; }
        const keep = new Map(this.form.allocations.map(a => [a.targetVoucherId, a.amount]));
        this.api.openDocuments(this.info.settles, this.form.partyAccountId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: docs => this.allocations = docs.map(d => ({...d, apply: keep.get(d.id) ?? null})),
            error: () => this.allocations = []
        });
    }

    /** Applies the amount to the oldest documents first. */
    autoApply() {
        let left = +(this.info.settlement ? this.form.amount : this.totals.total) || 0;
        for (const a of this.allocations) {
            const take = Math.min(left, a.balance);
            a.apply = take > 0 ? Math.round(take * 100) / 100 : null;
            left -= take;
        }
    }
    get applied() { return this.allocations.reduce((s, a) => s + (+(a.apply ?? 0) || 0), 0); }

    // ---------- Save ----------

    save(post: boolean) {
        this.error = null;
        const body = this.toInput();
        const problem = this.validate(body);
        if (problem) { this.error = problem; return; }
        this.saving = true;
        const call = this.doc ? this.api.update(this.doc.id, body) : this.api.create(body);
        call.pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: doc => this.saved.emit({doc, post}),
            error: e => this.error = financeErrorOf(e, 'The document could not be saved.')
        });
    }

    private validate(b: FinanceDocInput): string | null {
        if (this.info.party === 'customer' && !b.partyAccountId) { return 'Choose the customer.'; }
        if (this.info.party === 'vendor' && !b.partyAccountId) { return 'Choose the vendor.'; }
        if (this.kind === 'Contra' && !b.partyAccountId) { return 'Choose the account the money comes from.'; }
        if (!b.date) { return 'Enter the date.'; }
        if (this.info.items) {
            if (!b.lines.length) { return 'Add at least one line.'; }
            if (b.lines.some(l => !l.itemId && !l.description?.trim())) { return 'Every line needs a description or an item.'; }
            if (b.lines.some(l => l.itemType === 'Inventory' && !(+l.quantity > 0))) { return 'Stocked items need a quantity above zero; use a credit or debit note for returns.'; }
        }
        if (this.info.settlement && !(+(b.amount ?? 0) > 0)) { return 'Enter the amount.'; }
        if (this.info.settlement && this.applied > (+(b.amount ?? 0))) { return 'More is applied than the amount received or paid.'; }
        if (this.kind === 'Journal' && this.journalTotals.difference !== 0) { return `Debits and credits differ by ${this.journalTotals.difference}.`; }
        if (this.foreign && !(+(b.currencyRate ?? 0) > 0)) { return `Enter the exchange rate to ${this.functional}.`; }
        return null;
    }

    private toInput(): FinanceDocInput {
        const f = this.form;
        return {
            ...f,
            currencyCode: f.currencyCode?.toUpperCase() || null,
            currencyRate: this.foreign ? +(f.currencyRate ?? 0) : null,
            adjustment: +f.adjustment || 0,
            lines: this.info.items ? f.lines.map(l => ({
                description: l.description, accountId: l.accountId, quantity: +l.quantity, unitPrice: +l.unitPrice, discountRate: +l.discountRate || 0,
                taxCodeId: l.taxCodeId, withholdingTaxCodeId: l.withholdingTaxCodeId ?? null, itemId: l.itemId ?? null, unit: l.unit ?? null, warehouseId: l.warehouseId ?? null
            })) : [],
            journalLines: this.info.journal
                ? f.journalLines.filter(l => l.accountId).map(l => ({...l, debit: this.kind === 'Contra' ? +l.debit || 0 : +l.debit || 0, credit: this.kind === 'Contra' ? 0 : +l.credit || 0}))
                : [],
            amount: this.info.settlement ? +(f.amount ?? 0) : null,
            allocations: this.info.settles ? this.allocations.filter(a => +(a.apply ?? 0) > 0).map(a => ({targetVoucherId: a.id, amount: +(a.apply ?? 0)})) : []
        };
    }

    private blank(): FinanceDocInput {
        const today = todayIso();
        return {
            kind: this.kind, partyAccountId: null, date: today, dueDate: null, reference: null, notes: null, internalNote: null, currencyCode: null, currencyRate: null,
            pricesIncludeTax: null, adjustment: 0, lines: [], journalLines: [], amount: null, paymentModeId: null, bankAccountId: null, allocations: []
        };
    }

    private fromDoc(d: FinanceDoc): FinanceDocInput {
        const inclusive = d.lines.some(l => (l.taxAmount ?? 0) !== 0) && d.lines.filter(l => (l.taxAmount ?? 0) !== 0)
            .every(l => Math.abs((l.lineTotal ?? 0) - ((l.quantity * l.unitPrice) * (1 - l.discountRate / 100))) < 0.011);
        const settlementBank = KINDS[d.kind].settlement ? d.ledgerLines[0]?.accountId ?? null : null;
        return {
            kind: d.kind, partyAccountId: d.kind === 'Journal' ? null : d.partyAccountId, date: d.date, dueDate: d.dueDate, reference: d.reference, notes: d.notes,
            internalNote: d.internalNote, currencyCode: d.currencyCode, currencyRate: d.currencyRate, pricesIncludeTax: inclusive, adjustment: d.adjustment,
            lines: d.lines.map(l => ({description: l.description, accountId: l.accountId, quantity: l.quantity, unitPrice: l.unitPrice, discountRate: l.discountRate,
                taxCodeId: l.taxCodeId, withholdingTaxCodeId: l.withholdingTaxCodeId ?? null, itemId: l.itemId ?? null, itemName: l.itemName ?? null,
                itemCode: l.itemCode ?? null, itemType: l.itemType ?? null, unit: l.unit ?? null, classificationCode: l.classificationCode ?? null,
                warehouseId: l.warehouseId ?? null})),
            journalLines: KINDS[d.kind].journal ? d.ledgerLines.map(l => ({accountId: l.accountId, debit: l.debit, credit: l.credit, description: l.description} as JournalLineInput)) : [],
            amount: KINDS[d.kind].settlement ? d.total : null, paymentModeId: d.paymentModeId, bankAccountId: settlementBank,
            allocations: d.allocations.map(a => ({targetVoucherId: a.voucherId, amount: a.amount}))
        };
    }
}
