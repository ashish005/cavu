import {CoreQueryOptions, CoreResource} from "@app-global";
import {FinanceKind, LedgerLine, readOnlySerializer} from "../domains/finance.models";

// Contracts of products, services and stock (tenant API `api/v1/inventory/*`). Amounts are in the functional currency.

export type ItemType = 'Service' | 'NonInventory' | 'Inventory';
export const ITEM_TYPE_LABEL: Record<ItemType, string> = {Service: 'Service', NonInventory: 'Non-stock goods', Inventory: 'Stocked goods'};
export const ITEM_TYPE_HINT: Record<ItemType, string> = {
    Service: 'Work or time: never stocked.',
    NonInventory: 'Goods bought or sold without tracking stock; expensed when bought.',
    Inventory: 'Stock tracked per warehouse; bought into inventory, cost of goods sold booked on each sale.'
};

// ---------- Items ----------

export class ItemRow extends CoreResource {
    declare code: string;
    declare name: string;
    declare type: ItemType;
    declare category: string | null;
    declare unit: string;
    declare classificationCode: string | null;
    declare salesPrice: number;
    declare purchaseCost: number;
    declare canSell: boolean;
    declare canBuy: boolean;
    declare isActive: boolean;
    declare onHand: number | null;
    declare stockValue: number | null;
    declare reorderLevel: number;
    declare isLow: boolean;
    constructor(json: any = {}) { super(); Object.assign(this, json); }
}
export const ITEM_SERIALIZER = readOnlySerializer(ItemRow);

export class ItemQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    type: ItemType | null = null;
    categoryId: string | null = null;
    state: 'active' | 'inactive' | 'all' = 'active';
    stock: 'low' | 'out' | null = null;
    override toQueryString() {
        return super.getParamByObject({search: this.search, type: this.type, categoryId: this.categoryId, state: this.state, stock: this.stock});
    }
}

export interface ItemInput {
    code: string | null; name: string; type: ItemType; categoryId: string | null; unit: string | null; barcode: string | null; classificationCode: string | null;
    brand: string | null; canSell: boolean; salesDescription: string | null; salesPrice: number; salesAccountId: string | null; salesTaxCodeId: string | null;
    canBuy: boolean; purchaseDescription: string | null; purchaseCost: number; purchaseAccountId: string | null; purchaseTaxCodeId: string | null;
    preferredVendorAccountId: string | null; inventoryAccountId: string | null; costOfGoodsSoldAccountId: string | null; reorderLevel: number; reorderQuantity: number;
    notes: string | null; isActive: boolean;
}

export interface ItemStock { warehouseId: string; warehouse: string; quantity: number; value: number; averageCost: number; lastMovementAt: string | null; }
export interface ItemActivity { soldQuantity: number; soldAmount: number; costOfSales: number; boughtQuantity: number; boughtAmount: number; }

export interface Item extends ItemInput {
    id: string; category: string | null; salesAccount: string | null; purchaseAccount: string | null; preferredVendor: string | null; inventoryAccount: string | null;
    costOfGoodsSoldAccount: string | null; currencyCode: string; stock: ItemStock[]; onHand: number; stockValue: number; activity: ItemActivity | null; isUsed: boolean;
}

/** An item for an invoice/bill line, with what the line takes from it for that kind of document. */
export interface ItemOption {
    id: string; code: string; name: string; type: ItemType; unit: string; description: string; price: number; accountId: string | null; taxCodeId: string | null;
    classificationCode: string | null; onHand: number | null; lockAccount: boolean;
}

// ---------- Setup ----------

export interface Warehouse { id: string; code: string; name: string; address: string | null; isDefault: boolean; isActive: boolean; items: number; stockValue: number; }
export interface WarehouseInput { code: string; name: string; address: string | null; isDefault: boolean; isActive: boolean; }
export interface ItemCategory { id: string; name: string; parentId: string | null; parent: string | null; description: string | null; items: number; }
export interface ItemCategoryInput { name: string; parentId: string | null; description: string | null; }
export interface InventorySettings { allowNegativeStock: boolean; lowStockAlerts: boolean; }

// ---------- Stock documents ----------

export type StockDocKind = 'Opening' | 'Adjustment' | 'Transfer';
export type StockDocStatus = 'Draft' | 'Posted' | 'Void';
export const STOCK_DOC_LABEL: Record<StockDocKind, string> = {Opening: 'Opening stock', Adjustment: 'Adjustment', Transfer: 'Transfer'};
export const STOCK_DOC_TONE: Record<StockDocStatus, string> = {Draft: 'grey', Posted: 'success', Void: 'dark'};

export class StockDocRow extends CoreResource {
    declare kind: StockDocKind;
    declare status: StockDocStatus;
    declare number: string;
    declare date: string;
    declare warehouse: string;
    declare toWarehouse: string | null;
    declare reason: string | null;
    declare lines: number;
    declare totalValue: number;
    constructor(json: any = {}) { super(); Object.assign(this, json); }
}
export const STOCK_DOC_SERIALIZER = readOnlySerializer(StockDocRow);

