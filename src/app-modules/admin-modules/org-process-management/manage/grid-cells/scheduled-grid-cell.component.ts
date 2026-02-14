import {Component} from "@angular/core";
import {CoreProcessFactory, DynamicComponent} from "@app-global";
import {Scheduler} from "../domains/scheduler.serializer";
@Component({
  standalone: false,
    template: `<div class="flex">
        <div class="flex flex-row">
            <a class="btn btn-xs text-xs text-primary" (click)="checkActivity(context)"><i class="fa fa-calendar"></i></a>
            <span class="text-xs">{{context.name}} </span>
        </div>
        <div class="item-except text-xs h-1x">
            <span class="badge green mx-1">{{context.frequencyTypeName}}</span>
            <span class="badge green mx-1">{{context.taskPriorityName}}</span>
        </div>
    </div>`
})
export class ScheduledNameActionCell extends DynamicComponent {
    constructor(public plugin: CoreProcessFactory) { super(); }
    checkActivity(task: Scheduler) {
        const { id, name } = task;
        const popupHeaderOption = {text: `Activity for ${name}`, desc: `Activity`};
        const inputData: any = { orgSchedulerId: id };
        this.plugin.showFrequencyCalenderTestPopup(inputData, popupHeaderOption);
    }
}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500">{{context.startTimeZoneDate | fullDateFormat }}</a>
    </div>`
})
export class ScheduledStartDateCell extends DynamicComponent{ constructor(){ super(); } }

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500">{{context.endTimeZoneDate | fullDateFormat}}</a>
    </div>`
})
export class ScheduledEndDateCell extends DynamicComponent{ constructor(){ super(); } }
@Component({
  standalone: false,
    template: `<div *ngIf="context[col.field]">
        <a class="text-xs _500">
            {{ context[col.field]?.dueDate | fullDateFormat }}
            <a class="text-primary" *ngIf="context[col.field].remark" [ngbPopover]="context[col.field].remark" placement="auto" (mouseenter)="p.open()" #p="ngbPopover" (mouseleave)="p.close()">
                <i class="fa fa-info-circle"></i>
            </a>
        </a>
        <div class="item-except h-1x">
            <span class="badge blue-grey" *ngIf="context[col.field].taskStatusTypeId">
                {{ context[col.field]?.taskStatusTypeName }}
            </span>
          <a class="text-primary text-xs" *ngIf="context[col.field].verificationRemark" [ngbPopover]="context[col.field].verificationRemark" placement="auto" (mouseenter)="p.open()" #p="ngbPopover" (mouseleave)="p.close()">
            <i class="fa fa-info-circle"></i>
          </a>
          {{ context[col.field]?.verifiedByEmployeeName }}
        </div>
    </div>`
})
export class ScheduledTaskLastRunCell extends DynamicComponent { constructor(){ super(); } }
