import {CoreQueryOptions} from "@app-global";

export class InvoiceHistoryQueryOptions extends CoreQueryOptions{
    voucherId: any; //'inbox,trash,outbox'
    voucherTypeId: any;
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {
            voucherId:this.voucherId,
            voucherTypeId: this.voucherTypeId
        };
        return super.getParamByObject(obj);
    }
}

export class QueueInfo {
    id: string;
    emailId: string;
    scheduleDeliveryTime: number;
    isSuccess: boolean;

    constructor(model: any = <any>{}) {
        const {
            id,
            emailId,
            scheduleDeliveryTime,
            isSuccess
        } = model;
    }
}

export class InvoiceHistory {
    id: string;
    voucherId: string;
    notificationId: number;
    conversationId: number;
    notificationName: string;
    notificationExecutionLink: string;
    notificationTypeId: number;

    createdDate: string;
    header: string;
    content: string;
    mediaType: string;
    userName: string;
    queue: Array<QueueInfo>;

    constructor(model: any = <any>{}){
        const {
            id,
            header, content, mediaType,
            queue,
            createdDate, userName,
            voucherId, notificationId, notificationTypeId, conversationId, notificationName, notificationExecutionLink,
        } = model;
        this.id = id;
        this.header = header;
        this.content = content;
        this.mediaType = mediaType;
        this.queue = (queue || []).map(r => new QueueInfo(r));
        this.createdDate = createdDate;
        this.userName = userName;

        this.voucherId = voucherId;
        this.notificationId = notificationId;
        this.notificationTypeId = notificationTypeId;
        this.conversationId = conversationId;
        this.notificationName = notificationName;
        this.notificationExecutionLink = notificationExecutionLink;
    }
}

export class InvoiceHistorySerializer {
    fromJson(json: any): InvoiceHistory { return new InvoiceHistory(json); }
    toJson(data: any): any { return {}; }
}
