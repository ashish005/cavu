import {Component, Injectable} from "@angular/core";
import {DynamicComponent} from "@app-global";
import {ComplianceAPIResolver} from "../services";
import {Compliance} from "../domains/compliance.serializer";

@Component({
  standalone: false,
    template: `<div>
    <a class="text-xs _500">{{context.name}}</a>
    <div class="item-except text-xs">
        <a class="text-xs">{{context.complianceTypeName}}</a>
    </div>
</div>`
})
export class ComplianceNameCellComponent extends DynamicComponent {
    constructor(public lookupResolver: ComplianceAPIResolver) {
        super();
    }
}

@Component({
  standalone: false,
    template: `<div>
    <a class="text-xs _500">{{context.taxRegimeName}} {{context.rate}}{{context.calculationType}}</a>
    <div class="item-except text-xs">
        <a class="text-xs"></a>
    </div>
</div>`
})
export class ComplianceRateCellComponent extends DynamicComponent {
    constructor(public lookupResolver: ComplianceAPIResolver) {
        super();
    }
}

@Component({
  standalone: false,
    template: `<div>
    <a class="text-xs _500">{{context.regulatoryName}}</a>
    <div class="item-except text-xs h-1x">
        <a class="text-xs pr-2"><small class="pr-1">Reg. No:</small>{{context.regulatoryRegistrationNo}}</a>
        <a class="text-xs"> <small class="pr-1">Reg. Date</small> {{context.regulatoryRegistrationDate | dateFormat}}</a>
        <a class="text-xs"> <small class="pr-1">Renewal Date</small> {{context.regulatoryRenewalDate | dateFormat}}</a>
    </div>
</div>`
})
export class ComplianceRegulatoryNameCellComponent extends DynamicComponent {
    constructor(public lookupResolver: ComplianceAPIResolver) {
        super();
    }
}


@Component({
  standalone: false,
    template: `<div>
        <a class="btn btn-xs text-xs b-theme text-theme p-1"
           (click)="showScheduler(context)"
           [class.b-success]="(context.orgTaskScheduleId)"
           [class.text-success]="(context.orgTaskScheduleId)">
            <i class="fa fa-calendar"></i>
        </a>
        <a class="text-xs _500 pl-2">{{context.schedulerFrequencyMaster}}</a>
    <!--<a class="btn btn-xs text-xs _400"
       [ngbPopover]="schedulerDates" placement="auto" container="body"
       (mouseenter)="p.open()" #p="ngbPopover" (mouseleave)="p.close()">
        <i class="fa fa-pie-chart"></i>
    </a>
    <ng-template #schedulerDates>
        <table class="w w-auto-md table small-table text-xs mb-0">
            <thead>
                <tr><th>Due Dates</th></tr>
            </thead>
            <tbody>
            <ng-template ngFor let-schDate [ngForOf]="context.scheduledDates" let-j="index">
                <tr><td>{{ schDate | dateFormat}}</td></tr>
            </ng-template>
            </tbody>
        </table>
    </ng-template>-->
</div>`
})
export class ComplianceSchedulerCellComponent extends DynamicComponent {
    constructor(public lookupResolver: ComplianceAPIResolver) {
        super();
    }

    showScheduler(row: Compliance){
        const { id, taskId, orgTaskScheduleId, name, regulatoryName, taskName } = row;
        const inputData: any = {
            id: orgTaskScheduleId, //Schedular ID
            taskId: taskId, //Org Task Id
            isManual: true,
            isFeeTask: false,
            addManually: true,
        };
        this.lookupResolver.showSchedulerPopup(id, inputData, { text: `${taskName}: ${name}`, desc: `${regulatoryName}` });
    }
}

@Component({
  standalone: false,
    template: `<div>
    <a class="text-xs _500">{{context.renewalDate | dateFormat}}</a>
    <div class="item-except text-xs h-1x">
        <a class="text-xs pr-2 text-danger" *ngIf="context.isRenewalRequired">Renewal Date</a>
    </div>
</div>`
})
export class ComplianceRegulatoryRenewalCellComponent extends DynamicComponent {
    constructor(public lookupResolver: ComplianceAPIResolver) {
        super();
    }
}

@Component({
  standalone: false,
    template: `<div>
    <a class="text-xs _500">{{context.userId}}</a>
    <div class="item-except text-xs h-1x">
        <a class="text-xs pr-2"><small class="pr-1">Password:</small>{{context.password}}</a>
    </div>
</div>`
})
export class ComplianceRegulatoryUrlCellComponent extends DynamicComponent {
    constructor(public lookupResolver: ComplianceAPIResolver) {
        super();
    }
}

@Component({
  standalone: false,
    template: `<div>
    <table class="w w-auto-md table small-table text-xs mb-0">
        <tbody>
            <ng-template ngFor let-subscription [ngForOf]="context.subscriptions" let-j="index">
                <tr><td>{{ subscription.name}}</td></tr>
            </ng-template>
        </tbody>
    </table>
</div>`
})
export class SubscriptionCellComponent extends DynamicComponent {
    constructor() {
        super();
    }
}
