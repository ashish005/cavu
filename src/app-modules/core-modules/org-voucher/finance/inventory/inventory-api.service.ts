import {Injectable, Injector} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {Observable, catchError, map, shareReplay} from "rxjs";
import {CoreEndpointBase, OrgResourceService} from "@app-global";
import {FinanceKind} from "../domains/finance.models";
import {
    ITEM_SERIALIZER, InventorySettings, Item, ItemCategory, ItemCategoryInput, ItemInput, ItemOption, ItemRow, ItemSales, STOCK_DOC_SERIALIZER,
    STOCK_MOVEMENT_SERIALIZER, STOCK_SUMMARY_SERIALIZER, StockDoc, StockDocInput, StockDocRow, StockMovementRow, StockSummaryRow, StockValuation, Warehouse,
    WarehouseInput
} from "./inventory.models";

const unwrap = <T>(resp: any): T => {
    if (resp && resp.isSuccess === false) { throw {status: 200, error: resp, message: resp.message || 'The request was rejected.'}; }
    return resp?.data as T;
};

const params = (obj: Record<string, any>) =>
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== '').reduce((p, [k, v]) => p.set(k, String(v)), new HttpParams());

/** Tenant API `api/v1/inventory/*`: items, warehouses, categories, stock documents and stock reports. Errors read with `financeErrorOf`. */
@Injectable()
export class InventoryApiService extends CoreEndpointBase {
    private warehouses$: Observable<Warehouse[]> | null = null;
    private categories$: Observable<ItemCategory[]> | null = null;

    constructor(public override injector: Injector) { super(injector); }

    private get root() { return `${this.baseSectorAPIUrl}/v1/inventory`; }

    private get<T>(path: string, query: Record<string, any> = {}): Observable<T> {
        return this.httpClient.get(`${this.root}/${path}`, {...this.requestHeaders, params: params(query)}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.get<T>(path, query))));
    }

    private send<T>(method: 'POST' | 'PUT' | 'DELETE', path: string, body: any = {}): Observable<T> {
        return this.httpClient.request(method, `${this.root}/${path}`, {...this.requestHeaders, body}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.send<T>(method, path, body))));
    }

    // Items
    item(id: string) { return this.get<Item>(`items/${id}`); }
    saveItem(id: string | null, body: ItemInput) { return id ? this.send<Item>('PUT', `items/${id}`, body) : this.send<Item>('POST', 'items', body); }
    deleteItem(id: string) { return this.send<void>('DELETE', `items/${id}`); }
    /** Line picker items for `kind`; `stocked`: stocked items whether sold or bought (stock documents, filters). */
    itemOptions(kind: FinanceKind, search: string | null, stocked = false) { return this.get<ItemOption[]>('items/options', {kind, search, stocked: stocked || null}); }

    // Setup (cached for pickers; saving refreshes)
    warehouses(refresh = false) {
        if (refresh || !this.warehouses$) { this.warehouses$ = this.get<Warehouse[]>('setup/warehouses').pipe(shareReplay({bufferSize: 1, refCount: false})); }
        return this.warehouses$;
    }
    saveWarehouse(id: string | null, body: WarehouseInput) {
        return id ? this.send<Warehouse>('PUT', `setup/warehouses/${id}`, body) : this.send<Warehouse>('POST', 'setup/warehouses', body);
    }
    deleteWarehouse(id: string) { return this.send<void>('DELETE', `setup/warehouses/${id}`); }
    categories(refresh = false) {
        if (refresh || !this.categories$) { this.categories$ = this.get<ItemCategory[]>('setup/categories').pipe(shareReplay({bufferSize: 1, refCount: false})); }
        return this.categories$;
    }
    saveCategory(id: string | null, body: ItemCategoryInput) {
        return id ? this.send<ItemCategory>('PUT', `setup/categories/${id}`, body) : this.send<ItemCategory>('POST', 'setup/categories', body);
    }
    deleteCategory(id: string) { return this.send<void>('DELETE', `setup/categories/${id}`); }
    settings() { return this.get<InventorySettings>('setup/settings'); }
    saveSettings(body: InventorySettings) { return this.send<InventorySettings>('PUT', 'setup/settings', body); }

    // Stock documents
    stockDocument(id: string) { return this.get<StockDoc>(`stock-documents/${id}`); }
    saveStockDocument(id: string | null, body: StockDocInput) {
        return id ? this.send<StockDoc>('PUT', `stock-documents/${id}`, body) : this.send<StockDoc>('POST', 'stock-documents', body);
    }
    deleteStockDocument(id: string) { return this.send<void>('DELETE', `stock-documents/${id}`); }
    postStockDocument(id: string) { return this.send<StockDoc>('POST', `stock-documents/${id}/post`); }
    voidStockDocument(id: string, reason: string, date: string | null) { return this.send<StockDoc>('POST', `stock-documents/${id}/void`, {reason, date}); }

    // Reports
    valuation(asOf: string | null, warehouseId: string | null) { return this.get<StockValuation>('reports/valuation', {asOf, warehouseId}); }
    itemSales(from: string | null, to: string | null, side: 'sales' | 'purchases', search: string | null) {
        return this.get<ItemSales>('reports/item-sales', {from, to, side, search});
    }
}

/** Paged `GET v1/inventory/items`. */
@Injectable()
export class ItemGridService extends OrgResourceService<ItemRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/inventory/items', ITEM_SERIALIZER); }
}

/** Paged `GET v1/inventory/stock-documents`. */
@Injectable()
export class StockDocGridService extends OrgResourceService<StockDocRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/inventory/stock-documents', STOCK_DOC_SERIALIZER); }
}

/** Paged `GET v1/inventory/reports/stock`. */
@Injectable()
export class StockSummaryGridService extends OrgResourceService<StockSummaryRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/inventory/reports/stock', STOCK_SUMMARY_SERIALIZER); }
}

/** Paged `GET v1/inventory/reports/movements`. */
@Injectable()
export class StockMovementGridService extends OrgResourceService<StockMovementRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/inventory/reports/movements', STOCK_MOVEMENT_SERIALIZER); }
}

export const INVENTORY_SERVICES = [InventoryApiService, ItemGridService, StockDocGridService, StockSummaryGridService, StockMovementGridService];
