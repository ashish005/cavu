import {CoreResource} from "@app-global";

class SupportType {
  id: string;
  name: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
  }
}

class MediaType {
  id: string;
  name: string;
  masterType: string;
  sortOrder: number;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.masterType = model.masterType;
    this.sortOrder = model.sortOrder;
  }
}
class MediaFileType {
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
class CommunicationGateway {
  id: string;
  senderName: string;
  sendorEmailId: string;
  emailHostName: string;
  emailPortNo: string;
  credentialAPI: string;
  credentialId: string;
  credentialPassword: string;
  communicationMediaTypeId: number;
  footer: string;
  isPrimary: boolean;
  isAPI: boolean;
  bccMailId: string;

  constructor(model: any = <any>{}) {
    const {id, senderName, sendorEmailId, emailHostName, emailPortNo, credentialAPI, credentialId, credentialPassword, communicationMediaTypeId, footer, isPrimary, isAPI, bccMailId} = model;
    this.id = id;
    this.senderName = senderName;
    this.sendorEmailId = sendorEmailId;
    this.emailHostName = emailHostName;
    this.emailPortNo = emailPortNo;
    this.credentialAPI = credentialAPI;
    this.credentialId = credentialId;
    this.credentialPassword = credentialPassword;
    this.communicationMediaTypeId = communicationMediaTypeId;
    this.footer = footer;
    this.isPrimary = isPrimary;
    this.isAPI = isAPI;
    this.bccMailId = bccMailId;
  }
}

export class ServiceRequestLookup extends CoreResource{
  supportTypes: Array<SupportType> = [];
  mediaFileTypes: Array<MediaFileType> = [];
  mediaTypes: Array<MediaType> = [];
  constructor(model: any = <any>{}){
    super();
    const { supportTypes, mediaFileTypes, mediaTypes} = model;
    this.supportTypes = (supportTypes || []).map(r=> new SupportType(r));
    this.mediaFileTypes = (mediaFileTypes || []).map(r=> new MediaFileType(r));
    this.mediaTypes = (mediaTypes || []).map(r=> new MediaType(r));
  }

    getInboxMediaType(){
      return this.mediaTypes.find(r => r.masterType == 'dashboard');
    }
}

export class ServiceRequestLookupSerializer {
  fromJson(json: any): ServiceRequestLookup {
    return new ServiceRequestLookup(json);
  }

  toJson(data: any): any {
    return {};
  }
}
