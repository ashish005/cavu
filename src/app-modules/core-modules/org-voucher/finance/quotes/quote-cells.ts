import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DynamicComponent} from "@app-global";
import {FinanceGridEvents} from "../services/finance-api.service";
import {QUOTE_STATUS_LABEL, QUOTE_STATUS_TONE} from "./quote.models";

/** Quote number (opens it) with the title and revision. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('quote', context)">{{ context.number }}</a><span *ngIf="context.revision > 1" class="text-xs text-muted"> rev {{ context.revision }}</span>
        <div *ngIf="context.title" class="text-xs text-muted text-truncate" style="max-width: 240px">{{ context.title }}</div>`
})
export class QuoteNumberCell extends DynamicComponent {
    constructor(public events: FinanceGridEvents) { super(); }
}

/** Status, and how soon it expires while open. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <span class="badge" [ngClass]="tone[context.status]">{{ label[context.status] }}</span>
        <div *ngIf="(context.status === 'sent' || context.status === 'approved') && context.daysToExpiry !== null" class="text-xs"
             [class.text-warning]="context.daysToExpiry <= 7">{{ context.daysToExpiry === 0 ? 'expires today' : 'expires in ' + context.daysToExpiry + ' d' }}</div>`
})
export class QuoteStatusCell extends DynamicComponent {
    readonly tone = QUOTE_STATUS_TONE as Record<string, string>;
    readonly label = QUOTE_STATUS_LABEL as Record<string, string>;
}
