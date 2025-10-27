/*
import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ACTION_ENUM, DynamicComponent} from "@app-core";
import {Scheduler} from "../domains/scheduler.serializer";
import {PipelineAPIResolver} from "../resolver/api.resolver";

@Component({
    template: `<div>
        <a class="text-xs _500"> {{ context.name }} </a>
        <div class="item-except text-xs h-1x">
            <span class="badge lime">{{ context.orgProcessName }}</span>
            <span *ngIf="context.project" class="b-a mx-2">
                <small class="pr-1"> {{ context.projectProcessName }} </small> 
            </span>
        </div>
    </div>`
})
export class ScheduleLogNameActionCell extends DynamicComponent {
    constructor(private router: Router, public lookupResolver: PipelineAPIResolver) {
        super();
    }

    showDetails(row: Scheduler) {
        //this.router.navigate([row.accountId], {relativeTo: this.activatedRoute.parent.parent});
    }

    addTaskScheduler(task) {
        const {id, isManual, isFeeTask, isPeriodType, name} = task;
        const popupHeaderOption = {text: `${name}`, desc: `Schedule a tasks - ${ACTION_ENUM.UPDATE} Scheduler`};
        const inputData: any = {
            id: null, //Schedular ID
            orgTaskId: id,//Org Task Id
            isManual: isManual,
            isFeeTask: isFeeTask,
            isPeriodType: isPeriodType
        };
        this.lookupResolver.showSchedulerPopup(inputData, popupHeaderOption);
    }

    /!*createReminder(task: OrgMyTask){
        const { id,orgReminders } = task;

        const popupHeaderOption = { text: `Reminder for ${task.name}`, desc: `Reminder will be send to user prior to scheduled time` };
        const inputData: any = {
            notificationId: null,
            taskId: id,
            list: orgReminders,
            activeView: 'reminder'
        };
        this.apiResolver.showNotificationReminder(inputData, popupHeaderOption);
    }*!/
}*/
