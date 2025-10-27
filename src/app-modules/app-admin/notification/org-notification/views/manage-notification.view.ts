import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewExtender, ACTION_ENUM} from "@app-global";
import {
    NotificationMediaTypeTemplate,
    OrgNotification,
    OrgNotificationQueryOptions,
    OrgReminder
} from "../domains/notification.serializer";
import {NotificationService} from "../services/notification.service";
import {NotificationAPIResolver} from "../services/api.resolver";
import {NotificationTypeLookup} from "../domains/lookup.serializer";

export class NotificationExtension extends ViewExtender<OrgNotification> {
    userMasterType: string;
    activeNotificationType: NotificationTypeLookup;
    override coreState: OrgNotificationQueryOptions = new OrgNotificationQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
                public override service: NotificationService,
                public lookupResolver: NotificationAPIResolver){
        super(activatedRoute, service);
        this.userMasterType = activatedRoute.snapshot.parent.data.userType;
        (<OrgNotificationQueryOptions>this.coreState).userMasterType = this.userMasterType;
        if (this.userMasterType) {
            this.activeNotificationType = this.lookupResolver.masterType.getNotificationTypeByUserType(this.userMasterType);
        }
    }

    refreshGridOnSuccess=()=>{
        super.populateGrid();
    };

    createNotification() {
        const { notificationTypes } = this.lookupResolver.masterType;
        const notificationType = (notificationTypes || []).find(r => r.masterType == this.userMasterType);
        const data = new OrgNotification({
            name: '',
            notificationTypeId: notificationType?.id
        });
        const inputData: any = {
            id: null,
            isEventBased: false,
            data: data
        };
        this.lookupResolver.notificationCreateEditPopup(inputData, {text: `New Notification`, desc: ''}, this.refreshGridOnSuccess);
    }

    updateNotification(row: OrgNotification){
        this.gridRow = row;
        const inputData: any = {
            id: row.id,
            isEventBased: row.isEventBased,
            data: row,
            lookupEvents: this.lookupResolver.masterType.findMatchingMaster(row.appEvent)?.orgEvents
        };
        this.lookupResolver.notificationCreateEditPopup(inputData, {text: `${row.name}`, desc: 'Update Notification'}, this.refreshGridOnSuccess);
    }

    showScheduler(row: OrgNotification){
        const { id, orgTaskScheduleId, orgTaskId } = row;

        const inputData: any = {
            id: orgTaskScheduleId, //Schedular ID
            //taskId: this.otherData.sendNotificationTask.id, //send Notification Task Id,
            taskId: orgTaskId, //send Notification Task Id,
            addManually: true, //Service will not add it automatically
        };
        const popupHeaderOption = { text: `New  Scheduler`, desc: `Schedule a tasks - ${ACTION_ENUM.ADD} Scheduler` };
        this.lookupResolver.showSchedulerPopup(id, inputData, popupHeaderOption, (orgTaskScheduleId)=>{
            row.orgTaskScheduleId = orgTaskScheduleId;
        });
    }

    showTemplateToCreateEdit(notiMediaType: NotificationMediaTypeTemplate) {
        const {
            id, name, masterType, sortOrder, mediaTypeId,
            templateId, header, templateCode, content, orgTaskScheduleId,
            isDefaultFooter,gatewayId, isTaskReminder, notificationId
        } = notiMediaType;
        const popupHeaderOptions = { text: `${name}`, desc: `${name}` };
        const inputData: any = {
            id: templateId,
            data: {
                templateId: templateId,
                mediaTypeId: mediaTypeId,
                mediaMasterType: masterType,
                header: header,
                templateCode: templateCode,
                content: content,

                orgTaskScheduleId: orgTaskScheduleId,
                isDefaultFooter: isDefaultFooter,
                gatewayId: gatewayId,
                isTaskReminder: isTaskReminder,
                notificationId: notificationId
            }
        };
        this.lookupResolver.notificationTemplateCreateEdit(inputData, popupHeaderOptions);
    }

    checkActivity(data: OrgNotification) {
        const { orgTaskId, orgTaskScheduleId, name } = data;
        const popupHeaderOption = { text: `Activity for ${name}`, desc: `Activity` };
        const inputData: any = {
            orgTaskId: orgTaskId,
            scheduleId: orgTaskScheduleId
        };
        this.lookupResolver.showEventTaskActivityPopup(inputData, popupHeaderOption);
    }

    createNotificationReminder(row: OrgNotification) {
        const { id, orgTaskScheduleId, name, reminders } = row;

        const headerOption = { text: `Reminder for ${name}`, desc: `Reminder will be send to user prior to scheduled time` };
        const data = {
            id: null,
            userMasterType: this.userMasterType,
            data: new OrgReminder({
                orgTaskScheduleId: orgTaskScheduleId,
                notificationId: id
            })
        };
        this.lookupResolver.showOrgTaskReminderCEPopup(data, headerOption, this.refreshGridOnSuccess);
    }

    editNotificationReminder(row: OrgReminder) {
        const { id } = row;

        const headerOption = { text: `Reminder for ${name}`, desc: `Reminder will be send to user prior to scheduled time` };
        const data = {
            id: id,
            userMasterType: this.userMasterType,
            data: row
        };
        this.lookupResolver.showOrgTaskReminderCEPopup(data, headerOption, this.refreshGridOnSuccess);
    }
}

