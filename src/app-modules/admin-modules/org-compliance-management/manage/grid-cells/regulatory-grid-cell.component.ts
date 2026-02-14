import {Component} from "@angular/core";
import {DynamicComponent} from "@app-global";
@Component({
    standalone: false,
    template: `<div><a class="text-xs _500">{{context.registrationNo}}</a>
    <div class="item-except text-xs">
        <a class="text-xs">{{context.registrationDate | dateFormat}}</a>
    </div></div>`
})
export class RegulatoryRegCellComponent extends DynamicComponent {
    constructor() {super();}
}

@Component({
    standalone: false,
    template: `<div>
        <a class="text-xs _500">{{context.userId}}</a>
        <div class="item-except text-xs">
            <a class="text-xs">******</a>
        </div>
    </div>`
})
export class RegulatoryCredentialCellComponent extends DynamicComponent {
    constructor() {super();}
}

@Component({
    standalone: false,
    template: `<div>
    <a class="text-xs _500">{{context.renewalDate | dateFormat}}</a>
    <div class="item-except text-xs h-1x">
        <span class="badge warn" *ngIf="context.isRenewalRequired">Renewal expected</span>
    </div>
</div>`
})
export class RegulatoryRenewalCellComponent extends DynamicComponent {
    constructor() {
        super();
    }
}