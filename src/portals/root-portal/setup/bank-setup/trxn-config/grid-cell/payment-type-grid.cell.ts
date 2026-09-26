import { DynamicComponent } from "@app-global";
import {Component} from "@angular/core";

@Component({
  standalone: false,
    template: `
<ul class="list-group">
    <ng-template ngFor let-mode [ngForOf]="context?.modes" let-i="index">
        <li class="list-group-item p-1">
            <div class="clear d-block">
                <a class="text-xs text-muted">{{mode.name}}</a>
                <div class="float-right text-xs d-block">
                    <ng-template ngFor let-item [ngForOf]="mode.items" let-i="index">
                        <div class="d-inline-block mx-1 badge badge-pill primary" [ngClass]="(mode.items.length - 1 > i) ? 'b-r': ''"> {{item.name}}</div>
                    </ng-template>
                </div>
            </div>
        </li>
    </ng-template>
</ul>`
})
export class PaymentModeCellComponent extends DynamicComponent {
    constructor() { super(); }
}

@Component({
  standalone: false,
    template: `
<ul class="list-group">
    <ng-template ngFor let-row [ngForOf]="context?.gateways" let-i="index">
        <li class="list-group-item p-1"><small>{{row.name}}</small></li>
    </ng-template>
</ul>`
})
export class PaymentGatewayCellComponent extends DynamicComponent {
    constructor() { super(); }
}
