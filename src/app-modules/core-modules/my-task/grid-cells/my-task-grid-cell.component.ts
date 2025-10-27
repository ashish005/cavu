import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DynamicComponent, ACTION_ENUM, SharedService} from "@app-global";
import {MyTaskSchedule} from "../domains/my-task/my-task-schedule.serializer";
import {MyTask, TaskSchedule} from "../domains/my-task.serializer";
import {MyTaskAPIResolver} from "../services/api.resolver";
import {MyTaskService} from "../services/my-task.service";

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500"> {{ context.name }} </a>
        <!--<a class="btn btn-xs text-xs b-a" (click)="createReminder(context)"><i class="fa fa-fw fa-plus"></i> Reminder</a>-->
        <div class="item-except text-xs h-1x">
            <span class="badge lime">{{ context.orgProcess?.name }}</span>
            <span *ngIf="context.project" class="b-a mx-2">
                <small class="pr-1"> {{ context.project?.processName }} </small> for {{ context.project?.projectName }}
            </span>
        </div>
    </div>`
})
export class TaskNameActionCell extends DynamicComponent {
    constructor(private router: Router, public activatedRoute: ActivatedRoute,
                private sharedService: SharedService, public apiResolver: MyTaskAPIResolver) {
        super();
    }

    showDetails(row: MyTaskSchedule) {
        //this.router.navigate([row.accountId], {relativeTo: this.activatedRoute.parent.parent});
    }

    addTaskScheduler(task) {
        const {id, isManual, isFeeTask, isPeriodType, name} = task;
        const popupHeaderOption = {text: `${name}`, desc: `Schedule a tasks - ${ACTION_ENUM.UPDATE} Scheduler`};
        const inputData: any = {
            id: null, //Schedular ID
            taskId: id,//Org Task Id
            isManual: isManual,
            isFeeTask: isFeeTask,
            isPeriodType: isPeriodType
        };
        this.apiResolver.showSchedulerPopup(inputData, popupHeaderOption);
    }

    /*createReminder(task: OrgMyTask){
        const { id,orgReminders } = task;

        const popupHeaderOption = { text: `Reminder for ${task.name}`, desc: `Reminder will be send to user prior to scheduled time` };
        const inputData: any = {
            notificationId: null,
            taskId: id,
            list: orgReminders,
            activeView: 'reminder'
        };
        this.apiResolver.showNotificationReminder(inputData, popupHeaderOption);
    }*/

    eventTaskCalendar(task: MyTask) {
        const {id} = task;
        const inputData: any = {
            id: id,
            orgTaskId: id
        };
        this.apiResolver.showEventTaskPopup(inputData, {text: `${task.name}`, desc: `Manage Task`});
    }

    checkActivity(task: MyTask) {
        const {id} = task;

        const popupHeaderOption = {text: `Activity for ${task.name}`, desc: `Activity`};
        const inputData: any = {
            orgTaskId: id
        };
        this.apiResolver.showEventTaskActivityPopup(inputData, popupHeaderOption);
    }
}

@Component({
  standalone: false,
    template: `<div>
        <div class="list-group text-xs">
            <ng-template ngFor let-schedule [ngForOf]="context.schedules" let-j="index">
                <div class="list-group-item py-0 px-1" *ngIf="schedule.todayRunSchedule">
                    <span class="float-right">
                        <a class="btn btn-xs text-theme text-xs" (click)="showTaskStatusChangePopup(schedule.todayRunSchedule)">edit</a>
                        <!--<task-status-change [schedule]="schedule.todayRunSchedule">edit</task-status-change>-->
                    </span>
                    <span class="float-right pr-2">
                    {{schedule.todayRunSchedule?.taskStatusTypeName ?? '--'}}
                    </span>
                    <a class="text-primary item-date text-xs" (click)="checkScheduleActivity(schedule)">Activity</a>
                    {{schedule.description}}
                </div>
            </ng-template>
        </div>
        <span *ngIf="!context.schedules?.length">--</span>
        <div class="item-except text-xs h-1x">
            <a class="text-primary item-date text-xs" (click)="checkActivity(context)">Task Activity</a>
            <!--<span class="text-info mx-2"><a class="btn btn-xs text-xs b-a" (click)="addTaskScheduler(context)"><i class="fa fa-fw fa-plus"></i>Schedule</a></span>-->
        </div>
    </div>`
})
export class TaskScheduleInfoCell extends DynamicComponent {
    submitted: boolean;
    constructor(public activatedRoute: ActivatedRoute, public apiResolver: MyTaskAPIResolver,
                public taskService: MyTaskService) {
        super();
    }

    addTaskScheduler(task) {
        const {id, isManual, isFeeTask, isPeriodType, name} = task;
        const popupHeaderOption = {text: `${name}`, desc: `Schedule a tasks - ${ACTION_ENUM.UPDATE} Scheduler`};
        const inputData: any = {
            id: null, //Schedular ID
            taskId: id,//Org Task Id
            isManual: isManual,
            isFeeTask: isFeeTask,
            isPeriodType: isPeriodType
        };
        this.apiResolver.showSchedulerPopup(inputData, popupHeaderOption);
    }

    eventTaskCalendar(task: MyTask) {
        const {id} = task;
        const inputData: any = {
            id: id,
            orgTaskId: id
        };
        this.apiResolver.showEventTaskPopup(inputData, {text: `${task.name}`, desc: `Manage Task`});
    }

    checkActivity(task: MyTask) {
        const {id} = task;

        const popupHeaderOption = {text: `Activity for ${task.name}`, desc: `Activity`};
        const inputData: any = {
            orgTaskId: id
        };
        this.apiResolver.showEventTaskActivityPopup(inputData, popupHeaderOption);
    }

    checkScheduleActivity(schedule: TaskSchedule) {
        const { id, orgTaskId } = schedule;
        const popupHeaderOption = {text: `Activity for Scheduler`, desc: `Activity`};
        const inputData: any = {
            orgTaskId: orgTaskId,
            scheduleId: id
        };
        this.apiResolver.showEventTaskActivityPopup(inputData, popupHeaderOption);
    }

    onStartDateChange(runLog, date){ runLog.startDate = date; }
    onEndDateChange(runLog, date){ runLog.endDate = date; }

    /*onTaskStatusChange(runLog, taskStatusTypeId){
        const {id, name} = this.lookupService.masterType.taskStatus.find(r => r.id == taskStatusTypeId);
        runLog.taskStatusTypeId = id;
        runLog.taskStatusTypeName = name;
    }*/

    // saveLogDetails(runLog, p){
    //     const success = (resp)=> {
    //         this.submitted = false;
    //         p.close();
    //
    //     };
    //     const error = (resp)=> {
    //         this.submitted = false;
    //     };
    //     this.submitted = true;
    //
    //     const { id } = runLog;
    //     if(id){
    //         this.taskService.logRunStatusChange(id, runLog).subscribe(success, error);
    //     }
    // }
    showTaskStatusChangePopup(schedule){
        const popupHeaderOption = {text: `Activity for ${schedule.name}`, desc: `Activity`};
        const inputData: any = {
            schedule: schedule
        };
        this.apiResolver.showTaskStatusChangePopup(inputData, popupHeaderOption);
    }
}

@Component({
  standalone: false,
    template: `<div>
        <ul class="nav nav-xs no-border">
            <li class="nav-item">
                <div>{{context.lastRunLog?.dueDate | dateFormat}}</div>
            </li>
            <li class="nav-item px-1">
                <span class="badge lime">{{ context.lastRunLog?.taskStatusTypeName ?? '--' }}</span>
            </li>
            <li class="nav-item px-1" *ngIf="context.lastRunLog">
                <a class="btn btn-xs text-theme text-xs" (click)="showTaskStatusChangePopup(context.lastRunLog)">edit</a>
                <!--<task-status-change [schedule]="context.lastRunLog">edit</task-status-change>-->
            </li>
        </ul>
        <div class="item-except text-xs">
            <ul class="nav nav-xs no-border">
                <li class="nav-item">
                    <small class="text-muted">{{context.lastRunLog?.startDate | dateFormat}}</small>
                </li>
                <li class="nav-item px-1"> - </li>
                <li class="nav-item">
                    <small class="text-muted">{{context.lastRunLog?.endDate | dateFormat}}</small>
                </li>
            </ul>
            {{ context.lastRunLog.verifiedByEmployee }}
        </div>
    </div>`
})
export class TaskLastRunLogCell extends DynamicComponent {
    constructor(public taskService: MyTaskService, public apiResolver: MyTaskAPIResolver) {
        super();
    }
    showTaskStatusChangePopup(schedule){
        const popupHeaderOption = {text: `Activity for ${schedule.name}`, desc: `Activity`};
        const inputData: any = {
            schedule: schedule
        };
        this.apiResolver.showTaskStatusChangePopup(inputData, popupHeaderOption);
    }
}

@Component({
  standalone: false,
    template: `<div>
        <ul class="nav nav-xs no-border">
            <li class="nav-item">
                <div>{{context.nextRunLog.dueDate | dateFormat}}</div>
            </li>
            <li class="nav-item px-1">
                <span class="badge blue-grey">{{ context.nextRunLog.taskStatusTypeName ?? '--' }}</span>
            </li>
            <li class="nav-item px-1">
                <a class="btn btn-xs text-theme text-xs" (click)="showTaskStatusChangePopup(context.nextRunLog)">edit</a>
                <!--<task-status-change [schedule]="context.nextRunLog">edit</task-status-change>-->
            </li>
        </ul>
        <div class="item-except text-xs">
            {{ context.nextRunLog.verifiedByEmployee }}
        </div>
    </div>`
})
export class TaskNextScheduleRunCell extends DynamicComponent {
    submitted: boolean;
    constructor(public taskService: MyTaskService, public apiResolver: MyTaskAPIResolver) {
        super();
    }
    showTaskStatusChangePopup(schedule){
        const popupHeaderOption = {text: `Activity for ${schedule.name}`, desc: `Activity`};
        const inputData: any = {
            schedule: schedule
        };
        this.apiResolver.showTaskStatusChangePopup(inputData, popupHeaderOption);
    }
}
