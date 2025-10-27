import {CoreQueryOptions} from "@app-global";

export class SupportTicketQueryOptions extends CoreQueryOptions{

}

export class SupportTicket {
  id: string;
  mediaTypeId: number;
  userTypeId: number;
  userId: string;
  supportTypeId: number;
  header: string;
  message: string;
  mobileNo: string;
  emailId: string;
  file: any;
  ip: string;
  pageURL: string;

  createdDate: string;
  createdBy: string;
  modifiedBy: string;
  modifiedDate: string;
  userName: string;
  userEmail: string;
  supportTypeName: string;

  attachments: Array<any>;

  constructor(model: any = <any>{}) {
    const {
      id, mediaTypeId, userTypeId, userId, supportTypeId, header, message, mobileNo, emailId, file, ip,
        createdBy, createdDate, modifiedBy, modifiedDate,
        userName, userEmail, supportTypeName,
        attachments
    } = model;
    this.id = id;
    this.mediaTypeId = mediaTypeId;
    this.userTypeId = userTypeId;
    this.userId = userId;
    this.supportTypeId =  supportTypeId;
    this.header = header;
    this.message = message;
    this.mobileNo = mobileNo;
    this.emailId = emailId;
    this.file = file;
    this.ip = ip;
    this.pageURL =  model.pageURL;

    this.createdDate = createdDate;
    this.createdBy = createdBy;

    this.modifiedBy = modifiedBy;
    this.modifiedDate = modifiedDate;

    this.userName = userName;
    this.userEmail = userEmail;
    this.supportTypeName = supportTypeName;

    this.attachments = attachments;
  }
}

export class SupportTicketSerializer {
  fromJson(json: any): SupportTicket {
    return new SupportTicket(json);
  }

  toJson(data: any): any {
    return {
      id: data.id,
      userTypeId: data.userTypeId,
      userId: data.userId,
      supportTypeId: data.supportTypeId,
      header: data.header,
      message: data.message,
      mobileNo: data.mobileNo,
      emailId: data.emailId,
      file: data.file,
      ip: data.ip,
      pageURL: data.pageURL
    };
  }
}
