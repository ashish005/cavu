import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DynamicComponent} from "@app-global";
import {FinanceGridEvents} from "../services/finance-api.service";
import {ITEM_TYPE_LABEL, STOCK_DOC_LABEL, STOCK_DOC_TONE, STOCK_SOURCE_LABEL, STOCK_STATUS} from "./inventory.models";

// Cell renderers of the inventory grids. Clicks report through FinanceGridEvents with their own action names
// ('item', 'stock-doc', 'source'), so they never trigger another grid's handler.

/** Item name, code and type (opens the item). */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('item', context)">{{ context.name }}</a>
        <span *ngIf="context.isActive === false" class="badge grey ml-1">inactive</span>
        <div class="text-xs text-muted"><span class="text-monospace">{{ context.code }}</span> · {{ typeLabel[context.type] ?? context.unit }}
            <span *ngIf="context.classificationCode"> · HSN/SAC {{ context.classificationCode }}</span></div>`
})
export class ItemNameCell extends DynamicComponent {
    readonly typeLabel = ITEM_TYPE_LABEL;
    constructor(public events: FinanceGridEvents) { super(); }
}

/** Quantity on hand with its unit and a low / out badge (stocked items; "—" otherwise). */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <ng-container *ngIf="qty !== null && qty !== undefined; else none">
            <span [class.text-danger]="qty <= 0">{{ qty | number:'1.0-4' }}</span> <span class="text-xs text-muted">{{ context.unit }}</span>
            <span *ngIf="status as s" class="badge ml-1" [ngClass]="s.tone">{{ s.label }}</span>
        </ng-container>
        <ng-template #none><span class="text-muted">—</span></ng-template>`
})
export class StockQtyCell extends DynamicComponent {
    get qty(): number | null { return this.context.onHand !== undefined ? this.context.onHand : this.context.quantity; }
    get status() {
        if (this.context.status) { return this.context.status === 'ok' ? null : STOCK_STATUS[this.context.status as keyof typeof STOCK_STATUS]; }
        if (this.qty === null) { return null; }
        return this.qty <= 0 ? STOCK_STATUS.out : this.context.isLow ? STOCK_STATUS.low : null;
    }
}

/** Stock document number, kind and status (opens it). */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('stock-doc', context)">{{ context.number }}</a>
        <span class="badge ml-1" [ngClass]="tone[context.status]">{{ context.status }}</span>
        <div class="text-xs text-muted">{{ label[context.kind] }}<span *ngIf="context.reason"> · {{ context.reason }}</span></div>`
})
export class StockDocCell extends DynamicComponent {
    readonly label = STOCK_DOC_LABEL;
    readonly tone = STOCK_DOC_TONE;
    constructor(public events: FinanceGridEvents) { super(); }
}

/** What moved the stock (opens the invoice, bill, note or stock document). */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" (click)="events.emit('source', context)">{{ context.sourceNumber }}</a>
        <span *ngIf="context.isReversal" class="badge dark ml-1">void</span>
        <div class="text-xs text-muted">{{ label[context.source] }}</div>`
})
export class StockSourceCell extends DynamicComponent {
    readonly label = STOCK_SOURCE_LABEL;
    constructor(public events: FinanceGridEvents) { super(); }
}

/** Signed quantity: green in, red out. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `<span [class.text-success]="context.quantity > 0" [class.text-danger]="context.quantity < 0">{{ context.quantity > 0 ? '+' : '' }}{{ context.quantity | number:'1.0-4' }}</span>
        <span class="text-xs text-muted"> {{ context.unit }}</span>`
})
export class StockChangeCell extends DynamicComponent {}

export const INVENTORY_CELLS = [ItemNameCell, StockQtyCell, StockDocCell, StockSourceCell, StockChangeCell];
