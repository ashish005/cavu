import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ACTION_ENUM, CoreProcessFactory, DynamicComponent} from "@app-global";
import {PipelineAPIResolver} from "../resolver/api.resolver";
import {OrgTask} from "../domains/org-task.serializer";

@Component({
  standalone: false,
    template: `<div>
        <!--<a class="btn btn-xs text-xs text-primary" (click)="checkActivity(context)"><i class="fa fa-calendar"></i></a>-->
        <a class="text-xs _500" (click)="routeTo(context)"> {{ context.name }} <span class="text-muted">({{ context.orgProcessName }})</span></a>
        <a class="px-1" [ngbPopover]="content" placement="auto" container="body" triggers="manual" [autoClose]="true" (mouseenter)="p.open()" #p="ngbPopover" (mouseleave)="p.toggle()">
            <i class="fa fa-info-circle"></i>
        </a>
        <ng-template #content>
            <div class="d-flex flex">
                <div class="d-flex flex">
                    <!--<scheduler-info [id]="id" [taskId]="orgTaskId"></scheduler-info>-->
                        <table class="table small-table text-xs">
                            <tr>
                                <td>Process</td>
                                <td class="text-right">{{ context.orgProcessName || '--' }}</td>
                            </tr>
                            <tbody class="lt">
                                <tr>
                                    <td>Assigned To</td>
                                    <td class="text-right">{{ context.assignedToName || '--' }}</td>
                                </tr>
                                <tr>
                                    <td>Reported To</td>
                                    <td class="text-right">{{ context.reportedToName || '--' }}</td>
                                </tr>
                                <tr>
                                    <td>Verified By</td>
                                    <td class="text-right">{{ context.verifiedByName || '--' }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2"> {{context.remark}}</td>
                                </tr>
                            </tfoot>
                        </table>
                </div>
            </div>
        </ng-template>
    </div>`
})
export class TaskNameActionCell extends DynamicComponent {
    constructor(public router: Router, public activatedRoute: ActivatedRoute, public lookupResolver: PipelineAPIResolver, public plugin: CoreProcessFactory) {
        super();
    }

    routeTo(context: OrgTask){
        // const { id } = context;
        // this.router.navigate(['task', id], {relativeTo: this.activatedRoute.parent});
    }

    checkActivity(task: OrgTask) {
        const {id} = task;
        const popupHeaderOption = {text: `Activity for ${task.name}`, desc: `Activity`};
        const inputData: any = { orgTaskId: id };
        this.plugin.showTaskActivityPopup(inputData, popupHeaderOption);
    }
}

@Component({
  standalone: false,
    template: `<div class="btn-group show">
      <a class="btn btn-xs text-xs text-primary" (click)="addTaskScheduler(context)"><i class="fa fa-fw fa-plus"></i> Scheduler </a>
      <a class="btn btn-xs text-xs text-primary" (click)="showAllSchedulers(context)">
        <i class="fa fa-calendar"></i>
        <i *ngIf="context.isInValidForSession" class="fa fa-hand-stop-o text-danger"></i>
      </a>
    </div>`
})
export class TriggerCellComponent extends DynamicComponent {
    constructor(public lookupResolver: PipelineAPIResolver, private plugin: CoreProcessFactory) {
        super();
    }

    // openSchedular(item: OrgTaskScheduler){
    //     const { id, orgTaskId, isFeeType, isPeriodType } = item;
    //     const { isManual, name } = this.context;
    //     const popupHeaderOption = { text: `${name}`, desc: `Schedule a tasks - ${ACTION_ENUM.UPDATE} Scheduler` };
    //     const inputData: any = {
    //         id: id, //Schedular ID
    //         orgTaskId: orgTaskId, //Org Task Id
    //         isManual: isManual,
    //         isFeeTask: isFeeType,
    //         isPeriodType: isPeriodType
    //     };
    //     this.apiResolver.showSchedulerPopup(inputData, popupHeaderOption);
    // }

    addTaskScheduler(task: OrgTask) {
        const {id, isManual, name} = task;
        const popupHeaderOption = {text: `${name}`, desc: `Schedule a tasks - ${ACTION_ENUM.UPDATE} Scheduler`};
        const inputData: any = {
            //id: null, //Schedular ID
            orgTaskId: id,//Org Task Id
            isManual: isManual
        };
        this.plugin.showSchedulerPopup(inputData, popupHeaderOption, () => {});
    }

    showAllSchedulers(task: OrgTask) {
        const {id, isManual, isFeeTask, isPeriodType, name} = this.context;
        const popupHeaderOption = {text: `${name}`, desc: `Schedule a tasks for ${name}`};
        const inputData: any = { orgTaskId: id };
        this.plugin.showMultiSchedulerPopup(inputData, popupHeaderOption, () => {});
        //this.lookupResolver.showTaskSchedulerPopup(inputData, popupHeaderOption, ()=>{})
    }
}

@Component({
  standalone: false,
    template: `<div class="btn-group show">
      <a class="btn btn-xs text-xs text-primary" (click)="createReminder(context)"><i class="fa fa-fw fa-plus"></i>Reminders</a>
      <!--<a *ngIf="!context?.orgReminders?.length" class="btn btn-xs white w-64"> &#45;&#45; </a>
      <a *ngIf="context?.orgReminders?.length" class="btn btn-xs white dropdown-toggle w-64" data-toggle="dropdown" aria-expanded="false">
        {{context.orgReminders.length}}
      </a>-->
      <a class="btn btn-xs text-xs text-primary" (click)="showNotificationReminders(context)"><i class="fa fa-bell"></i></a>
    </div>`
})
export class ReminderCellComponent extends DynamicComponent {
    constructor(public lookupResolver: PipelineAPIResolver) {
        super();
    }

    /*openReminder(item: OrgTaskReminder){
        const { id, orgTaskScheduleId, userGroupId, notificationId, frequencyType, reminderValue, name } = item;
        const inputData: any = {
            id: id,
            orgTaskId: id,
            data: {
                orgTaskId: id,
                orgTaskScheduleId: orgTaskScheduleId,
                userGroupId: userGroupId,
                notificationId: notificationId,
                frequencyType: frequencyType,
                reminderValue: reminderValue,
                name: name
            }
        };
        const popupHeaderOption = { text: `Reminder for ${item.name}`, desc: `Reminder will be send to user prior to scheduled time` };
        this.lookupResolver.showOrgTaskReminderCEPopup(inputData, popupHeaderOption);
    }*/

    createReminder(task: OrgTask) {
        const {id} = task;
        const inputData: any = {
            id: null,
            orgTaskId: id,
            data: {
                orgTaskId: id,
            }
        };
        const popupHeaderOption = {
            text: `Reminder for ${this.context.name}`,
            desc: `Reminder will be send to user prior to scheduled time`
        };
        this.lookupResolver.showTaskReminderCEPopup(inputData, popupHeaderOption);
    }

    showNotificationReminders(task: OrgTask) {
        const {id, name} = task;
        const inputData: any = {
            id: null,
            orgTaskId: id,
            data: {
                orgTaskId: id,
            }
        };
        const popupHeaderOption = {
            text: `Reminder for ${name}`,
            desc: `Reminder will be send to user prior to scheduled time`
        };
        this.lookupResolver.showOrgTaskReminderPopup(inputData, popupHeaderOption);
    }
}