export class StockDocQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    kind: StockDocKind | null = null;
    status: StockDocStatus | null = null;
    override toQueryString() { return super.getParamByObject({search: this.search, kind: this.kind, status: this.status}); }
}

export interface StockDocLineInput { itemId: string; quantity: number; countedQuantity: number | null; unitCost: number | null; description: string | null; }
export interface StockDocInput {
    kind: StockDocKind; date: string; warehouseId: string | null; toWarehouseId: string | null; accountId: string | null; reason: string | null;
    reference: string | null; notes: string | null; lines: StockDocLineInput[];
}
export interface StockDocLine extends StockDocLineInput { id: string; lineNo: number; itemCode: string; itemName: string; unit: string; value: number; onHand: number; }
export interface StockDoc {
    id: string; kind: StockDocKind; status: StockDocStatus; number: string; date: string; warehouseId: string; warehouse: string; toWarehouseId: string | null;
    toWarehouse: string | null; accountId: string | null; account: string | null; reason: string | null; reference: string | null; notes: string | null;
    totalValue: number; currencyCode: string; postedAt: string | null; voidedAt: string | null; voidReason: string | null; canEdit: boolean; canPost: boolean;
    canVoid: boolean; lines: StockDocLine[]; journal: LedgerLine[];
}

// ---------- Reports ----------

export type StockStatus = 'ok' | 'low' | 'out' | 'negative';
export const STOCK_STATUS: Record<StockStatus, {label: string; tone: string}> = {
    ok: {label: 'In stock', tone: 'success'}, low: {label: 'Low', tone: 'warning'}, out: {label: 'Out', tone: 'danger'}, negative: {label: 'Negative', tone: 'danger'}
};

export class StockSummaryRow extends CoreResource {
    declare itemId: string;
    declare code: string;
    declare name: string;
    declare unit: string;
    declare category: string | null;
    declare quantity: number;
    declare value: number;
    declare averageCost: number;
    declare reorderLevel: number;
    declare reorderQuantity: number;
    declare status: StockStatus;
    constructor(json: any = {}) { super(); Object.assign(this, json); }
}
export const STOCK_SUMMARY_SERIALIZER = readOnlySerializer(StockSummaryRow);

export class StockSummaryQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    warehouseId: string | null = null;
    categoryId: string | null = null;
    /** Sent as `filter`: low or out of stock. */
    level: 'low' | 'out' | null = null;
    override toQueryString() { return super.getParamByObject({search: this.search, warehouseId: this.warehouseId, categoryId: this.categoryId, filter: this.level}); }
}

export type StockSource = 'Opening' | 'Adjustment' | 'Transfer' | 'Sale' | 'SalesReturn' | 'Purchase' | 'PurchaseReturn';
export const STOCK_SOURCE_LABEL: Record<StockSource, string> = {
    Opening: 'Opening stock', Adjustment: 'Adjustment', Transfer: 'Transfer', Sale: 'Invoice', SalesReturn: 'Credit note', Purchase: 'Bill', PurchaseReturn: 'Debit note'
};
/** Movements caused by finance documents (open in the finance document panel) rather than stock documents. */
export const VOUCHER_SOURCES: Partial<Record<StockSource, FinanceKind>> = {Sale: 'Invoice', SalesReturn: 'CreditNote', Purchase: 'Bill', PurchaseReturn: 'DebitNote'};

export class StockMovementRow extends CoreResource {
    declare date: string;
    declare itemId: string;
    declare itemCode: string;
    declare itemName: string;
    declare unit: string;
    declare warehouse: string;
    declare source: StockSource;
    declare sourceId: string;
    declare sourceNumber: string;
    declare quantity: number;
    declare unitCost: number;
    declare value: number;
    declare quantityAfter: number;
    declare valueAfter: number;
    declare isReversal: boolean;
    declare description: string | null;
    constructor(json: any = {}) { super(); Object.assign(this, json); }
}
export const STOCK_MOVEMENT_SERIALIZER = readOnlySerializer(StockMovementRow);

export class StockMovementQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    itemId: string | null = null;
    warehouseId: string | null = null;
    from: string | null = null;
    to: string | null = null;
    override toQueryString() { return super.getParamByObject({search: this.search, itemId: this.itemId, warehouseId: this.warehouseId, from: this.from, to: this.to}); }
}

export interface StockValuation {
    asOf: string; currencyCode: string; stockValue: number; ledgerBalance: number; difference: number;
    rows: {itemId: string; code: string; name: string; unit: string; quantity: number; value: number}[]; truncated: boolean;
}

export interface ItemSalesRow {
    itemId: string; code: string; name: string; unit: string; type: ItemType; quantity: number; amount: number; cost: number | null; margin: number | null;
    marginPercent: number | null; documents: number;
}
export interface ItemSales { from: string; to: string; side: 'sales' | 'purchases'; currencyCode: string; quantity: number; amount: number; cost: number; margin: number; rows: ItemSalesRow[]; }