@Component({ templateUrl: './templates/manage-notification.html' })
export class ManageNotificationView extends NotificationExtension implements OnInit, OnDestroy {
    constructor(public activatedRoute: ActivatedRoute,
                public service: NotificationService,
                public lookupResolver: NotificationAPIResolver){
        super(activatedRoute, service, lookupResolver);
    }

    ngOnInit(){
        super.populateGrid();
    }
    ngOnDestroy(){ super.ngOnDestroy(); }

    notificationByUserType(row: NotificationTypeLookup){
        this.activeNotificationType = row;
        (<any>this.coreState).notificationTypeId = row.id;
        super.populateGrid();
    }
}

@Component({ templateUrl: './templates/manage-grid-notification.html' })
export class ManageGridNotificationView extends NotificationExtension implements OnInit, OnDestroy {
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: NotificationService,
                public override lookupResolver: NotificationAPIResolver){
        super(activatedRoute, service, lookupResolver);
    }

    ngOnInit(){
        super.populateGrid();
    }
    ngOnDestroy(){ super.ngOnDestroy(); }

    notificationByUserType(row: NotificationTypeLookup){
        this.activeNotificationType = row;
        (<any>this.coreState).notificationTypeId = row.id;
        super.populateGrid();
    }

    applyVoucherTypeToNotification(row: OrgNotification, voucherType: any)
    {
        const success = (resp: any) => {
            const { id, name } = voucherType;
            row.voucherTypeId = id;
            row.voucherTypeName = name;
        };
        const failure = (e) => {};
        this.service.applyInvoiceTypeToNotification(row.id, voucherType.id).toPromise().then(success, failure);
    }

    /*
    showMediaTypeWiseScheduler(row: AppNotification, mediaType: NotificationMediaType){
        const popup = {
            header: { text: `New  Scheduler`, desc: `Schedule a tasks - ${ACTION_ENUM.ADD} Scheduler` },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        const orgTaskScheduleId = mediaType.orgTaskScheduleId || row.orgTaskScheduleId;
        //orgTaskScheduleId
        const inputData: any = {
            id: orgTaskScheduleId, //Schedular ID
            //taskId: this.otherData.sendNotificationTask.id, //send Notification Task Id,
            taskId: row.orgTaskId, //send Notification Task Id,
            addManually: true, //Service will not add it automatically
            actionType: (orgTaskScheduleId)? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD
        };

        const schedulerSuccess = (resp: any) => {
            this.apiResolver.synchGrid.next(true);
            this.popupService.destroy();
        };

        const success = (resp: any) => {
            if(inputData.addManually && inputData.actionType == ACTION_ENUM.ADD){
                this.templateService.createTemplateScheduler(resp, mediaType.communicationTemplateId).toPromise().then(schedulerSuccess, error);
            } else {
                schedulerSuccess(resp);
            }
        };

        const error = (resp: any) => {
            this.popupService.destroy();
        };

        /!*let modal$ = this.popupService.showCustomPopup(SchedulerInfoComponent, popup, inputData);
        modal$.then(success, error);*!/
    }*/
    actionRemoveCb(e){}
}
