import {Component} from "@angular/core";
import {CoreProcessFactory, DynamicComponent} from "@app-global";
import {PipelineAPIResolver} from "../resolver/api.resolver";
import {OrgTaskSummaryRow} from "../domains/org-task-summary.serializer";

@Component({
  standalone: false,
    template: `<div>
        <a class="btn btn-xs text-xs text-primary" (click)="checkActivity(context)"><i class="fa fa-calendar"></i></a>
        <span class="text-xs _500"> {{ context.name }}</span>
        <a class="px-1" [ngbPopover]="content" placement="auto" container="body" triggers="manual" [autoClose]="true" (mouseenter)="p.open()" #p="ngbPopover" (mouseleave)="p.toggle()">
            <i class="fa fa-info-circle"></i>
        </a>
        <ng-template #content>
            <div class="d-flex flex">
                <div class="d-flex flex">
                        <table class="table small-table text-xs">
                            <tr>
                                <td>Process</td>
                                <td class="text-right">{{ context.orgProcess?.name || '--' }}</td>
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
export class TaskSummaryNameActionCell extends DynamicComponent {
    constructor(public plugin: CoreProcessFactory) {
        super();
    }

    checkActivity(task: OrgTaskSummaryRow) {
        const {id} = task;
        const popupHeaderOption = {text: `Activity for ${task.name}`, desc: `Activity`};
        const inputData: any = { orgTaskId: id };
        this.plugin.showTaskActivityPopup(inputData, popupHeaderOption);
    }
}

/*@Component({
    template: `<div>
        <div class="list inset">
            <ng-template ngFor let-schedule [ngForOf]="context.schedules" let-j="index">
                <div class="list-item p-0 text-xs">
                    <div class="list-body">
                        {{schedule.dueDate | dateFormat}}
                        <div class="float-right">
                            <a class="btn btn-xs text-theme text-xs" (click)="showTaskStatusChangePopup(schedule)">edit</a>
                            <!--<task-status-change [schedule]="schedule">edit</task-status-change>-->
                        </div>
                        <div class="item-except text-sm h-1x">
                            <a *ngIf="schedule.taskStatusTypeId" class=" float-right item-title _500"><span class="badge lime">{{schedule.taskStatusTypeName ?? '--'}}</span></a>
                            <a class="text-primary item-date text-xs" (click)="checkScheduleActivity(schedule)">Activity</a>
                        </div>
                    </div>
                </div>
            </ng-template>
        </div>
        <span *ngIf="!context.schedules?.length">--</span>
        <!--<div class="item-except text-xs h-1x">
            <span class="text-info mx-2"><a class="btn btn-xs text-xs b-a" (click)="addTaskScheduler(context)"><i class="fa fa-fw fa-plus"></i>Schedule</a></span>
        </div>-->
    </div>`
})
export class TaskScheduleInfoCell extends DynamicComponent {
    submitted: boolean;

    constructor(public activatedRoute: ActivatedRoute, public lookupResolver: PipelineAPIResolver, public service:OrgTaskSummaryService) {
        super();
    }

    addTaskScheduler(task) {
        const {id, isManual, name} = task;
        const popupHeaderOption = {text: `${name}`, desc: `Schedule a tasks - ${ACTION_ENUM.UPDATE} Scheduler`};
        const inputData: any = {
            id: null, //Schedular ID
            orgTaskId: id,//Org Task Id
            isManual: isManual,
            // isFeeTask: isFeeTask,
            // isPeriodType: isPeriodType
        };
        this.lookupResolver.showSchedulerPopup(inputData, popupHeaderOption);
    }

    eventTaskCalendar(task: OrgTaskSummaryRow) {
        const {id} = task;
        const inputData: any = {
            id: id,
            orgTaskId: id
        };
        this.lookupResolver.showEventTaskPopup(inputData, {text: `${task.name}`, desc: `Manage Task`});
    }

    checkScheduleActivity(schedule: SchedulerLogSummary) {
        const {id} = this.context;
        const {orgTaskScheduleId} = schedule;
        const popupHeaderOption = {text: `Activity for Scheduler`, desc: `Activity`};
        const inputData: any = {
            orgTaskId: id,
            scheduleId: orgTaskScheduleId
        };
        this.lookupResolver.showEventTaskActivityPopup(inputData, popupHeaderOption);
    }

    // onStartDateChange(runLog, date) {
    //     runLog.startDate = date;
    // }
    //
    // onEndDateChange(runLog, date) {
    //     runLog.endDate = date;
    // }

    // onTaskStatusChange(runLog, taskStatusTypeId){
    //     const {id, name} = this.lookupResolver.masterType.taskStatus.find(r => r.id == taskStatusTypeId);
    //     runLog.taskStatusTypeId = id;
    //     runLog.taskStatusTypeName = name;
    // }

    // saveLogDetails(runLog, p) {
    //     const success = (resp) => {
    //         this.submitted = false;
    //         p.close();
    //     };
    //     const error = (resp) => {
    //         this.submitted = false;
    //     };
    //     this.submitted = true;
    //
    //     const {id} = runLog;
    //     if (id) {
    //         this.service.logRunStatusChange(id, runLog).subscribe(success, error);
    //     }
    // }
    showTaskStatusChangePopup(schedule){
        const popupHeaderOption = {text: `Activity for ${schedule.name}`, desc: `Activity`};
        const inputData: any = {
            schedule: schedule
        };
        this.lookupResolver.showTaskStatusChangePopup(inputData, popupHeaderOption);
    }
}

@Component({
    template: `<div>
        <div class="list inset" *ngIf="context[col.field]">
            <div class="list-item p-0 text-xs">
                <div class="list-body">
                    {{ context[col.field]?.dueDate | fullDateFormat}}
                    <!--<div class="float-right">
                        <a class="btn btn-xs text-theme text-xs" (click)="showTaskStatusChangePopup(context[col.field])">edit</a>
                    &lt;!&ndash;<task-status-change [schedule]="context[col.field]">edit</task-status-change>&ndash;&gt;
                    </div>
                    <div class="item-except text-sm h-1x">
                        <a *ngIf="context[col.field]?.taskStatusTypeId" class=" float-right item-title _500"><span class="badge lime">{{context[col.field]?.taskStatusTypeName ?? '&#45;&#45;'}}</span></a>
                        &lt;!&ndash;<small class="text-muted">{{ context[col.field]?.startDate | dateFormat }} - {{ context[col.field]?.endDate | dateFormat }}</small>&ndash;&gt;
                    </div>-->
                </div>
            </div>
        </div>
        <span *ngIf="!context[col.field]">--</span>
    </div>`
})
export class TaskLastRunLogCell extends DynamicComponent {
    constructor(public lookupResolver: PipelineAPIResolver) {
        super();
    }
    showTaskStatusChangePopup(schedule){
        const popupHeaderOption = {text: `Activity for ${schedule.name}`, desc: `Activity`};
        const inputData: any = {
            schedule: schedule
        };
        this.lookupResolver.showTaskStatusChangePopup(inputData, popupHeaderOption);
    }
}*/

@Component({
  standalone: false,
    template: `<div>
        <div class="list inset" *ngIf="context[col.field]">
            <div class="list-item p-0 text-xs">
                <div class="list-body">
                    {{ context[col.field]?.dueDate | fullDateFormat}}
                    <!--<div class="float-right">
                        <task-status-change [schedule]="context[col.field]">edit</task-status-change>
                    </div>-->
                    <!--<div class="item-except text-sm h-1x">
                        <a *ngIf="context[col.field]?.taskStatusTypeId" class="item-title _500"><span class="badge blue-grey">{{context[col.field]?.taskStatusTypeName ?? '&#45;&#45;'}}</span></a>
                        &lt;!&ndash;<small class="text-muted">{{ context[col.field]?.startDate | dateFormat }} - {{ context[col.field]?.endDate | dateFormat }}</small>&ndash;&gt;
                        <a class="btn btn-xs text-theme text-xs float-right" (click)="showTaskStatusChangePopup(context[col.field])">edit</a>
                    </div>-->
                </div>
            </div>
        </div>
        <span *ngIf="!context[col.field]">--</span>
    </div>`
})
export class TaskNextScheduleRunCell extends DynamicComponent {
    submitted: boolean;

    constructor(public lookupResolver: PipelineAPIResolver) {
        super();
    }
    showTaskStatusChangePopup(schedule){
        const popupHeaderOption = {text: `Activity for ${schedule.name}`, desc: `Activity`};
        const inputData: any = {
            schedule: schedule
        };
        this.lookupResolver.showTaskStatusChangePopup(inputData, popupHeaderOption);
    }
}
