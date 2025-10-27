import {CoreQueryOptions} from "@app-global";

export class InvoiceNotificationQueryOptions extends CoreQueryOptions{
  userId: string;
  userTypeId: number | string;
  orgUserId: string;

  notificationTypeId: number | string;
  mediaTypeId: number | string;

  accountId: string;
  voucherId: string;
  voucherTypeId: number;

  constructor(model: any = {}){ super(model); }

  override toQueryString (){
    const obj = {
      userId: this.userId,
      userTypeId: this.userTypeId,
      orgUserId: this.orgUserId,

      mediaTypeId:this.mediaTypeId,

      notificationTypeId:this.notificationTypeId,

      accountId: this.accountId,
      voucherId: this.voucherId,
      voucherTypeId: this.voucherTypeId
    };
    return super.getParamByObject(obj);
  }
}

export class NotificationUserType {
  id: number;
  name: string;
  accountGroupId: number;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.accountGroupId = model.accountGroupId;
  }
}

export class InvoiceTemplate {
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

export class OrgReminder {
  id: number;
  orgTaskId: number;
  userGroupId: number;
  notificationId: number;
  frequencyType: string;
  reminderValue: string;
  name: string;
  templates: Array<InvoiceTemplate>;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.orgTaskId = model.orgTaskId;
    this.userGroupId = model.userGroupId;
    this.notificationId = model.notificationId;
    this.frequencyType = model.frequencyType;
    this.reminderValue = model.reminderValue;
    this.name = model.name;
    this.templates = (model.templates || []).map((r) => new InvoiceTemplate(r));
  }
}

export class NotificationPermission {
  id: number | string;
  isEnable: boolean;
  status: boolean;
  userRoleId: number | string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.isEnable = model.isEnable;
    this.status = model.status;
    this.userRoleId = model.userRoleId;
  }
}

export class NotificationMediaType {
  id: number | string;
  name: string;
  masterType: string;
  sortOrder: number;
  orgTaskScheduleId: number;
  templateId: number;
  //appEvent: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.masterType = model.masterType;
    this.sortOrder = model.sortOrder;
    this.orgTaskScheduleId = model.orgTaskScheduleId;
    this.templateId =  model.templateId;
    //this.appEvent = model.appEvent;
  }
}

export class NotificationMediaFileType {
  id: string;
  name: string;
  isExport: boolean;
  isImport: boolean;
  isWebData: boolean;
  sortOrder: boolean;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.isExport = model.isExport;
    this.isImport = model.isImport;
    this.isWebData = model.isWebData;
    this.sortOrder = model.sortOrder;
  }
}

export class NotificationUserRole {
  id: number | string;
  name: string;
  userTypeId: number | string;
  masterType: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.userTypeId = model.userTypeId;
    this.masterType = model.masterType;
  }
}

export class NotificationType {
  id: number | string;
  name: string;
  masterType: string;
  userTypeId: number | string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.masterType = model.masterType;
    this.userTypeId = model.userTypeId;
  }
}

export class InvoiceNotification {
  id: number | string;
  name: string;
  notificationTypeId: number;
  userTypeId: number;
  appEvent: string;
  permissions: Array<any>;
  mediaTypes: Array<NotificationMediaType>;
  orgReminders: Array<OrgReminder>;

  orgTaskId: number;
  orgTaskScheduleId: number;
  hasActiveMediaType: boolean;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.notificationTypeId = model.notificationTypeId;
    this.orgTaskScheduleId = model.orgTaskScheduleId;
    this.userTypeId = model.userTypeId;
    this.orgTaskId = model.orgTaskId;
    this.appEvent = model.appEvent;
    this.permissions = (model.permissions || []).map(r => new NotificationPermission(r));
    this.mediaTypes = (model.mediaTypes || []).map(r => new NotificationMediaType(r));
    this.orgReminders = (model.orgReminders || []).map(r => new OrgReminder(r));

    this.orgTaskScheduleId = (this.mediaTypes || []).find(r => r.orgTaskScheduleId)?.orgTaskScheduleId;
    this.hasActiveMediaType = (this.mediaTypes || []).some(r => r.templateId);
  }
}

export class InvoiceNotificationSerializer{
  fromJson(json: any): InvoiceNotification {
    return new InvoiceNotification(json);
  }

  toJson(data: any = <any>{}) {
    const {id, name,  appEvent, notificationTypeId, permissions, userTypeId, mediaTypes} = data;
    return {
      id: id,
      name: name,
      appEvent: appEvent,
      notificationTypeId: notificationTypeId,
      permissions: permissions,
      userTypeId: userTypeId,
      mediaTypes: mediaTypes
    };
  }
}
