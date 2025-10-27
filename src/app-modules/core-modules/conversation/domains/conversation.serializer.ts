import {CoreQueryOptions} from "@app-global";

export class ConversationQueryOptions extends CoreQueryOptions{
  conversationType: string; //'inbox,trash,outbox'
  orgUserId: string;
  constructor(model: any = {}){
    super(model);
    this.conversationType = model.conversationType || '';
  }

  override toQueryString (){
    const obj = {
      conversationType:this.conversationType,
      orgUserId:this.orgUserId
    };
    return super.getParamByObject(obj);
  }
}

export class RecipientConversation {
  header: string;
  content: string;
  email: string;
  mobile: string;
  userId: string;
  name: string;
  scheduleDeliveryTime: string;
  isSuccess: boolean;
  failureReason: string;
  deliveryLogId: number;
  deliveredTime: string;
  deliveredTrackingId: string;
  constructor(model: any = <any>{}) {
    const {
      header, content,
      email, mobile, userId, name, scheduleDeliveryTime,
      isSuccess,
      failureReason,
      deliveryLogId,
      deliveredTime,
      deliveredTrackingId
    } = model;
    this.header = header;
    this.content = content;
    this.email = email;
    this.mobile = mobile;
    this.userId = userId;

    this.name = name;
    this.scheduleDeliveryTime = scheduleDeliveryTime;

    this.isSuccess = isSuccess;
    this.failureReason = failureReason;
    this.deliveryLogId = deliveryLogId;
    this.deliveredTime = deliveredTime;
    this.deliveredTrackingId = deliveredTrackingId;
  }
}

export class Conversation {
  id: string;
  header: string;
  content: string;
  mediaType: string;
  mediaTypeId: number;
  mediaMasterType: string;
  recipientCount: number;
  recipientList: Array<RecipientConversation>;
  sentToMail: string;
  sentToSMS: string;
  successCount: number;
  scheduledDeliveredTime: string;
  hasSameContentForEveryRecipient: boolean;
  triggeredToRecipients: number;
  constructor(model: any = <any>{}){
    const {id, header, content, mediaType, mediaMasterType, mediaTypeId, recipientCount,
        sentToMail, sentToSMS, successCount, scheduledDeliveredTime,
        hasSameContentForEveryRecipient, triggeredToRecipients,

        recipientList
    } = model;
    this.id = id;
    this.header = header;
    this.content = content;
    this.mediaType = mediaType;
    this.mediaMasterType = mediaMasterType;
    this.mediaTypeId = mediaTypeId;
    this.recipientCount = recipientCount;
    this.sentToMail = sentToMail;
    this.sentToSMS = sentToSMS;
    this.successCount = successCount;
    this.scheduledDeliveredTime = scheduledDeliveredTime;
    this.hasSameContentForEveryRecipient = hasSameContentForEveryRecipient;
    this.triggeredToRecipients = triggeredToRecipients;

    this.recipientList = (recipientList || []).map(r => new RecipientConversation(r));
  }

  public get isInbox(){ return this.mediaMasterType == "dashboard"; }
  public get isEmail(){ return this.mediaMasterType == "email"; }
  public get isSms(){ return this.mediaMasterType == "sms"; }
}

export class ConversationSerializer {
  fromJson(json: any): Conversation {
    return new Conversation(json);
  }

  toJson(data: any): any {
    return {};
  }
}
