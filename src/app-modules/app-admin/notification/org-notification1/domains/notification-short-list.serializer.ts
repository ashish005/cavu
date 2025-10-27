import {CoreQueryOptions, CoreResource} from "@app-global";
export class OrgMediaTypeTemplate {
    id: number | string;//templateId
    name: string;
    masterType: string;
    sortOrder: number;

    templateId: number;
    mediaTypeId: number;

    orgTaskScheduleId: number;
    gatewayId: number;
    notificationId: number;

    isTaskReminder: boolean;
    hasTemplate: boolean;
    status: boolean;

    constructor(model: any = <any>{}){
        const {
            id, name, masterType, sortOrder,
            mediaTypeId, templateId, templateCode, header, content,
            isDefaultFooter, gatewayId, isTaskReminder, notificationId, orgTaskScheduleId,
            status, hasTemplate
        } = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
        this.sortOrder = sortOrder;

        this.mediaTypeId = mediaTypeId;
        this.templateId = templateId;
        this.gatewayId = gatewayId;
        this.isTaskReminder = isTaskReminder;
        this.notificationId = notificationId;
        this.orgTaskScheduleId = orgTaskScheduleId;
        this.hasTemplate = hasTemplate;
        this.status = status;
    }
}

export class OrgNotificationShortListQueryOptions extends CoreQueryOptions {
  notificationTypeId: number | string;
  userMasterType: number | string;

  constructor(model: any = {}){
    super(model);
  }

  toQueryString (){
    const obj = {
      notificationTypeId:this.notificationTypeId,
      userMasterType: this.userMasterType
    };
    return super.getParamByObject(obj);
  }
}

export class OrgNotificationShortList {
    id: number | string;
    name: string;
    appEvent: string;

    isSystem: boolean;
    isEventBased: boolean;
    isForVoucher: boolean;
    isReminder: boolean;

    notificationTypeId: number;
    userTypeId: number;
    orgTaskId: number;
    orgTaskScheduleId: number;

    voucherTypeId: number;

    voucherTypeName: string;
    notificationTypeName: string;
    //permissions: Array<NotificationPermission>;
    templates: Array<OrgMediaTypeTemplate>;
    //reminders: Array<OrgReminder>;
    //nextRun: NextScheduledRun;

    hasTemplate: boolean;
    hasReminder: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, notificationTypeId, userTypeId, orgTaskId,
            appEvent, isEventBased, isForVoucher, isReminder, isSystem,

            notificationTypeName, orgTaskScheduleId,
            voucherTypeId, voucherTypeName,
            permissions, templates, reminders, nextRun
        } = model;
        this.id = id;
        this.name = name;
        this.notificationTypeId = notificationTypeId;
        this.orgTaskScheduleId = orgTaskScheduleId;
        this.userTypeId = userTypeId;
        this.orgTaskId = orgTaskId;
        this.appEvent = appEvent;

        this.isEventBased = isEventBased;
        this.isForVoucher = isForVoucher;
        this.isSystem = isSystem;
        this.isReminder = isReminder;

        this.voucherTypeId = voucherTypeId;
        this.voucherTypeName = voucherTypeName;

        this.notificationTypeName = notificationTypeName;
        this.templates = (templates || []).map(r => new OrgMediaTypeTemplate(r));
        this.orgTaskScheduleId = orgTaskScheduleId;
        //this.nextRun = nextRun ? new NextScheduledRun(nextRun): null;

        this.hasTemplate = this.templates.some(r => r.hasTemplate);
        this.hasReminder = (this.orgTaskScheduleId && this.templates.some(r => r.isTaskReminder)) ? true: false;
    }
}

export class OrgNotificationShortListSerializer{
  fromJson(json: any): OrgNotificationShortList { return new OrgNotificationShortList(json); }

  toJson(data: any = <any>{}) {
    const {id, name, isSystem, appEvent, notificationTypeId, permissions, userTypeId, templates} = data;
    return {
      id: id,
      name: name,
      isSystem: isSystem,
      appEvent: appEvent,
      notificationTypeId: notificationTypeId,
      permissions: permissions,
      userTypeId: userTypeId,
      templates: templates
    };
  }
}
