import {CoreQueryOptions} from "@app-global";

export class InstituteQueryOptions extends CoreQueryOptions{
  // constructor(){
  //   super({ filters: [ new CoreFilter('businessId', 'neq', null )]  });
  // }
}

export class Institute {
  id: string;
  name: string;
  licenseNo: string;
  validFromDate: string;
  validToDate: string;
  contactPersonEmail: string;
  contactPersonMobile: string;
  contactPersonName: string;
  referenceContact: string;
  referenceMail: string;
  referenceSource: string;
  userName: string;
  businessTypeId: number;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.licenseNo = model.licenseNo;
    this.validFromDate = model.validFromDate;
    this.validToDate = model.validToDate;
    this.contactPersonEmail = model.contactPersonEmail;
    this.contactPersonMobile = model.contactPersonMobile;
    this.contactPersonName = model.contactPersonName;
    this.referenceContact = model.referenceContact;
    this.referenceMail = model.referenceMail;
    this.referenceSource = model.referenceSource;
    this.userName = model.userName;
    this.businessTypeId = model.businessTypeId;

  }
}

export class InstituteSerializer {
  fromJson(json: any): Institute {
    return new Institute(json);
  }

  toJson(data: Institute): any {
    return {
      id: data.id,
      name: data.name,
      licenseNo: data.licenseNo,
      validFromDate: data.validFromDate,
      validToDate: data.validToDate,
      contactPersonEmail: data.contactPersonEmail,
      contactPersonMobile: data.contactPersonMobile,
      contactPersonName: data.contactPersonName,
      referenceContact: data.referenceContact,
      referenceMail: data.referenceMail,
      referenceSource: data.referenceSource,
      userName: data.userName,
      businessTypeId: data.businessTypeId
    };
  }
}
