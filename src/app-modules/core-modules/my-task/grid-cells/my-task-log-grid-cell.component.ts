import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DynamicComponent, ACTION_ENUM} from "@app-global";
import {MyTaskSchedule} from "../domains/my-task/my-task-schedule.serializer";
import {MyTask} from "../domains/my-task.serializer";
import {MyTaskAPIResolver} from "../services/api.resolver";

@Component({
  standalone: false,
    template: `<div>
        <span class="badge red">{{ context.taskPriorityName }}</span>
        <a class="text-xs _500"> {{ context.name }} </a>
        <div class="item-except text-xs h-1x">
            <span class="badge lime">{{ context.orgProcessName }}</span>
            <span *ngIf="context.project" class="b-a mx-2">
                <small class="pr-1"> {{ context.projectProcessName }} </small>
            </span>
        </div>
    </div>`
})
export class MyTaskLogNameActionCell extends DynamicComponent {
    constructor(private router: Router, public activatedRoute: ActivatedRoute,
                public apiResolver: MyTaskAPIResolver) {
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
        <ul class="nav nav-xs no-border">
            <li class="nav-item">
                <div>{{context.dueDate | dateFormat}}</div>
            </li>
            <li class="nav-item px-1">
                <span class="badge lime">{{ context.taskStatusTypeName ?? '--' }}</span>
            </li>
            <li class="nav-item px-1">
                <a class="btn btn-xs text-theme text-xs" (click)="showTaskStatusChangePopup(context)">edit</a>
                <!--<task-status-change [schedule]="context">edit</task-status-change>-->
            </li>
        </ul>
        <div class="item-except text-xs">
            <!--<ul class="nav nav-xs no-border">
                <li class="nav-item">
                    <small class="text-muted">{{context.lastRunLog.startDate | dateFormat}}</small>
                </li>
                <li class="nav-item px-1"> - </li>
                <li class="nav-item">
                    <small class="text-muted">{{context.lastRunLog.endDate | dateFormat}}</small>
                </li>
            </ul>-->
            {{ context.verifiedByEmployee }}
        </div>
    </div>`
})
export class MyTaskLogRunCell extends DynamicComponent {
    constructor(public apiResolver: MyTaskAPIResolver) {
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
