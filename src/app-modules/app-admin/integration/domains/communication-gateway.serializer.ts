import {CoreQueryOptions} from "@app-global";

class MasterType {
  isLocked: boolean;
  status: string;
  isDeleted: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;

  constructor(model: any = <any>{}){
    this.isLocked = model.isLocked;
    this.status = model.status;
    this.isDeleted = model.isDeleted;
    this.createdBy = model.createdBy;
    this.createdDate = new Date(model.createdDate).toDateString();
    this.modifiedBy = model.modifiedBy;
    this.modifiedDate = model.modifiedDate? new Date(model.modifiedDate).toDateString(): null;
  }
}

export class CommunicationGatewayQueryOptions extends CoreQueryOptions {
    public mediaMasterType: string;
    constructor(model: any = {}) { super(model); }

    override toQueryString() {
        const obj = {
            mediaMasterType:this.mediaMasterType,
        };
        return super.getParamByObject(obj);
    }
}

export class CommunicationGateway extends MasterType {
  id: string;
  senderName: string;
  senderEmailId: string;
  emailPortNo: string;
  senderAPI: string;
  credentialId: string;
  credentialPassword: string;
  mediaTypeId: number;
  footer: string;
  isPrimary: boolean;
  isAPI: boolean;
  bccMailId: string;

  mediaMasterType: string;

  constructor(model: any = <any>{}) {
    super(model);
    const {id, senderName, senderEmailId, emailPortNo, senderAPI, credentialId, credentialPassword, mediaMasterType, mediaTypeId, footer, isPrimary, isAPI, bccMailId} = model;
    this.id = id;
    this.senderName = senderName;
    this.senderEmailId = senderEmailId;
    this.emailPortNo = emailPortNo;
    this.senderAPI = senderAPI;
    this.credentialId = credentialId;
    this.credentialPassword = credentialPassword;
    this.mediaTypeId = mediaTypeId;
    this.mediaMasterType = mediaMasterType;
    this.footer = footer;
    this.isPrimary = isPrimary;
    this.isAPI = isAPI;
    this.bccMailId = bccMailId;
  }
}

export class CommunicationGatewaySerializer {
  fromJson(json: any): CommunicationGateway {
    return new CommunicationGateway(json);
  }

  toJson(data: any): any {

    const {id, senderName, senderEmailId, emailPortNo, senderAPI, credentialId, credentialPassword, mediaTypeId, footer, isPrimary, isAPI, bccMailId} = data;
    return {
      id: id,
      senderName: senderName,
      senderEmailId: senderEmailId,
      emailPortNo: emailPortNo,
      senderAPI: senderAPI,
      credentialId: credentialId,
      credentialPassword: credentialPassword,
      mediaTypeId: mediaTypeId,
      footer: footer,
      isPrimary: isPrimary,
      isAPI: isAPI,
      bccMailId: bccMailId,
    };
  }
}
