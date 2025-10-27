import {CoreQueryOptions} from "@app-global";

export class ConversationQueryOptions extends CoreQueryOptions {
  ticketId: string;
  constructor(model: any = {}){ super(model); }

  override toQueryString (){
    const obj = { ticketId: this.ticketId };
    return super.getParamByObject(obj);
  }
}

export class Conversation {
  id: string;
  header: string;
  content: string;
  mediaTypeId: number;
  mediaMasterType: string;
  successCount: number;
  scheduledDeliveredTime: string;
  createdDate: string;


  parentId: number;
  userId: string;
  userTypeId: string;
  supportTicketId: number;
  children: Array<Conversation>;
  constructor(model: any = <any>{}){
    const {id, header, content,
        mediaMasterType, mediaTypeId,
        successCount, scheduledDeliveredTime,
        createdDate,
        parentId, userId, userTypeId, supportTicketId,
        children
    } = model;
    this.id = id;
    this.header = header;
    this.content = content;
    this.mediaMasterType = mediaMasterType;
    this.mediaTypeId = mediaTypeId;
    this.successCount = successCount;
    this.scheduledDeliveredTime = scheduledDeliveredTime;
    this.createdDate = createdDate;

    this.parentId = parentId;
    this.userId = userId;
    this.userTypeId = userTypeId;
    this.supportTicketId = supportTicketId;
    this.children = (children || []).map(r => new Conversation(r));
  }
}

export class ConversationSerializer {
  fromJson(json: any): Conversation { return new Conversation(json); }
  toJson(data: any): any { return data; }
}
