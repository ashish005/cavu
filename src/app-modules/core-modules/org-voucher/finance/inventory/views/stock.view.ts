import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, map} from "rxjs";
import {DateFormatCell, ViewExtender} from "@app-global";
import {FinanceApiService, FinanceGridEvents, financeErrorOf} from "../../services/finance-api.service";
import {formatMoney} from "../../grid-cells/finance-cells";
import {ROUTE_OF_KIND} from "../../views/documents.view";
import {PickerOption} from "../../views/finance-picker.component";
import {InventoryApiService, StockMovementGridService, StockSummaryGridService} from "../inventory-api.service";
import {
    ItemCategory, StockMovementQueryOptions, StockMovementRow, StockSummaryQueryOptions, StockSummaryRow, VOUCHER_SOURCES, Warehouse
} from "../inventory.models";
import {ItemNameCell, StockChangeCell, StockQtyCell, StockSourceCell} from "../inventory-cells";

/** Stock on hand: stocked items with quantity, average cost and value in this branch (all warehouses or one). `?filter=low|out`. */
@Component({standalone: false, templateUrl: './templates/stock.html'})
export class FinanceStockView extends ViewExtender<StockSummaryRow> implements OnInit {
    override coreState = new StockSummaryQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    warehouses: Warehouse[] = [];
    categories: ItemCategory[] = [];
    currency = 'USD';

    constructor(public override service: StockSummaryGridService, public override activatedRoute: ActivatedRoute, private api: InventoryApiService,
                private finance: FinanceApiService, private events: FinanceGridEvents, private router: Router) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Item', field: 'name', cellTemplate: ItemNameCell},
            {headerName: 'Category', field: 'category', cellFn: (r: StockSummaryRow) => r.category ?? '—'},
            {headerName: 'On hand', field: 'quantity', class: 'text-right', cellTemplate: StockQtyCell},
            {headerName: 'Reorder at', field: 'reorderLevel', class: 'text-right', cellFn: (r: StockSummaryRow) => r.reorderLevel ? `${+r.reorderLevel}` : '—'},
            {headerName: 'Average cost', field: 'averageCost', class: 'text-right', cellFn: (r: StockSummaryRow) => formatMoney(r.averageCost, this.currency, false)},
            {headerName: 'Value', field: 'value', class: 'text-right', cellFn: (r: StockSummaryRow) => formatMoney(r.value, this.currency, false)}
        ];
        this.coreState.take = 50;
    }

    get errorText() { return this.errorMsg ? financeErrorOf(this.errorMsg, 'Stock could not be loaded.') : null; }

    ngOnInit() {
        // Item cells report the item; the item page opens it.
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => {
            if (a.action === 'item') { this.router.navigate(['..', 'items'], {relativeTo: this.activatedRoute, queryParams: {item: a.row.itemId ?? a.row.id}}); }
        });
        this.api.warehouses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: w => this.warehouses = w, error: () => {}});
        this.api.categories().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: c => this.categories = c, error: () => {}});
        this.finance.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.currency = l.functionalCurrency, error: () => {}});
        const filter = this.activatedRoute.snapshot.queryParamMap.get('filter');
        if (filter === 'low' || filter === 'out') { this.coreState.level = filter; }
        this.populateGrid();
    }

    search() { this.coreState.skip = 0; this.populateGrid(); }
}

/** Every stock movement (invoices, bills, notes, stock documents) with the warehouse balance after it. `?item=<id>`. */
@Component({standalone: false, templateUrl: './templates/stock-movements.html'})
export class FinanceStockMovementsView extends ViewExtender<StockMovementRow> implements OnInit {
    override coreState = new StockMovementQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    warehouses: Warehouse[] = [];
    itemLabel = '';
    currency = 'USD';

    constructor(public override service: StockMovementGridService, public override activatedRoute: ActivatedRoute, private api: InventoryApiService,
                private finance: FinanceApiService, private events: FinanceGridEvents, private router: Router) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Date', field: 'date', cellTemplate: DateFormatCell},
            {headerName: 'Item', field: 'itemName', cellFn: (r: StockMovementRow) => `${r.itemName} (${r.itemCode})`},
            {headerName: 'Warehouse', field: 'warehouse'},
            {headerName: 'Document', field: 'sourceNumber', cellTemplate: StockSourceCell},
            {headerName: 'Change', field: 'quantity', class: 'text-right', cellTemplate: StockChangeCell},
            {headerName: 'Unit cost', field: 'unitCost', class: 'text-right', cellFn: (r: StockMovementRow) => formatMoney(r.unitCost, this.currency, false)},
            {headerName: 'Value', field: 'value', class: 'text-right', cellFn: (r: StockMovementRow) => formatMoney(r.value, this.currency, false)},
            {headerName: 'Balance', field: 'quantityAfter', class: 'text-right', cellFn: (r: StockMovementRow) => `${+r.quantityAfter} · ${formatMoney(r.valueAfter, this.currency, false)}`}
        ];
        this.coreState.take = 50;
    }

    get errorText() { return this.errorMsg ? financeErrorOf(this.errorMsg, 'Stock movements could not be loaded.') : null; }

    ngOnInit() {
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'source') { this.openSource(a.row); } });
        this.api.warehouses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: w => this.warehouses = w, error: () => {}});
        this.finance.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.currency = l.functionalCurrency, error: () => {}});
        const item = this.activatedRoute.snapshot.queryParamMap.get('item');
        if (item) {
            this.coreState.itemId = item;
            this.api.item(item).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: i => this.itemLabel = `${i.name} (${i.code})`, error: () => {}});
        }
        this.populateGrid();
    }

    searchItems = (term: string | null): Observable<PickerOption[]> =>
        this.api.itemOptions('Invoice', term, true).pipe(map(list => list.map(i => ({id: i.id, label: `${i.name} (${i.code})`}))));

    pickItem(o: PickerOption | null) {
        this.coreState.itemId = o?.id ?? null;
        this.itemLabel = o?.label ?? '';
        this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {item: o?.id ?? null}, replaceUrl: true});
        this.search();
    }

    search() { this.coreState.skip = 0; this.populateGrid(); }

    /** Invoices, bills and notes open in the finance document panel; stock documents in theirs. */
    private openSource(r: StockMovementRow) {
        const kind = VOUCHER_SOURCES[r.source];
        if (kind) { this.router.navigate(['../..', ...ROUTE_OF_KIND[kind].split('/')], {relativeTo: this.activatedRoute, queryParams: {doc: r.sourceId}}); }
        else { this.router.navigate(['..', 'adjustments'], {relativeTo: this.activatedRoute, queryParams: {doc: r.sourceId}}); }
    }
}
