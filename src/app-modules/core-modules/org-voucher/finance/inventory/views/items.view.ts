import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize, forkJoin, map} from "rxjs";
import {AlertService, MessageSeverity, ViewExtender} from "@app-global";
import {AccountOption, TaxOption} from "../../domains/finance.models";
import {FinanceApiService, FinanceGridEvents, financeErrorOf} from "../../services/finance-api.service";
import {PickerOption} from "../../views/finance-picker.component";
import {formatMoney} from "../../grid-cells/finance-cells";
import {InventoryApiService, ItemGridService} from "../inventory-api.service";
import {ITEM_TYPE_HINT, ITEM_TYPE_LABEL, Item, ItemCategory, ItemInput, ItemQueryOptions, ItemRow, ItemType} from "../inventory.models";
import {ItemNameCell, StockQtyCell} from "../inventory-cells";

/**
 * Products and services: the organisation's catalog. An item gives invoice and bill lines their description, unit,
 * price, account and tax; stocked items also show stock on hand in this branch. Deep link `?item=<id>` (or `new`).
 */
@Component({standalone: false, templateUrl: './templates/items.html'})
export class FinanceItemsView extends ViewExtender<ItemRow> implements OnInit {
    override coreState = new ItemQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    readonly types = (Object.keys(ITEM_TYPE_LABEL) as ItemType[]).map(value => ({value, label: ITEM_TYPE_LABEL[value]}));
    readonly typeHint = ITEM_TYPE_HINT;
    categories: ItemCategory[] = [];
    salesTaxes: TaxOption[] = [];
    purchaseTaxes: TaxOption[] = [];
    accounts: {income: AccountOption[]; expense: AccountOption[]; inventory: AccountOption[]; cogs: AccountOption[]} = {income: [], expense: [], inventory: [], cogs: []};
    currency = 'USD';

    /** The open item (null id: new). */
    form: {id: string | null; model: ItemInput; detail: Item | null; vendorLabel: string} | null = null;
    loadingItem = false;
    saving = false;
    formError: string | null = null;

