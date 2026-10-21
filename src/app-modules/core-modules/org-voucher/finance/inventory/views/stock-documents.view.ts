import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize, map} from "rxjs";
import {AlertService, DateFormatCell, MessageSeverity, ViewExtender} from "@app-global";
import {AccountOption, todayIso} from "../../domains/finance.models";
import {FinanceApiService, FinanceGridEvents, financeErrorOf} from "../../services/finance-api.service";
import {formatMoney} from "../../grid-cells/finance-cells";
import {PickerOption} from "../../views/finance-picker.component";
import {InventoryApiService, StockDocGridService} from "../inventory-api.service";
import {
    ItemOption, STOCK_DOC_LABEL, STOCK_DOC_TONE, StockDoc, StockDocInput, StockDocKind, StockDocQueryOptions, StockDocRow, Warehouse
} from "../inventory.models";
import {StockDocCell} from "../inventory-cells";

/** An editor line: the request plus what the picker showed. */
interface EditLine { itemId: string | null; itemLabel: string; unit: string; onHand: number | null; quantity: number; countedQuantity: number | null; unitCost: number | null; description: string | null; }

/**
 * Stock documents of the branch: opening stock, adjustments (by quantity or physical count) and transfers between
 * warehouses. Drafts are edited freely; posting numbers them and moves the stock. Deep links `?doc=<id>`, `?new=<kind>`.
 */
@Component({standalone: false, templateUrl: './templates/stock-documents.html'})
export class FinanceStockDocumentsView extends ViewExtender<StockDocRow> implements OnInit {
    override coreState = new StockDocQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    readonly kinds = (Object.keys(STOCK_DOC_LABEL) as StockDocKind[]).map(value => ({value, label: STOCK_DOC_LABEL[value]}));
    readonly kindLabel = STOCK_DOC_LABEL;
    readonly tone = STOCK_DOC_TONE;
    warehouses: Warehouse[] = [];
    offsetAccounts: AccountOption[] = [];
    currency = 'USD';

    /** Editing a draft (or a new document). */
    edit: {id: string | null; model: Omit<StockDocInput, 'lines'>; lines: EditLine[]; byCount: boolean} | null = null;
    /** The document being looked at. */
    doc: StockDoc | null = null;
    voidForm: {reason: string; date: string | null} | null = null;
    busy = false;
    error: string | null = null;

