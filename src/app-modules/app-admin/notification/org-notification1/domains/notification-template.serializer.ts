import {CoreQueryOptions, STATUS_ENUM} from "@app-global";

export class NotificationTemplateQueryOptions extends CoreQueryOptions{
  notificationId: string;
  notificationTypeId: string;
  mediaTypeId: any;
  mediaMasterType: string;
  templateId: string;

  constructor(model: any = {}){
    super(model);
    this.notificationId = model.notificationId || '';
    this.notificationTypeId = model.notificationTypeId || '';
    this.mediaTypeId = model.mediaTypeId || '';
    this.templateId = model.templateId || '';
  }

  override toQueryString (){
    const obj = {
      notificationId:this.notificationId,
      notificationTypeId:this.notificationTypeId,
      mediaTypeId:this.mediaTypeId,
      templateId:this.templateId
    };
    return super.getParamByObject(obj);
  }
}
export class NotificationTemplate {
  id: string;
  header: string;
  templateCode: string;
  content: string;
  mediaTypeId: number | string;
  isDefaultFooter: boolean;
  gatewayId: string;
  isTaskReminder: boolean;
  notificationId: number;
  orgTaskScheduleId: number;

  mediaMasterType: string;

  notificationTypeId: number;
  voucherId: number;

  senderName: string;
  senderEmailId: string;

  parentId: number;
  status: string;
  isLocked: boolean;
  isDeleted: boolean;

  constructor(model: any = <any>{}){
    const {id, notificationId, notificationTypeId, voucherId, header,
        mediaTypeId, gatewayId, senderName, senderEmailId,
        templateCode, orgTaskScheduleId, content, isDefaultFooter,
        mediaMasterType, status, isLocked, isDeleted, isTaskReminder
    } = model;
    this.id = id;
    this.header = header;
    this.templateCode = templateCode;
    this.content = content;
    this.mediaTypeId = mediaTypeId;
    this.isDefaultFooter = isDefaultFooter;
    this.gatewayId = gatewayId;
    this.isTaskReminder = isTaskReminder;
    this.notificationId = notificationId;
    this.orgTaskScheduleId = orgTaskScheduleId;


    this.notificationTypeId = notificationTypeId;
    this.voucherId = voucherId;


    this.mediaMasterType = mediaMasterType;

    this.senderName = senderName;
    this.senderEmailId = senderEmailId;

    this.status = status;
    this.isDeleted = isDeleted;
    this.isLocked = isLocked;
  }
}

export class NotificationTemplateSerializer {
  fromJson(json: any): NotificationTemplate {
    return new NotificationTemplate(json);
  }

  toJson(data: any): any {
    // const {id, notificationId, notificationTypeId, voucherId, header, mediaTypeId, gatewayId, templateCode, content, isDefaultFooter, senderUserId, orgUnitId, orgBranchId} = data;
    // return {
    //   notificationId: notificationId,
    //   notificationTypeId: notificationTypeId,
    //   voucherId: voucherId,
    //   header: header,
    //   mediaTypeId: mediaTypeId,
    //   gatewayId: gatewayId,
    //   templateCode: templateCode,
    //   content: content,
    //   isDefaultFooter: isDefaultFooter
    // };
    data.status = data.status ? STATUS_ENUM.ACTIVE: STATUS_ENUM.INACTIVE;
    return data;
  }
}
