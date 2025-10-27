import {CoreResource} from "@app-global";

export class UserRoleLookup {
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
export class UserTypeLookup {
    id: number;
    name: string;
    accountGroupId: number;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.accountGroupId = model.accountGroupId;
    }
}
export class MediaTypeLookup {
    id: number | string;
    name: string;
    masterType: string;
    sortOrder: number;
    communicationTemplateId: number | string;
    orgTaskScheduleId: number;
    //appEvent: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
        this.sortOrder = model.sortOrder;
        this.orgTaskScheduleId = model.orgTaskScheduleId;
        this.communicationTemplateId = model.communicationTemplateId;
        //this.appEvent = model.appEvent;
    }
}

export class MediaFileType {
    id: number | string;
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
export class NotificationTypeLookup {
    id: number | string;
    name: string;
    masterType: string;
    userTypeId: number | string;
    isEventBased: boolean;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
        this.userTypeId = model.userTypeId;
        this.isEventBased = model.isEventBased;
    }
}
/*
export class OrgNotificationEvent {
  id: number | string;
  name: string;
  description: string;

  constructor(model: any = <any>{}) {
    const {id, name, description} = model;
    this.id = id;
    this.name = name;
    this.description = description;
  }
}
export class CommGateway {
  id: number | string;
  senderName: string;
  mediaTypeId: number;
  isPrimary: boolean;

  constructor(model: any = <any>{}) {
    const {id, senderName, mediaTypeId, isPrimary} = model;
    this.id = id;
    this.senderName = senderName;
    this.mediaTypeId = mediaTypeId;
    this.isPrimary = isPrimary;
  }
}*/

export class CommunicationLookup extends CoreResource{
    /*commGateway: Array<CommGateway> = [];
    */
    //orgEvents: Array<OrgNotificationEvent> = [];
    mediaFileTypes: Array<MediaFileType> = [];
    userRoles: Array<UserRoleLookup>;
    mediaTypes: Array<MediaTypeLookup>;
    userTypes: Array<UserTypeLookup>;
    notificationTypes: Array<NotificationTypeLookup>;

    constructor(model: any = <any>{}){
        super();
        const { userRoles, mediaTypes, userTypes, notificationTypes, mediaFileTypes } = model;
        this.userRoles = (userRoles || []).map(r => new UserRoleLookup(r));
        this.mediaTypes = (mediaTypes || []).map(r => new MediaTypeLookup(r));
        this.userTypes = (userTypes || []).map(r => new UserTypeLookup(r));
        this.notificationTypes = (notificationTypes || []).map(r => new NotificationTypeLookup(r));

        this.mediaFileTypes = (mediaFileTypes || []).map(r => new MediaFileType(r));
        /*this.commGateway = (model.commGateway || []).map(r => new CommGateway(r));
        */
        //this.orgEvents = (model.orgEvents || []).map(r => new OrgNotificationEvent(r));
    }

    getMediaTypeNameById(mediaTypeId){
        return (this.mediaTypes || []).find(r =>  r.id == mediaTypeId);
    }
}

export class  CommunicationLookupSerializer {
  fromJson(json: any): CommunicationLookup {
    return new CommunicationLookup(json);
  }

  toJson(data: any): any {
    return {};
  }
}
