import {CoreResource} from "@app-global";
export class TemplateTag {
    key: string;
    tagAction: string;

    constructor(key: string){
        this.key = key;
        this.tagAction = 'copy';
    }
}

export class TemplateTagLookup extends CoreResource {
    tags: Array<string>;
    masterType: string;

    constructor(model: any = <any>{}){
        super();
        const { tags, masterType } = model;

        this.tags = (tags || []).map(r => new TemplateTag(r));
        this.masterType = masterType;
    }
}
export class CommGateway {
    id: number | string;
    senderName: string;
    senderEmailId: string;
    mediaTypeId: number;
    isPrimary: boolean;
    footer: string;
    bccMailId: string;
    provider: string;

    constructor(model: any = <any>{}) {
        const {id, senderName, mediaTypeId, senderEmailId, isPrimary, footer, bccMailId, provider} = model;
        this.id = id;
        this.senderName = senderName;
        this.senderEmailId = senderEmailId;
        this.mediaTypeId = mediaTypeId;
        this.isPrimary = isPrimary;
        this.footer = footer;
        this.bccMailId = bccMailId;
        this.provider = provider;
    }
}
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
    hasHeader: boolean;
    hasFooter: boolean;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
        this.sortOrder = model.sortOrder;
        this.hasHeader = model.hasHeader;
        this.hasFooter = model.hasFooter;
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
    userTypeId: number;
    userMasterType: string;
    isSystem: boolean;
    isReminder: boolean;
    isForVoucher: boolean;
    icon: string;
    children: Array<NotificationTypeLookup>;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
        this.userMasterType = model.userMasterType;
        this.userTypeId = model.userTypeId;
        this.isSystem = model.isSystem;
        this.isReminder = model.isReminder;
        this.isForVoucher = model.isForVoucher;
        this.icon = model.icon;
        this.children = (model.children || []).map(r => new NotificationTypeLookup(r));
    }
}
export class OrgEvent {
    masterType: string;
    name: string;
    desc: string;
    constructor(model: any = <any>{}) {
        const {masterType, name, desc} = model;
        this.masterType = masterType;
        this.name = name;
        this.desc = desc;
    }
}
export class OrgNotificationEvent {
  masterType: string;
  name: string;
  orgEvents: Array<OrgEvent>;
  groupMasterTypes: Array<string>;
  constructor(model: any = <any>{}) {
    const {masterType, name, orgEvents} = model;
    this.masterType = masterType;
    this.name = name;
    this.orgEvents = (orgEvents || []).map(r => new OrgEvent(r));
    this.groupMasterTypes = this.orgEvents.map(r => r.masterType);
  }
}
/*export class CommGateway {
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

export class UserGroupLookup {
    id: string;
    name: string;
    categoryId: number;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.categoryId = model.categoryId;

    }
}

export class NotificationLookup extends CoreResource{

    mediaTypes: Array<MediaTypeLookup>;
    mediaFileTypes: Array<MediaFileType> = [];
    userRoles: Array<UserRoleLookup>;
    commGateways: Array<CommGateway> = [];
    notificationTypes: Array<NotificationTypeLookup>;
    tags: Array<TemplateTagLookup>;
    //userGroups: Array<UserGroupLookup> = [];
    orgNotifyEvents: Array<OrgNotificationEvent> = [];
    constructor(model: any = <any>{}){
        super();
        const { userRoles, mediaTypes, notificationTypes, mediaFileTypes, commGateways, tags, userGroups } = model;
        this.userRoles = (userRoles || []).map(r => new UserRoleLookup(r));
        this.mediaTypes = (mediaTypes || []).map(r => new MediaTypeLookup(r));
        this.notificationTypes = (notificationTypes || []).map(r => new NotificationTypeLookup(r));

        this.mediaFileTypes = (mediaFileTypes || []).map(r => new MediaFileType(r));
        this.commGateways = (commGateways || []).map(r=> new CommGateway(r));
        this.tags = (tags|| []).map(r=> new TemplateTagLookup(r));
        //this.userGroups = (userGroups || []).map(r=> new UserGroupLookup(r));
        this.orgNotifyEvents = (model.orgEvents || []).map(r => new OrgNotificationEvent(r));
    }

    getNotificationTypeLookups=()=> (this.notificationTypes || []).filter(r =>  !r.isSystem);

    getNotificationTypeByUserType=(userMasterType: string)=> this.notificationTypes.find(r => r.userMasterType == userMasterType);

    gatewayByMediaType(mediaTypeId: number){
        return this.commGateways.filter(r=> r.mediaTypeId == mediaTypeId) || [];
    }

    gatewayById(senderId: any){
        return this.commGateways.find(r => r.id == senderId);
    }

    gatewayInfo(gatewayId?: any){
        if(gatewayId){
            return this.commGateways?.find(r => r.id == gatewayId) || new CommGateway();
        }
        return new CommGateway();
    }

    getDefaultMediaType(){
        return this.mediaTypes.find(r => r.masterType == "dashboard");
    }
    getMediaTypeById(mediaTypeId: any){
        return this.mediaTypes.find(r => r.id == mediaTypeId || r.masterType=='dashboard');
    }

    findMatchingMaster(masterType: string){
        return (this.orgNotifyEvents || []).find(r => r.groupMasterTypes.some(r => r == masterType));
    }
}

export class  NotificationLookupSerializer {
  fromJson(json: any): NotificationLookup {
    return new NotificationLookup(json);
  }

  toJson(data: any): any {
    return {};
  }
}
