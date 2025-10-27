import {CoreResource} from "@app-global";

class MasterType {
    isLocked: boolean;
    status: boolean;
    isDeleted: boolean;
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;

    constructor(model: any = <any>{}) {
        this.isLocked = model.isLocked;
        this.status = model.status;
        this.isDeleted = model.isDeleted;
        this.createdBy = model.createdBy;
        this.createdDate = new Date(model.createdDate).toDateString();
        this.modifiedBy = model.modifiedBy;
        this.modifiedDate = model.modifiedDate ? new Date(model.modifiedDate).toDateString() : null;
    }
}

export class CommunicationSection extends MasterType {
    id: string;
    senderName: string;
    senderEmailId: string;
    emailPortNo: string;
    senderAPI: string;
    credentialId: string;
    credentialPassword: string;
    mediaMasterType: string;
    mediaTypeId: number;
    footer: string;
    isPrimary: boolean;
    isAPI: boolean;
    bccMailId: string;

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

class EmailSection extends CommunicationSection {
    constructor(model: any = <any>{}) {
        super(model);
    }
}

class SmsSection extends CommunicationSection {
    constructor(model: any = <any>{}) {
        super(model);
    }
}

class AppIntgrationSection {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
    isPrimary: boolean;
    isLocked: boolean;
    status: boolean;

    constructor(model: any = <any>{}) {
        const {id, name, description, logoUrl, isPrimary, isLocked, status} = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.logoUrl = logoUrl;
        this.isPrimary = isPrimary;
        this.isLocked = isLocked;
        this.status = status;
    }
}

export class AllSection {
    key: string;
    name: string;
    desc: string;
    sortOrder: number;

    constructor(model: any = <any>{}) {
        const {key, name, sortOrder, desc} = model;
        this.desc = desc;
        this.key = key;
        this.name = name;
        this.sortOrder = sortOrder;
    }
}

export class OrgIntegration extends CoreResource {
    items: Array<AllSection>;
    email: Array<EmailSection>;
    sms: Array<SmsSection>;
    currencyExchange: Array<AppIntgrationSection>;
    accounting: Array<AppIntgrationSection>;
    shipping: Array<AppIntgrationSection>;
    edi: Array<AppIntgrationSection>;
    payment: Array<AppIntgrationSection>;
    collaboration: Array<AppIntgrationSection>;
    conference: Array<AppIntgrationSection>;

    constructor(model: any = <any>{}) {
        super();
        const {items, email, sms, currencyExchange, accounting, shipping, edi, payment, collaboration, conference} = model;
        this.items = (items || []).map(r => new AllSection(r));

        this.email = (email || []).map(r => new EmailSection(r));
        this.sms = (sms || []).map(r => new SmsSection(r));

        this.currencyExchange = (currencyExchange || []).map(r => new AppIntgrationSection(r));
        this.accounting = (accounting || []).map(r => new AppIntgrationSection(r));
        this.shipping = (shipping || []).map(r => new AppIntgrationSection(r));
        this.edi = (edi || []).map(r => new AppIntgrationSection(r));
        this.payment = (payment || []).map(r => new AppIntgrationSection(r));
        this.collaboration = (collaboration || []).map(r => new AppIntgrationSection(r));
        this.conference = (conference || []).map(r => new AppIntgrationSection(r));
    }
}

export class OrgIntegrationSerializer {
    fromJson(json: any): OrgIntegration {
        return new OrgIntegration(json);
    }

    toJson(data: any): any {
    }
}
