import { CoreQueryOptions, STATUS_ENUM } from "@app-global";

export class AddressTypeQueryOptions extends CoreQueryOptions {
    userMasterType: string;
    override toQueryString (){
        const obj = {
            userMasterType:this.userMasterType
        };
        return super.getParamByObject(obj);
    }
}

export class AddressTypeRule {
  id: string;
  userTypeId: number;
  userTypeName: string;
  addressTypeId: number;
  isVerificationRequired: boolean;
  isMandatory: boolean;
  status: boolean;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.userTypeId = model.userTypeId;
    this.userTypeName = model.userTypeName;
    this.addressTypeId = model.addressTypeId;
    this.isVerificationRequired = model.isVerificationRequired;
    this.isMandatory = model.isMandatory;
    this.status = model.status || false;
  }
}

export class AddressType {
  id: string;
  name: string;
  ruleId: string;
  userTypeId: number;
  isVerificationRequired: boolean;
  isMandatory: boolean;

  verificationByUserId: string;
  verificationByUserName: string;
  status: boolean;
  rules: Array<AddressTypeRule>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.rules = (model.rules || []).map(r=> new AddressTypeRule(r));

    this.userTypeId = model.userTypeId;
    this.ruleId = model.ruleId;
    this.isVerificationRequired = model.isVerificationRequired;
    this.isMandatory = model.isMandatory;
    this.verificationByUserId = model.verificationByUserId;
    this.verificationByUserName = model.verificationByUserName;
    this.status = model.status || false;
  }
}

export class AddressTypeSerializer {
  fromJson(json: any): AddressType { return new AddressType(json); }
  toJson(data: any): any {
      (data.rules || []).forEach(r=> { r.status = (r.status)? STATUS_ENUM.ACTIVE : STATUS_ENUM.INACTIVE; });
      return data;
  }
}


