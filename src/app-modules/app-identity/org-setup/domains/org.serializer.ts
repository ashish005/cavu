import {OrgHostConfig} from "./org-host-config.serializer";

export class OrgTenant {
    id: number;
    licenseNo: string;

    validFromDate: string;
    validToDate: string;

    contactPersonEmail: string;
    contactPersonMobile: string;
    contactPersonName: string;

    liveStatus: string;

    referenceContact: string;
    referenceMail: string;
    referenceSource: string;

    constructor(model: any = <any>{}) {
        this.id = model.id;

        this.licenseNo = model.licenseNo;

        this.validFromDate = model.validFromDate;
        this.validToDate = model.validToDate;

        this.contactPersonEmail = model.contactPersonEmail;
        this.contactPersonMobile = model.contactPersonMobile;
        this.contactPersonName = model.contactPersonName;

        this.liveStatus = model.liveStatus;

        this.referenceContact = model.referenceContact;
        this.referenceMail = model.referenceMail;
        this.referenceSource = model.referenceSource;
    }
}

export class Org {
  id: string;
  name: string;
  address: string;
  //businessId: string;
  contactNo1: string;
  contactNo2: string;
  emailId1: string;
  emailId2: string;
  establishedDate: string;
  affiliatedName: string;
  operatedById: string;
  profileId: string;
  profileUrl: string;
  countryId: string;
  tenant: OrgTenant;
  hostConfigs: Array<OrgHostConfig>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.address = model.address;
    //this.businessId = model.businessId;
    this.contactNo1 = model.contactNo1;
    this.contactNo2 = model.contactNo2;
    this.emailId1 = model.emailId1;
    this.emailId2 = model.emailId2;
    this.establishedDate = model.establishedDate;//.toRegionDate();
    this.affiliatedName = model.affiliatedName || '';
    this.operatedById = model.operatedById;

    this.profileId = model.profileId;
    this.profileUrl = model.profileUrl;
    this.countryId = model.countryId;

    this.tenant = new OrgTenant(model.tenant);
    this.hostConfigs = (model.hostConfigs || []).map(r => new OrgHostConfig(r));
  }

  updateOrgProfile(profile){
    this.profileId = profile.profileId;
    this.profileUrl= profile.profileUrl;
  }
}

export class OrgSerializer {
  fromJson(json: any): Org { return new Org(json); }
  toJson(data: any): any { return data; }
}