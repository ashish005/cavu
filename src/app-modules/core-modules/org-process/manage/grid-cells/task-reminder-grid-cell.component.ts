import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DynamicComponent} from "@app-global";
import {PipelineAPIResolver} from "../resolver/api.resolver";
import {ReminderTemplate, TaskReminder} from "../domains/task-reminder.serializer";

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500">{{ context.orgTaskName }} {{ context.name }} </a>
        <div class="item-except text-xs h-1x">
            <a class="text-primary text-xs pr-2" (click)="checkActivity(context)">Activities</a>
            <ng-template ngFor let-template [ngForOf]="context.templates | sortBy:'asc': 'sortOrder'" let-i="index">
                <a class="d-inline-block px-1 text-center">
                    <span class="d-block">
                        <a class="btn btn-xs text-xs text-success">{{ template?.mediaTypeName }}
                        </a>
                        <!-- (click)="showTemplateToCreateEdit(template)"-->
                    </span>
                </a>
            </ng-template>
        </div>
    </div>`
})
export class ReminderNameActionCell extends DynamicComponent {
    constructor(public activatedRoute: ActivatedRoute, public lookupResolver: PipelineAPIResolver) {
        super();
    }

    eventTaskCalendar(task: TaskReminder) {
        const { orgTaskId, orgTaskName } = task;
        const inputData: any = {
            id: orgTaskId,
            orgTaskId: orgTaskId
        };
        //this.lookupResolver.showEventTaskPopup(inputData, {text: `${orgTaskName}`, desc: `Manage Task`});
    }

    checkActivity(task:TaskReminder) {
        const { orgTaskId, orgTaskScheduleId, orgTaskName } = task;
        const popupHeaderOption = {text: `Activity for ${orgTaskName}`, desc: `Activity`};
        const inputData: any = {
            orgTaskId: orgTaskId,
            scheduleId: orgTaskScheduleId
        };
        this.lookupResolver.showEventTaskActivityPopup(inputData, popupHeaderOption);
    }

    /*showTemplateToCreateEdit(row: ReminderTemplate) {
        const { id, mediaTypeName, orgTaskScheduleId, notificationId, mediaTypeId, templateCode, header, content,  isTaskReminder, isDefaultFooter } = row;

        const popupHeaderOptions = { text: `${mediaTypeName}`, desc: `${mediaTypeName}` };
        const inputData: any = {
            id: id,
            data: {
                templateId: id,
                mediaTypeId: mediaTypeId,
                //mediaMasterType: masterType,
                header: header,
                templateCode: templateCode,
                content: content,

                orgTaskScheduleId: orgTaskScheduleId || this.context.orgTaskScheduleId,
                isDefaultFooter: isDefaultFooter,
                isTaskReminder: isTaskReminder,
                notificationId: notificationId || this.context.notificationId
            }
        };
        this.lookupResolver.showTemplateToCreateEdit(inputData, popupHeaderOptions);
    }*/
}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500"> {{ context.userGroupName }} </a>
        <div class="item-except text-xs h-1x">
            <a class="text-primary text-xs pr-2">{{context.userGroupCategoryName}}</a>
        </div>
    </div>`
})
export class ReminderGroupActionCell extends DynamicComponent {
    constructor(public activatedRoute: ActivatedRoute, public lookupResolver: PipelineAPIResolver) {
        super();
    }
}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500"> {{ context.notificationName }} </a>
        <div class="item-except text-xs h-1x">
            <a class="text-primary text-xs pr-2">{{context.notificationTypeName}}</a>
        </div>
    </div>`
})
export class ReminderNotificationActionCell extends DynamicComponent {
    constructor(public activatedRoute: ActivatedRoute, public lookupResolver: PipelineAPIResolver) {
        super();
    }
}

@Component({
    standalone: false,
    template: `<div>
        <div class="list inset" *ngIf="context[col.field]">
            <div class="list-item p-0 text-xs">
                <div class="list-body">
                    {{ context[col.field]?.dueDate | dateFormat}}
                    <div class="item-except text-sm h-1x">
                        <a *ngIf="context[col.field]?.taskStatusTypeId" class=" float-right item-title _500"><span class="badge blue-grey">{{context[col.field]?.taskStatusTypeName ?? '--'}}</span></a>
                        <small class="text-muted">{{ context[col.field]?.startDate | dateFormat }} - {{ context[col.field]?.endDate | dateFormat }}</small>
                    </div>
                </div>
            </div>
        </div>
        <span *ngIf="!context[col.field]">--</span>
    </div>`
})
export class TaskReminderScheduleRunCell extends DynamicComponent {
    submitted: boolean;

    constructor() {
        super();
    }
}
