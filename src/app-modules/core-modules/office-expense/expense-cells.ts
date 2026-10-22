import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DynamicComponent} from "@app-global";
import {ExpenseGridEvents} from "./expense-api.service";
import {STATUS_LABEL, STATUS_TONE} from "./expense.models";

// Cell renderers of the expense grids (org-grid `cellTemplate`); clicks report through ExpenseGridEvents.

@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('open', context)">{{ context.number }}</a>
        <div class="text-xs text-muted text-truncate" style="max-width: 260px">{{ context.title }}</div>`
})
export class ClaimNumberCell extends DynamicComponent {
    constructor(public events: ExpenseGridEvents) { super(); }
}

@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <span class="badge" [ngClass]="tone[context.status]">{{ label[context.status] }}</span>
        <span *ngIf="context.violationCount" class="badge warn ml-1" title="Policy exceptions">{{ context.violationCount }} flag{{ context.violationCount === 1 ? '' : 's' }}</span>`
})
export class ClaimStatusCell extends DynamicComponent {
    readonly tone = STATUS_TONE;
    readonly label = STATUS_LABEL as Record<string, string>;
}

@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <span>{{ context.date }}</span>
        <span class="badge ml-1" [ngClass]="context.kind === 'Advance' ? 'info' : 'light'">{{ context.kind === 'Advance' ? 'Advance' : 'Reimbursement' }}</span>
        <span *ngIf="context.isVoided" class="badge danger ml-1">voided</span>`
})
export class PaymentKindCell extends DynamicComponent {}

@Component({
    standalone: true,
    imports: [CommonModule],
    template: `<button *ngIf="!context.isVoided && context.voucherId" type="button" class="btn btn-xs white" (click)="events.emit('void', context)">Void</button>`
})
export class PaymentActionsCell extends DynamicComponent {
    constructor(public events: ExpenseGridEvents) { super(); }
}
