import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import { NotificationLookup, NotificationLookupSerializer } from "../domains/lookup.serializer";
import { ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgResourceService } from "@app-global";
import {NotificationService} from "./notification.service";
import {NotificationTypeCEComponent} from "../components/notification-type-ce.component";
import {NotificationMediaTypeTemplate, OrgNotification} from "../domains/notification.serializer";
import {NotificationTemplateCeComponent} from "../components/notification-template-ce.component";

export enum NotificationEvent {
    ON_SCHEDULER = 'on_scheduler',
    ON_EVENT = 'on_event',
}

@Injectable()
export class OrgNotificationAPIResolver extends OrgResourceService<NotificationLookup> implements Resolve<any> {
    masterType: NotificationLookup;
    public showBellPopup: { (): void } | undefined;
    public createSupportTicket: { (): void } | undefined;
    public showSurveyPopup: { (): void } | undefined;
    constructor(public override injector: Injector,
                public service: NotificationService, private sharedService: SharedService) {
        super(injector, 'notificationLookup', new NotificationLookupSerializer());
    }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {

            this.masterType = results['data'];
        };
        const failure = (err: any) => {};

        const setup = this.read(this.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }

    notificationCreatePopup(cb) {
        const inputData: any = {
            id: null,
            isEventBased: false,
            data: {}
        };
        const popup = { header: {text: `New Notification`, desc: ''}, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };

        const success = (resp: any) => {
            this.sharedService.destroy();
            cb();
        };
        const failure = (e) => { this.sharedService.destroy(); };
        let modal$ = this.sharedService.showCustomPopup(NotificationTypeCEComponent, popup, inputData);
        modal$.then(success, failure);
    }

    notificationUpdatePopup(row: OrgNotification, cb) {
        const inputData: any = {
            id: row.id,
            isEventBased: row.isEventBased,
            data: row
        };
        const popup = { header: { text: `${row.name}`, desc: 'Update Notification' }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };

        const success = (resp: any) => {
            this.sharedService.destroy();
            cb();
        };
        const failure = (e) => { this.sharedService.destroy(); };
        let modal$ = this.sharedService.showCustomPopup(NotificationTypeCEComponent, popup, inputData);
        modal$.then(success, failure);
    }

    notificationTemplateCreateEdit(notificationId: any, mediaMasterType: string, name: string, cb) {
        const inputData: any = {
            id: notificationId,
            data: {
                mediaMasterType: mediaMasterType,
                notificationId: notificationId
            }
        };
        const popupOptions = {
            header: { text: `${name}`, desc: `${name}` },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        const success = (resp: any) => { this.sharedService.destroy(); cb(); };
        const failure = (e) => { this.sharedService.destroy(); };
        let modal$ = this.sharedService.showCustomPopup(NotificationTemplateCeComponent, popupOptions, inputData);
        modal$.then(success, failure);
    }

    showEventTaskPopup(inputData, popupHeaderOption) {
        // const success = (resp: any) => { this.pluginFactory.destroy(); };
        // const failure = (err)=> { this.pluginFactory.destroy(); };
        //this.pluginFactory.showEventTaskPopup(inputData, popupHeaderOption).then(success, failure);
    }

    // showSchedulerPopup(inputData, popupHeaderOption, cb){
    //     const success = (resp: any) => { this.pluginFactory.destroy(); cb(resp); };
    //     const failure = (err)=> { this.pluginFactory.destroy(); };
    //     this.pluginFactory.showSchedulerPopup(inputData, popupHeaderOption).then(success, failure);
    // }
    showSchedulerPopup(row: OrgNotification, cb){
        // const { id, schedulerConfig } = row;
        // const { orgTaskId, orgTaskScheduleId, isManual } = schedulerConfig;
        //
        // const inputData: any = {
        //     id: orgTaskScheduleId, //Schedular ID
        //     //taskId: this.otherData.sendNotificationTask.id, //send Notification Task Id,
        //     taskId: orgTaskId, //send Notification Task Id,
        //     isManual: isManual,
        //     addManually: true, //Service will not add it automatically
        // };
        // const popupHeaderOption = { text: `New  Scheduler`, desc: `Schedule a tasks - ${ACTION_ENUM.ADD} Scheduler` };
        // const schedulerSuccess = (resp: any) => {
        //     this.schedulerFactory.destroy();
        //     cb(resp?.data?.orgTaskScheduleId);
        // };
        //
        // const failure = (err)=> { this.schedulerFactory.destroy(); };
        // const success = (resp: any)=> {
        //     if(inputData.addManually && !resp.id){
        //         this.service.createNotificationScheduler(resp, id).toPromise().then(schedulerSuccess, failure);
        //     } else {
        //         schedulerSuccess(resp);
        //     }
        // };
        // this.schedulerFactory.showSchedulerPopup(inputData, popupHeaderOption).then(success, failure);
    }

    showOrgCalendarPopup(inputData, popupHeaderOption){
        // const success = (resp: any) => { this.pluginFactory.destroy(); };
        // const failure = (err)=> { this.pluginFactory.destroy(); };
        // this.pluginFactory.showOrgCalendarPopup(inputData, popupHeaderOption).then(success, failure);
    }

    showOrgTaskReminderCEPopup(inputData, popupHeaderOption, cb){
        // const success = (resp: any) => { cb(); this.pluginFactory.destroy(); };
        // const failure = (err)=> { this.pluginFactory.destroy(); };
        // this.pluginFactory.showOrgTaskReminderCEPopup(inputData, popupHeaderOption).then(success, failure);
    }

    showEventTaskActivityPopup(inputData, popupHeaderOption){
        // const success = (resp: any) => { this.pluginFactory.destroy(); };
        // const failure = (err)=> { this.pluginFactory.destroy(); };
        // this.pluginFactory.showEventTaskActivityPopup(inputData, popupHeaderOption).then(success, failure);
    }

    showEventTaskSchedulerPopup(inputData, popupHeaderOption){
        // const success = (resp: any) => { this.pluginFactory.destroy(); };
        // const failure = (resp: any) => { this.pluginFactory.destroy();  };
        // this.pluginFactory.showEventTaskSchedulerPopup(inputData, popupHeaderOption).then(success, failure);
    }
}

@Injectable()
export class NotificationByIdResolver implements Resolve<any> {
    constructor(public service: NotificationService) {}

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {};
        const failure = (err: any) => {};
        const setup = this.service.read(route.params.id);
        return this.performRouteResolver(route.data, setup, success, failure);
    }
}
