import {CoreQueryOptions, STATUS_ENUM} from "@app-global";

export class ContactTypeQueryOptions extends CoreQueryOptions {
    userMasterType: string;
    override toQueryString (){
        const obj = {
            userMasterType:this.userMasterType
        };
        return super.getParamByObject(obj);
    }
}

export class ContactTypeRule {
  id: string;
  userTypeId: number;
  userTypeName: string;
  contactTypeId: number;
  isVerificationRequired: boolean;
  isMandatory: boolean;
  status: boolean;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.userTypeId = model.userTypeId;
    this.userTypeName = model.userTypeName;
    this.contactTypeId = model.contactTypeId;
    this.isVerificationRequired = model.isVerificationRequired;
    this.isMandatory = model.isMandatory;
    this.status = model.status || false;
  }
}

export class ContactType {
  id: string;
  name: string;
  isRequired: boolean;
  ruleId: string;
  userTypeId: number;
  isVerificationRequired: boolean;
  isMandatory: boolean;

  verificationByUserId: string;
  verificationByUserName: string;
  status: boolean;
  rules: Array<ContactTypeRule>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.isRequired = model.isRequired;
    this.rules = (model.rules || []).map(r=> new ContactTypeRule(r));

    this.userTypeId = model.userTypeId;
    this.ruleId = model.ruleId;
    this.isVerificationRequired = model.isVerificationRequired;
    this.isMandatory = model.isMandatory;
    this.verificationByUserId = model.verificationByUserId;
    this.verificationByUserName = model.verificationByUserName;
    this.status = model.status || false;
  }
}

export class ContactTypeSerializer {
  fromJson(json: any): ContactType { return new ContactType(json); }
  toJson(data: any): any {
      (data.rules || []).forEach(r=> { r.status = (r.status)? STATUS_ENUM.ACTIVE : STATUS_ENUM.INACTIVE; });
      return data;
  }
}


