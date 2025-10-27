import {CoreQueryOptions} from "@app-global";
export class NextScheduledRun {
    id: number;
    startDate: string;
    endDate: string;
    dueDate: string;

    isAutoRun: boolean;
    isSuccess: boolean;

    remark: string;
    orgTaskScheduleId: number;
    taskStatusTypeId: number;
    verifiedByEmployeeId: string;

    verificationRemark: string;
    verifiedByEmployeeName: string;
    taskStatusTypeName: string;

    name: string;
    orgTaskTypeName: string;
    frequencyTypeName: string;

    taskPriorityName: string;
    orgProcessName: string;
    projectProcessName: string;
    constructor(model: any = <any>{}) {
        const {
            id,
            startDate, endDate, dueDate, isAutoRun,
            remark, orgTaskScheduleId, taskStatusTypeId, verifiedByEmployeeId,
            verificationRemark, verifiedByEmployeeName, taskStatusTypeName,
            name, orgTaskTypeName, frequencyTypeName,
            taskPriorityName, orgProcessName, projectProcessName
        }=  model;

        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dueDate = dueDate;

        this.isAutoRun = isAutoRun;

        this.remark = remark;
        this.orgTaskScheduleId = orgTaskScheduleId;
        this.taskStatusTypeId = taskStatusTypeId;
        this.verifiedByEmployeeId = verifiedByEmployeeId;

        this.verificationRemark = verificationRemark;
        this.verifiedByEmployeeName = verifiedByEmployeeName;
        this.taskStatusTypeName = taskStatusTypeName;

        this.name = name;
        this.orgTaskTypeName = orgTaskTypeName;
        this.frequencyTypeName = frequencyTypeName;

        this.taskPriorityName = taskPriorityName;
        this.orgProcessName = orgProcessName;
        this.projectProcessName = projectProcessName;
    }
}

export class SchedulerConfig {
    orgTaskId: number;
    orgTaskScheduleId: number;
    frequencyTypeId: number;
    isManual: boolean;
    masterFrequencyType: string;

    constructor(model: any = <any>{}) {
        const { orgTaskId, orgTaskScheduleId, frequencyTypeId, isManual, masterFrequencyType } = model;
        this.orgTaskId = orgTaskId;
        this.orgTaskScheduleId = orgTaskScheduleId;
        this.frequencyTypeId = frequencyTypeId;
        this.isManual = isManual;
        this.masterFrequencyType = masterFrequencyType;
    }
}

export class NotificationPermission {
    id: number | string;
    notificationId: number;
    isEnable: boolean;
    userRoleId: number;
    userRoleName: number | string;
    status: boolean;

    constructor(model: any = <any>{}){
        const {
            id, isEnable, notificationId,
            userRoleId, userRoleName, status
        } = model;
        this.id = id;
        this.notificationId = notificationId;
        this.isEnable = isEnable;
        this.userRoleId = userRoleId;
        this.userRoleName = userRoleName;
        this.status = status;
    }
}
export class NotificationMediaTypeTemplate {
    id: number | string;//templateId
    name: string;
    masterType: string;
    sortOrder: number;

    templateId: number;
    mediaTypeId: number;
    header: string;
    templateCode: string;
    content: string;
    orgTaskScheduleId: number;
    isDefaultFooter: boolean;
    gatewayId: number;
    isTaskReminder: boolean;
    notificationId: number;
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
        this.templateCode = templateCode;
        this.header = header;
        this.content = content;
        this.isDefaultFooter = isDefaultFooter;
        this.gatewayId = gatewayId;
        this.isTaskReminder = isTaskReminder;
        this.notificationId = notificationId;
        this.orgTaskScheduleId = orgTaskScheduleId;
        this.hasTemplate = hasTemplate;
        this.status = status;
    }
}

export class OrgNotificationQueryOptions extends CoreQueryOptions {
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

export class OrgNotification {
    id: number | string;
    name: string;
    appEvent: string;

    isSystem: boolean;
    isEventBased: boolean;
    isForVoucher: boolean;
    isReminder: boolean;

    notificationTypeId: number;
    userTypeId: number;

    schedulerConfig: SchedulerConfig;


    voucherTypeId: number;

    voucherTypeName: string;
    notificationTypeName: string;
    permissions: Array<NotificationPermission>;
    templates: Array<NotificationMediaTypeTemplate>;
    nextRun: NextScheduledRun;

    hasTemplate: boolean;

    constructor(model: any = <any>{}){
        const {
            id, name, notificationTypeId, userTypeId,
            appEvent, isEventBased, isForVoucher, isReminder, isSystem,

            notificationTypeName,
            voucherTypeId, voucherTypeName,
            permissions, templates, schedulerConfig, nextRun
        } = model;
        this.id = id;
        this.name = name;
        this.notificationTypeId = notificationTypeId;
        this.schedulerConfig = new SchedulerConfig(schedulerConfig);
        this.userTypeId = userTypeId;
        this.appEvent = appEvent;

        this.isEventBased = isEventBased;
        this.isForVoucher = isForVoucher;
        this.isSystem = isSystem;
        this.isReminder = isReminder;

        this.voucherTypeId = voucherTypeId;
        this.voucherTypeName = voucherTypeName;

        this.notificationTypeName = notificationTypeName;
        this.permissions = (permissions || []).map(r => new NotificationPermission(r));
        this.templates = (templates || []).map(r => new NotificationMediaTypeTemplate(r));
        this.nextRun = nextRun ? new NextScheduledRun(nextRun): null;
        this.hasTemplate = this.templates.some(r => r.hasTemplate);
    }

    public get hasReminder(){ return this.isReminder && this.hasTemplate; }
}

export class OrgNotificationSerializer{
  fromJson(json: any): OrgNotification { return new OrgNotification(json); }

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
