import {Component, Pipe, PipeTransform} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DynamicComponent} from "@app-global";
import {FinanceGridEvents} from "../services/finance-api.service";
import {KINDS, STATUS_LABEL} from "../domains/finance.models";

// Cell renderers of the finance grids (org-grid `cellTemplate`). Buttons report through FinanceGridEvents; the view
// listening on it does the work.

const formatters = new Map<string, Intl.NumberFormat>();

/** An amount in its currency, with the currency's own decimals (JPY none, KWD three). */
export function formatMoney(value: number | null | undefined, currency: string | null | undefined, showCode = true): string {
    if (value === null || value === undefined || isNaN(+value)) { return '—'; }
    const code = (currency || 'USD').toUpperCase();
    const key = `${code}|${showCode}`;
    let f = formatters.get(key);
    if (!f) {
        try {
            f = showCode
                ? new Intl.NumberFormat(undefined, {style: 'currency', currency: code, currencyDisplay: 'code'})
                : new Intl.NumberFormat(undefined, {minimumFractionDigits: new Intl.NumberFormat(undefined, {style: 'currency', currency: code}).resolvedOptions().minimumFractionDigits,
                    maximumFractionDigits: new Intl.NumberFormat(undefined, {style: 'currency', currency: code}).resolvedOptions().maximumFractionDigits});
        } catch { f = new Intl.NumberFormat(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}); }
        formatters.set(key, f);
    }
    return f.format(+value);
}

@Pipe({name: 'money', standalone: true})
export class MoneyPipe implements PipeTransform {
    transform(value: number | null | undefined, currency?: string | null, showCode = true): string { return formatMoney(value, currency, showCode); }
}

@Pipe({name: 'finStatus', standalone: true})
export class FinanceStatusPipe implements PipeTransform {
    transform(status: string | null | undefined, part: 'label' | 'tone' = 'label'): string {
        const s = STATUS_LABEL[status ?? ''] ?? {label: status ?? '', tone: 'grey'};
        return part === 'tone' ? s.tone : s.label;
    }
}

/** Document number (draft badge), reference. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('open', context)">{{ context.isDraft ? 'Draft' : context.number }}</a>
        <div *ngIf="context.reference" class="text-xs text-muted text-truncate" style="max-width: 160px">Ref {{ context.reference }}</div>`
})
export class DocNumberCell extends DynamicComponent {
    constructor(public events: FinanceGridEvents) { super(); }
}

/** Customer, vendor or account, with the memo. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="text-truncate" style="max-width: 260px">{{ context.partyName }}</div>
        <div *ngIf="context.notes" class="text-xs text-muted text-truncate" style="max-width: 260px">{{ context.notes }}</div>`
})
export class DocPartyCell extends DynamicComponent {}

/** Total and what is still due. */
@Component({
    standalone: true,
    imports: [CommonModule, MoneyPipe],
    template: `
        <div class="text-right _600">{{ context.total | money:context.currencyCode }}</div>
        <div *ngIf="context.balance > 0 && context.balance !== context.total" class="text-right text-xs text-muted">{{ context.balance | money:context.currencyCode }} due</div>`
})
export class DocAmountCell extends DynamicComponent {}

/** State badge, days overdue, quick actions. */
@Component({
    standalone: true,
    imports: [CommonModule, FinanceStatusPipe],
    template: `
        <span class="badge" [ngClass]="context.status | finStatus:'tone'">{{ context.status | finStatus }}</span>
        <span *ngIf="context.daysOverdue" class="text-xs text-danger ml-1">{{ context.daysOverdue }} d</span>
        <div class="mt-1">
            <button *ngIf="context.status === 'draft' || context.status === 'approved'" type="button" class="btn btn-xs white mr-1" (click)="events.emit('post', context)">Post</button>
            <button *ngIf="(context.status === 'open' || context.status === 'overdue' || context.status === 'partially_paid') && settleable" type="button" class="btn btn-xs white"
                    (click)="events.emit('pay', context)">{{ context.kind === 'Invoice' ? 'Receive' : 'Pay' }}</button>
        </div>`
})
export class DocStatusCell extends DynamicComponent {
    constructor(public events: FinanceGridEvents) { super(); }
    get settleable() { return this.context?.kind === 'Invoice' || this.context?.kind === 'Bill'; }
}

/** Kind label (dashboard lists mix invoices and bills). */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `<i [class]="info?.icon" class="text-muted mr-1"></i>{{ info?.label }}`
})
export class DocKindCell extends DynamicComponent {
    get info() { return KINDS[this.context?.kind as keyof typeof KINDS]; }
}

/** Tax code and name with default / off badges. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('open', context)">{{ context.code }}</a>
        <span *ngIf="context.isDefault" class="badge info ml-1">default</span>
        <span *ngIf="!context.isActive" class="badge grey ml-1">off</span>
        <div class="text-xs text-muted">{{ context.name }}</div>`
})
export class TaxCodeCell extends DynamicComponent {
    constructor(public events: FinanceGridEvents) { super(); }
}

/** Document type name and its next number. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <a role="button" class="_600" (click)="events.emit('open', context)">{{ context.name }}</a>
        <span *ngIf="!context.isActive" class="badge grey ml-1">off</span>
        <div class="text-xs text-muted">Next: <span class="text-monospace">{{ context.manual ? 'entered by hand' : context.nextNumber }}</span> · {{ context.issued }} issued this year</div>`
})
export class DocumentTypeCell extends DynamicComponent {
    constructor(public events: FinanceGridEvents) { super(); }
}

/** A failed posting with its reason and a retry button. */
@Component({
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="_600">{{ context.voucherNo || context.voucherId }} <span class="text-muted text-xs">{{ context.voucherType }}</span></div>
        <div *ngIf="context.lastError" class="text-xs text-danger text-truncate" style="max-width: 520px" [title]="context.lastError">{{ context.errorCode }} · {{ context.lastError }}</div>
        <button *ngIf="context.status === 'Dead'" type="button" class="btn btn-xs white mt-1" (click)="events.emit('retry', context)">Retry</button>`
})
export class PostingJobCell extends DynamicComponent {
    constructor(public events: FinanceGridEvents) { super(); }
}

/** Recurring schedule name, document and state. */
@Component({
    standalone: true,
    imports: [CommonModule, MoneyPipe],
    template: `
        <a role="button" class="_600" (click)="events.emit('open', context)">{{ context.name }}</a>
        <span *ngIf="context.isPaused" class="badge grey ml-1">paused</span>
        <span *ngIf="context.autoPost" class="badge info ml-1">auto-post</span>
        <div class="text-xs text-muted">{{ context.kind === 'Bill' ? 'Bill' : 'Invoice' }} {{ context.templateNumber }} · {{ context.partyName }} · {{ context.amount | money:context.currencyCode }}</div>
        <div *ngIf="context.lastError" class="text-xs text-danger">{{ context.lastError }}</div>`
})
export class RecurringCell extends DynamicComponent {
    constructor(public events: FinanceGridEvents) { super(); }
}
