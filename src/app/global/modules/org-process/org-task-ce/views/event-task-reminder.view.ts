import {Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from "@angular/core";
import {Subscription} from "rxjs";
import {CoreEndpointBase, CoreQueryOptions} from "../../../../core-setup";
import {ACTION_ENUM} from "../../../../global";

class OrgTaskReminderQueryOptions extends CoreQueryOptions {
    orgTaskId: any;
    orgUserId: string;

    constructor(model: any = {}){
        super(model);
    }

    toQueryString (){
        const obj = {
            orgTaskId: this.orgTaskId,
            orgUserId: this.orgUserId
        };
        return super.getParamByObject(obj);
    }
}

class OrgTaskReminderTemplate {
    id: number;
    notificationId: number;
    mediaTypeId: number;
    orgTaskScheduleId: number;
    isTaskReminder: boolean;
    mediaType: string;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.notificationId = model.notificationId;
        this.mediaTypeId = model.mediaTypeId;
        this.orgTaskScheduleId = model.orgTaskScheduleId;
        this.isTaskReminder = model.isTaskReminder;
        this.mediaType = model.mediaType;
    }
}

class OrgTaskReminder {
    id: number;
    orgTaskId: number;
    userGroupId: number;
    notificationId: number;
    frequencyType: number;
    reminderValue: string;
    name: string;
    templates: Array<OrgTaskReminderTemplate>;

    constructor(model: any = <any>{}) {
        const { id, name, orgTaskId, userGroupId, notificationId, frequencyType, reminderValue, templates} = model;
        this.id = id;
        this.name = name;
        this.orgTaskId = orgTaskId;
        this.userGroupId = userGroupId;
        this.notificationId = notificationId;
        this.frequencyType = frequencyType;
        this.reminderValue = reminderValue;
        this.templates = (templates || []).map((r) => new OrgTaskReminderTemplate(r));
    }
}

@Component({
    selector: 'event-task-reminder',
    templateUrl: './templates/event-task-reminder.html',
    styles: [`:host{ display: contents; }`]
})
export class EventTaskReminderView extends CoreEndpointBase implements OnInit, OnDestroy {
    @ViewChild('reminderEl', { static: true }) public reminderEl;
    @ViewChild('cgrEl', { static: true }) public cgrEl;
    @Input() orgTaskId: number;
    @Input() set data(item: any) {}
    subscriber: Subscription;
    actionType: string;
    coreState: OrgTaskReminderQueryOptions = new OrgTaskReminderQueryOptions();
    reminders: Array<OrgTaskReminder>;
    constructor(public injector: Injector){ super(injector); }

    createNew(){
        this.actionType = ACTION_ENUM.ADD;
        this.reminderEl.resetFormData({ orgTaskId: this.orgTaskId });
    }

    reminderClick(row: OrgTaskReminder){
        this.actionType = ACTION_ENUM.UPDATE;
        this.reminderEl.resetFormData(row);
    }

    updateReminders(state)
    {
        const success = (r)=> {
            this.reminders = r.entities;
            //this.cgrEl?.populateFormRecipients(item.getRecipients());
        };
        const error = (r)=> {};
        this.subscriber = this.getReminderList(state).subscribe(success, error);
    }

    getReminderList(coreState){
        return this.httpClient.get(`${this.baseSectorAPIUrl}orgReminder?${coreState.toQueryString()}`, this.requestHeaders);
    }

    ngOnInit()
    {
        if(this.orgTaskId)
        {
            this.coreState.orgTaskId = this.orgTaskId;
            this.updateReminders(this.coreState);
        }
    }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }
}