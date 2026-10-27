import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DynamicComponent} from "@app-global";
import {FinanceGridEvents} from "../services/finance-api.service";
import {QUOTE_STATUS_LABEL, QUOTE_STATUS_TONE, VENDOR_QUOTE_STATUS_LABEL, VENDOR_QUOTE_STATUS_TONE} from "./quote.models";

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
             [class.text-warning]="context.daysToExpiry <= 7">{{ context.daysToExpiry === 0 ? 'expires today' : 'expires in ' + context.daysToExpiry + ' d' }}</div>
        <div *ngIf="context.status === 'pending_approval' && context.pendingStep" class="text-xs text-muted"><i class="fa fa-clock-o mr-1"></i>{{ context.pendingStep }}</div>`
})
export class QuoteStatusCell extends DynamicComponent {
    readonly tone = QUOTE_STATUS_TONE as Record<string, string>;
    readonly label = QUOTE_STATUS_LABEL as Record<string, string>;
}

/** Vendor quote number (opens it) with the vendor's reference and subject. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('vendor_quote', context)">{{ context.number }}</a>
        <span *ngIf="context.vendorReference" class="text-xs text-muted"> {{ context.vendorReference }}</span>
        <div *ngIf="context.subject" class="text-xs text-muted text-truncate" style="max-width: 240px">{{ context.subject }}</div>`
})
export class VendorQuoteNumberCell extends DynamicComponent {
    constructor(public events: FinanceGridEvents) { super(); }
}

/** Status, expiry, and how much of it is used on client quotes. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <span class="badge" [ngClass]="tone[context.status]">{{ label[context.status] }}</span>
        <span *ngIf="context.expired" class="badge danger ml-1">expired</span>
        <div *ngIf="context.usedLines" class="text-xs text-muted">{{ context.usedLines }}/{{ context.lineCount }} lines quoted</div>`
})
export class VendorQuoteStatusCell extends DynamicComponent {
    readonly tone = VENDOR_QUOTE_STATUS_TONE as Record<string, string>;
    readonly label = VENDOR_QUOTE_STATUS_LABEL as Record<string, string>;
}
