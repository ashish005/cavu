import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve} from "@angular/router";
import { NotificationLookup, NotificationLookupSerializer } from "../domains/lookup.serializer";
import {NotificationTypeCEComponent} from "../components/notification-type-ce.component";
import {ACTION_ENUM, ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgResourceService} from "@app-global";
import {NotificationService} from "./notification.service";
import {TemplateCeView} from "../components/template-ce-view";
// import {NotificationReminderView} from "../components/notification-reminder-view";

export enum NotificationEvent {
    ON_SCHEDULER = 'on_scheduler',
    ON_EVENT = 'on_event',
}

@Injectable()
export class NotificationAPIResolver extends OrgResourceService<NotificationLookup> implements Resolve<any> {
    masterType: NotificationLookup;
    //coreLookup: OrgLookup;
    constructor(public override injector: Injector, public service: NotificationService,
                private sharedService: SharedService) {
        super(injector, 'notificationLookup', new NotificationLookupSerializer());
        //this.coreLookup = this.coreService.orgLookup;
    }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {

            this.masterType = results['data'];
        };
        const failure = (err: any) => {};

        const setup = this.read(this.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }

    showEventTaskPopup(inputData, popupHeaderOption, cb) {
        //this.processFactory.showEventTaskPopup(inputData, popupHeaderOption, cb);
    }

    // showSchedulerPopup(inputData, popupHeaderOption, cb){
    //     const success = (resp: any) => { this.pluginFactory.destroy(); cb(resp); };
    //     const failure = (err)=> { this.pluginFactory.destroy(); };
    //     this.pluginFactory.showSchedulerPopup(inputData, popupHeaderOption).then(success, failure);
    // }
    showSchedulerPopup(notificationId, inputData, popupHeaderOption, cb){
        /*const schedulerSuccess = (resp: any) => {
            this.schedulerFactory.destroy();
            cb(resp?.data?.orgTaskScheduleId);
        };

        const failure = (err)=> { this.schedulerFactory.destroy(); };
        const success = (resp: any)=> {

            if(inputData.addManually && !resp.id){
                this.service.createNotificationScheduler(resp, notificationId).toPromise().then(schedulerSuccess, failure);
            } else {
                schedulerSuccess(resp);
            }
        };
        this.schedulerFactory.showSchedulerPopup(inputData, popupHeaderOption).then(success, failure);*/
    }

    showOrgCalendarPopup(inputData, popupHeaderOption){
        /*const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (err)=> { this.pluginFactory.destroy(); };
        this.pluginFactory.showOrgCalendarPopup(inputData, popupHeaderOption).then(success, failure);*/
    }

    showOrgTaskReminderCEPopup(inputData, popupHeaderOption, cb){
        inputData = inputData || {
            id: null,
            userMasterType: null,
            //lookupMasterType: 'expense', //tells what all lookup values are required
            data: { }
        };
        const popupOptions = {
            header: popupHeaderOption,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };

        const success = (resp: any) => { this.sharedService.destroy(); cb(); };
        const failure = (err)=> { this.sharedService.destroy(); };

        // this.sharedService.showCustomPopup(NotificationReminderView, popupOptions, inputData).then(success, failure);
    }

    showEventTaskActivityPopup(inputData, popupHeaderOption){
        /*const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (err)=> { this.pluginFactory.destroy(); };
        this.pluginFactory.showEventTaskActivityPopup(inputData, popupHeaderOption).then(success, failure);*/
    }

    showEventTaskSchedulerPopup(inputData, popupHeaderOption){
        /*const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (resp: any) => { this.pluginFactory.destroy();  };
        this.pluginFactory.showEventTaskSchedulerPopup(inputData, popupHeaderOption).then(success, failure);*/
    }

    notificationCreateEditPopup(inputData: any, popupHeader, cb) {
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any) => {
            this.sharedService.destroy();
            cb();
        };
        const failure = (e) => {
            this.sharedService.destroy();
        };
        let modal$ = this.sharedService.showCustomPopup(NotificationTypeCEComponent, popup, inputData);
        modal$.then(success, failure);
    }

    notificationTemplateCreateEdit(data: any, popupHeaderOption: any){
        const popupOptions = {
            header: popupHeaderOption || { text: `${data.name}`, desc: `${data.name}` },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };
        data = data || {
            id: null, //template id,
            notificationId: null, //notification.id,
            notificationTypeId: null, //notification.notificationTypeId,
            mediaTypeId: null, //mediaType.id,
            actionType: ACTION_ENUM.SHOW
        };
        const success = (resp: any) => {
            this.sharedService.destroy();
        };
        const failure = (e) => {
            this.sharedService.destroy();
        };
        let modal$ = this.sharedService.showCustomPopup(TemplateCeView, popupOptions, data);
        modal$.then(success, failure);
    }
}