    constructor(public override service: ItemGridService, public override activatedRoute: ActivatedRoute, private api: InventoryApiService,
                private finance: FinanceApiService, private events: FinanceGridEvents, private alerts: AlertService, private router: Router) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Item', field: 'name', cellTemplate: ItemNameCell},
            {headerName: 'Category', field: 'category', cellFn: (r: ItemRow) => r.category ?? '—'},
            {headerName: 'Sells at', field: 'salesPrice', class: 'text-right', cellFn: (r: ItemRow) => r.canSell ? `${formatMoney(r.salesPrice, this.currency, false)} / ${r.unit}` : '—'},
            {headerName: 'Cost', field: 'purchaseCost', class: 'text-right', cellFn: (r: ItemRow) => r.purchaseCost ? formatMoney(r.purchaseCost, this.currency, false) : '—'},
            {headerName: 'On hand', field: 'onHand', class: 'text-right', cellTemplate: StockQtyCell},
            {headerName: 'Stock value', field: 'stockValue', class: 'text-right', cellFn: (r: ItemRow) => r.stockValue === null ? '—' : formatMoney(r.stockValue, this.currency, false)}
        ];
        this.coreState.take = 50;
    }

    get errorText() { return this.errorMsg ? financeErrorOf(this.errorMsg, 'Items could not be loaded.') : null; }
    get stocked() { return this.form?.model.type === 'Inventory'; }
    /** Saved with stock: the inventory account is fixed. */
    get hasStock() { return !!this.form?.detail && (this.form.detail.stockValue !== 0 || this.form.detail.onHand !== 0); }

    /** A used item cannot change to or from stocked goods. */
    typeLocked(t: ItemType) { return !!this.form?.detail?.isUsed && (t === 'Inventory') !== (this.form.detail.type === 'Inventory'); }

    ngOnInit() {
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'item') { this.open(a.row.id); } });
        this.api.categories().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: c => this.categories = c, error: () => {}});
        this.finance.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: l => {
                this.currency = l.functionalCurrency;
                const usable = l.taxCodes.filter(t => t.kind !== 'Withholding');
                this.salesTaxes = usable.filter(t => t.scope !== 'Purchases');
                this.purchaseTaxes = usable.filter(t => t.scope !== 'Sales');
            },
            error: () => {}
        });
        forkJoin({
            income: this.finance.accountOptions('income', null), expense: this.finance.accountOptions('expense', null),
            inventory: this.finance.accountOptions('inventory', null), cogs: this.finance.accountOptions('cogs', null)
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: a => this.accounts = a, error: () => {}});
        this.activatedRoute.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(q => {
            const id = q.get('item');
            if (id === 'new') { this.add(); } else if (id && id !== this.form?.id) { this.open(id); }
        });
        this.populateGrid();
    }

    search() { this.coreState.skip = 0; this.populateGrid(); }

    // ---------- Panel ----------

    add(type: ItemType = 'Service') {
        this.formError = null;
        this.form = {id: null, detail: null, vendorLabel: '', model: {
            code: null, name: '', type, categoryId: null, unit: null, barcode: null, classificationCode: null, brand: null, canSell: true, salesDescription: null,
            salesPrice: 0, salesAccountId: null, salesTaxCodeId: null, canBuy: type !== 'Service', purchaseDescription: null, purchaseCost: 0, purchaseAccountId: null,
            purchaseTaxCodeId: null, preferredVendorAccountId: null, inventoryAccountId: null, costOfGoodsSoldAccountId: null, reorderLevel: 0, reorderQuantity: 0,
            notes: null, isActive: true
        }};
    }

    open(id: string) {
        this.formError = null;
        this.loadingItem = true;
        this.api.item(id).pipe(finalize(() => this.loadingItem = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: i => this.form = {id: i.id, detail: i, vendorLabel: i.preferredVendor ?? '', model: this.toInput(i)},
            error: e => this.alerts.showMessage('Item', financeErrorOf(e, 'The item could not be opened.'), MessageSeverity.error)
        });
    }

    close() {
        this.form = null;
        this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {item: null}, queryParamsHandling: 'merge', replaceUrl: true});
    }

    searchVendors = (term: string | null): Observable<PickerOption[]> =>
        this.finance.parties('Bill', term).pipe(map(list => list.map(p => ({id: p.accountId, label: p.name, sub: p.number}))));

    pickVendor(o: PickerOption) { if (this.form) { this.form.model.preferredVendorAccountId = o.id; this.form.vendorLabel = o.label; } }
    clearVendor() { if (this.form) { this.form.model.preferredVendorAccountId = null; this.form.vendorLabel = ''; } }

    /** Margin of the selling price over the purchase cost (a guide; real margins use the average cost when sold). */
    get margin() {
        const m = this.form?.model;
        if (!m || !m.canSell || !m.canBuy || !(+m.salesPrice > 0)) { return null; }
        return Math.round((+m.salesPrice - +m.purchaseCost) / +m.salesPrice * 1000) / 10;
    }

    movements() {
        if (!this.form?.id) { return; }
        this.router.navigate(['..', 'movements'], {relativeTo: this.activatedRoute, queryParams: {item: this.form.id}});
    }

    save() {
        const f = this.form;
        if (!f) { return; }
        if (!f.model.name?.trim()) { this.formError = 'Enter the name.'; return; }
        if (!f.model.canSell && !f.model.canBuy) { this.formError = 'An item must be sold, bought or both.'; return; }
        this.saving = true;
        this.formError = null;
        const m = f.model;
        const body: ItemInput = {...m, salesPrice: +m.salesPrice || 0, purchaseCost: +m.purchaseCost || 0, reorderLevel: +m.reorderLevel || 0, reorderQuantity: +m.reorderQuantity || 0};
        this.api.saveItem(f.id, body).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: i => {
                this.form = {id: i.id, detail: i, vendorLabel: i.preferredVendor ?? '', model: this.toInput(i)};
                this.alerts.showMessage('Saved', `${i.name} (${i.code}) saved.`, MessageSeverity.success);
                this.refreshGrid();
            },
            error: e => this.formError = financeErrorOf(e, 'The item could not be saved.')
        });
    }

    remove() {
        const f = this.form;
        if (!f?.id || !confirm(`Delete ${f.model.name}? Items used on documents or in stock can only be deactivated.`)) { return; }
        this.api.deleteItem(f.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.close(); this.alerts.showMessage('Deleted', 'Item deleted.', MessageSeverity.success); this.refreshGrid(); },
            error: e => this.formError = financeErrorOf(e, 'The item could not be deleted.')
        });
    }

    private toInput(i: Item): ItemInput {
        return {
            code: i.code, name: i.name, type: i.type, categoryId: i.categoryId, unit: i.unit, barcode: i.barcode, classificationCode: i.classificationCode, brand: i.brand,
            canSell: i.canSell, salesDescription: i.salesDescription, salesPrice: i.salesPrice, salesAccountId: i.salesAccountId, salesTaxCodeId: i.salesTaxCodeId,
            canBuy: i.canBuy, purchaseDescription: i.purchaseDescription, purchaseCost: i.purchaseCost, purchaseAccountId: i.purchaseAccountId,
            purchaseTaxCodeId: i.purchaseTaxCodeId, preferredVendorAccountId: i.preferredVendorAccountId, inventoryAccountId: i.inventoryAccountId,
            costOfGoodsSoldAccountId: i.costOfGoodsSoldAccountId, reorderLevel: i.reorderLevel, reorderQuantity: i.reorderQuantity, notes: i.notes, isActive: i.isActive
        };
    }
}
