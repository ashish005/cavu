import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DynamicComponent} from "@app-global";
import {NotifyGridEvents} from "./notification-api.service";
import {CHANNEL_ICON, CHANNEL_LABEL, STATUS_LABEL, STATUS_TONE} from "./notification.models";

// Cell renderers of the delivery log grid (org-grid `cellTemplate`); buttons report through NotifyGridEvents.

/** One badge per channel and address, coloured by its result. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <span *ngFor="let d of context.deliveries" class="badge mr-1 mb-1" [ngClass]="tone[d.status]" [title]="d.destination + (d.error ? ' — ' + d.error : '')">
            <i class="fa fa-fw" [ngClass]="icon[d.channel]"></i> {{ label[d.channel] }}</span>
        <span *ngIf="!context.deliveries?.length" class="text-xs text-muted">—</span>`
})
export class NotifyChannelsCell extends DynamicComponent {
    readonly tone = STATUS_TONE;
    readonly icon = CHANNEL_ICON;
    readonly label = CHANNEL_LABEL;
}

@Component({
    standalone: true,
    imports: [CommonModule],
    template: `<span class="badge" [ngClass]="tone[context.status]">{{ label[context.status] }}</span>`
})
export class NotifyStatusCell extends DynamicComponent {
    readonly tone = STATUS_TONE;
    readonly label = STATUS_LABEL;
}

@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="text-nowrap">
            <button type="button" class="btn btn-xs white mr-1" (click)="events.emit('open', context)">Details</button>
            <button *ngIf="hasFailed" type="button" class="btn btn-xs white" (click)="events.emit('retry', context)">Send again</button>
        </div>`
})
export class NotifyActionsCell extends DynamicComponent {
    constructor(public events: NotifyGridEvents) { super(); }
    get hasFailed() { return (this.context?.deliveries ?? []).some((d: any) => d.status === 'Failed'); }
}