    constructor(public override service: StockDocGridService, public override activatedRoute: ActivatedRoute, private api: InventoryApiService,
                private finance: FinanceApiService, private events: FinanceGridEvents, private alerts: AlertService, private router: Router) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Number', field: 'number', cellTemplate: StockDocCell},
            {headerName: 'Date', field: 'date', cellTemplate: DateFormatCell},
            {headerName: 'Warehouse', field: 'warehouse', cellFn: (r: StockDocRow) => r.toWarehouse ? `${r.warehouse} → ${r.toWarehouse}` : r.warehouse},
            {headerName: 'Items', field: 'lines', class: 'text-right'},
            {headerName: 'Value', field: 'totalValue', class: 'text-right', cellFn: (r: StockDocRow) => r.status === 'Draft' ? '—' : formatMoney(r.totalValue, this.currency, false)}
        ];
        this.coreState.take = 50;
    }

    get errorText() { return this.errorMsg ? financeErrorOf(this.errorMsg, 'Stock documents could not be loaded.') : null; }

    ngOnInit() {
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'stock-doc') { this.open(a.row.id); } });
        this.api.warehouses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: w => this.warehouses = w.filter(x => x.isActive), error: () => {}});
        this.finance.accountOptions('item', null).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: a => this.offsetAccounts = a, error: () => {}});
        this.finance.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.currency = l.functionalCurrency, error: () => {}});
        this.activatedRoute.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(q => {
            const id = q.get('doc');
            const kind = q.get('new') as StockDocKind | null;
            if (id && id !== this.doc?.id) { this.open(id); }
            else if (kind && STOCK_DOC_LABEL[kind]) { this.create(kind); }
        });
        this.populateGrid();
    }

    search() { this.coreState.skip = 0; this.populateGrid(); }

    // ---------- Detail ----------

    open(id: string) {
        this.error = null;
        this.busy = true;
        this.api.stockDocument(id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { this.doc = d; this.edit = null; this.voidForm = null; },
            error: e => this.alerts.showMessage('Stock', financeErrorOf(e, 'The document could not be opened.'), MessageSeverity.error)
        });
    }

    closeAll() {
        this.doc = null;
        this.edit = null;
        this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {doc: null, new: null}, queryParamsHandling: 'merge', replaceUrl: true});
    }

    post() {
        if (!this.doc) { return; }
        this.run(this.api.postStockDocument(this.doc.id), d => `${d.number} posted.`);
    }

    remove() {
        if (!this.doc || !confirm('Delete this draft?')) { return; }
        this.busy = true;
        this.api.deleteStockDocument(this.doc.id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.closeAll(); this.refreshGrid(); },
            error: e => this.error = financeErrorOf(e, 'The draft could not be deleted.')
        });
    }

    doVoid() {
        if (!this.doc || !this.voidForm) { return; }
        if ((this.voidForm.reason ?? '').trim().length < 3) { this.error = 'Give a reason for voiding.'; return; }
        this.run(this.api.voidStockDocument(this.doc.id, this.voidForm.reason.trim(), this.voidForm.date || null), d => `${d.number} voided.`);
    }

    private run(call: Observable<StockDoc>, message: (d: StockDoc) => string) {
        this.error = null;
        this.busy = true;
        call.pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { this.doc = d; this.voidForm = null; this.alerts.showMessage('Stock', message(d), MessageSeverity.success); this.refreshGrid(); },
            error: e => this.error = financeErrorOf(e, 'The action failed.')
        });
    }

    // ---------- Editor ----------

    create(kind: StockDocKind) {
        this.error = null;
        this.doc = null;
        this.edit = {
            id: null, byCount: kind === 'Adjustment', lines: [this.blankLine()],
            model: {kind, date: todayIso(), warehouseId: this.warehouses.find(w => w.isDefault)?.id ?? null, toWarehouseId: null, accountId: null, reason: null, reference: null, notes: null}
        };
    }

    change() {
        const d = this.doc;
        if (!d) { return; }
        this.error = null;
        this.edit = {
            id: d.id, byCount: d.lines.some(l => l.countedQuantity !== null),
            model: {kind: d.kind, date: d.date, warehouseId: d.warehouseId, toWarehouseId: d.toWarehouseId, accountId: d.accountId, reason: d.reason, reference: d.reference, notes: d.notes},
            lines: d.lines.map(l => ({itemId: l.itemId, itemLabel: `${l.itemName} (${l.itemCode})`, unit: l.unit, onHand: l.onHand, quantity: l.quantity,
                countedQuantity: l.countedQuantity, unitCost: l.unitCost, description: l.description}))
        };
    }

    private blankLine(): EditLine { return {itemId: null, itemLabel: '', unit: '', onHand: null, quantity: 0, countedQuantity: null, unitCost: null, description: null}; }
    addLine() { this.edit?.lines.push(this.blankLine()); }
    removeLine(i: number) { this.edit?.lines.splice(i, 1); }

    searchItems = (term: string | null): Observable<PickerOption[]> =>
        this.api.itemOptions('Bill', term, true).pipe(map(list => list.map(i => ({
            id: i.id, label: `${i.name} (${i.code})`, sub: i.onHand !== null ? `${+i.onHand} ${i.unit} on hand in the branch` : null, data: i
        }))));

    pickItem(l: EditLine, o: PickerOption) {
        const i = o.data as ItemOption;
        l.itemId = i.id;
        l.itemLabel = o.label;
        l.unit = i.unit;
        l.onHand = i.onHand;
        if (this.edit?.model.kind === 'Opening' && l.unitCost === null) { l.unitCost = i.price; }
    }

    save(andPost: boolean) {
        const e = this.edit;
        if (!e) { return; }
        this.error = null;
        const lines = e.lines.filter(l => l.itemId);
        if (!lines.length) { this.error = 'Add at least one item.'; return; }
        if (e.model.kind === 'Transfer' && !e.model.toWarehouseId) { this.error = 'Choose the warehouse the stock goes to.'; return; }
        const count = e.model.kind === 'Adjustment' && e.byCount;
        const body: StockDocInput = {
            ...e.model,
            lines: lines.map(l => ({
                itemId: l.itemId!, quantity: count ? 0 : +l.quantity || 0, countedQuantity: count ? +(l.countedQuantity ?? 0) : null,
                unitCost: e.model.kind === 'Transfer' || l.unitCost === null || (l.unitCost as any) === '' ? null : +l.unitCost, description: l.description
            }))
        };
        this.busy = true;
        this.api.saveStockDocument(e.id, body).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => {
                this.doc = d;
                this.edit = null;
                this.refreshGrid();
                if (andPost) { this.post(); } else { this.alerts.showMessage('Stock', 'Draft saved.', MessageSeverity.success); }
            },
            error: err => this.error = financeErrorOf(err, 'The document could not be saved.')
        });
    }
}
