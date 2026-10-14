import {Component, Injectable} from "@angular/core";
import {CoreProcessFactory, DynamicComponent} from "@app-global";
import {ComplianceAPIResolver} from "../services";
import {Compliance} from "../domains/compliance.serializer";

@Component({
  standalone: false,
    template: `<div>
    <a class="text-xs _500">{{context.name}}</a>
    <div class="item-except text-xs">
        <a class="btn btn-xs text-xs _400" *ngIf="context.schedule?.name"
           [ngbPopover]="schedulerDates" placement="auto" container="body"
           (mouseenter)="p.open()" #p="ngbPopover" (mouseleave)="p.close()">
            <i class="fa fa-pie-chart"></i>
        </a>
        <ng-template #schedulerDates><small class="text-xs _500">{{context.schedule?.name}}</small></ng-template>
        <!--<a class="btn btn-xs text-xs b-theme text-theme p-1" (click)="showComplianceDetailPopup(context)">
            <i class="fa fa-calendar"></i>
        </a>-->
    </div>
</div>`
})
export class ComplianceNameCellComponent extends DynamicComponent {
    constructor(public lookupResolver: ComplianceAPIResolver) {
        super();
    }

    showComplianceDetailPopup(row: Compliance){
        const inputData: any = { id: row.id, data: row.schedule };
        const onSuccess = (resp: any) => {};
        this.lookupResolver.showCompliancDetailPopup(inputData,{ text: `${row?.name}`, desc: `` }, onSuccess);
    }
}

@Component({
    standalone: false,
    template: `<div>
    <a class="text-xs _500">{{context.complianceTypeName}}</a>
    <div class="item-except text-xs">
        <span class="badge blue">{{context.subscriptionName}}</span>
    </div>
</div>`
})
export class ComplianceTypeCellComponent extends DynamicComponent {
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
        <small class="badge b-a _500">{{context.regulatoryRegNo}}</small>
        <small class="badge b-a _500">{{context.regulatoryRegDate | dateFormat}}</small>
        <a class="badge yellow b-a _500"> <small class="pr-1">Renewal</small> {{context.regulatoryRenewalDate | dateFormat}}</a>
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
        <!--<a class="btn btn-xs text-xs b-theme text-theme p-1"
           (click)="showScheduler(context)"
           [class.b-success]="(context.orgTaskScheduleId)"
           [class.text-success]="(context.orgTaskScheduleId)">
            <i class="fa fa-calendar"></i>
        </a>-->
        <small class="text-xs _500">{{context.schedule?.name}}</small>
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
    constructor(public lookupResolver: ComplianceAPIResolver, private plugin: CoreProcessFactory) {
        super();
    }

    /**
     * Processes, tasks and schedules of this compliance item. They are linked by entity type 'compliance' and the
     * item's id, so triggers and stage rules can react to compliance events too.
     */
    showScheduler(row: Compliance){
        const { id, name, regulatoryName, taskName } = row;
        this.plugin.showEntityWorkflow(
            { type: 'compliance', id: String(id), name },
            { text: taskName ? `${taskName}: ${name}` : name, desc: `${regulatoryName ?? ''}` });
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
