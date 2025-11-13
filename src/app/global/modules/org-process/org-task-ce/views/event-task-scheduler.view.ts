import {Component, Injector, Input, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Subscription} from "rxjs";
import {CoreEndpointBase, CoreQueryOptions} from "../../../../core-setup";

class OrgTaskSchedulerQueryOptions extends CoreQueryOptions {
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

class OrgTaskCommunicationTemplate {
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
class OrgScheduledNotification {
    name: string;
    templates: Array<OrgTaskCommunicationTemplate>;
    userType: string;

    constructor(model: any = <any>{}) {
        const { name, userType, templates } = model;
        this.name = name;
        this.userType = userType;
        //this.templates = (templates || []).map(r => new OrgTaskCommunicationTemplate(r));
    }
}
class OrgTaskScheduler {
    id: any;
    name: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    frequencyTypeId: number;
    orgTaskId: number;

    description: string;
    frequencyType: string;
    frequencyMasterType: string;
    isValidForSession: boolean;
    notification: OrgScheduledNotification;

    status: boolean;
    constructor(model: any = <any>{}) {
        const { id, orgTaskId, name, description, startDate, startTime, endDate, endTime, frequencyTypeId, frequencyType, frequencyMasterType, isFeeType, isPeriodType, isValidForSession, notification, status }=  model;
        this.id = id;
        this.startDate = startDate;
        this.startTime = startTime || '09:00';
        this.endDate = endDate;
        this.endTime = endTime || '19:00';
        this.frequencyTypeId = frequencyTypeId;
        this.orgTaskId = orgTaskId;
        this.status = status;

        this.name = name;
        this.description = description;

        this.frequencyType = frequencyType;
        this.frequencyMasterType = frequencyMasterType;
        this.isValidForSession = isValidForSession || true;
        this.notification = (notification)? new OrgScheduledNotification(notification): null;
    }
}

@Component({
    selector: 'event-task-scheduler',
    templateUrl: './templates/event-task-scheduler.html',
    styles: [`:host{ display: contents; }`]
})
export class EventTaskSchedulerView extends CoreEndpointBase implements OnInit, OnDestroy {
    @Input() orgTaskId: number;
    @ViewChild('schedulerEl', { static: true }) public schedulerEl;

    subscriber: Subscription;
    actionType: string;
    coreState: OrgTaskSchedulerQueryOptions = new OrgTaskSchedulerQueryOptions();
    schedulers: Array<OrgTaskScheduler>;
    taskSchedule: OrgTaskScheduler;
    constructor(public injector: Injector){ super(injector); }

    createNew()
    {
        this.taskSchedule = null;
        this.schedulerEl.id = null;
        this.schedulerEl.resetFormData({ orgTaskId: this.orgTaskId });
    }

    scheduleClick(row: OrgTaskScheduler){
        this.taskSchedule = row;
        this.schedulerEl.id = row.id;
        this.schedulerEl.refreshScheduler(row.id);
    }

    updateSchedulers(coreState)
    {
        const success = (r)=> {
            this.schedulers = r.entities;
        };
        const error = (r)=> {};
        this.subscriber = this.getSchedulerList(coreState).subscribe(success, error);
    }

    getSchedulerList(coreState){
        return this.httpClient.get(`${this.baseSectorAPIUrl}taskSchedule?${coreState.toQueryString()}`, this.requestHeaders);
    }

    ngOnInit()
    {
        if(this.orgTaskId)
        {
            this.coreState.orgTaskId = this.orgTaskId;
            this.updateSchedulers(this.coreState);
        }
    }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }

    onOkAction(data){
        this.updateSchedulers(this.coreState);
    }

    onCancelAction(data){
        this.createNew();
    }
}