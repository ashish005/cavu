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
  isActive: boolean;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.userTypeId = model.userTypeId;
    this.userTypeName = model.userTypeName;
    this.addressTypeId = model.addressTypeId;
    this.isVerificationRequired = model.isVerificationRequired;
    this.isMandatory = model.isMandatory;
    this.isActive = model.isActive || false;
  }
}

export class AddressType {
  id: string;
  name: string;
  isRequired: boolean;
  isActive: boolean;
  isLocked: boolean;
  rules: Array<AddressTypeRule>;
  rulePermissions: Array<AddressTypeRule>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.isRequired = model.isRequired;
    this.isActive = model.isActive;
    this.isLocked = model.isLocked;
    this.rules = (model.rules || []).map(r=> new AddressTypeRule(r));
    this.rulePermissions = (model.rulePermissions || []).map(r=> new AddressTypeRule(r));
  }
}

export class AddressTypeSerializer {
  fromJson(json: any): AddressType { return new AddressType(json); }
  toJson(data: any): any {
      (data.rules || []).forEach(r=> { r.status = (r.status)? STATUS_ENUM.ACTIVE : STATUS_ENUM.INACTIVE; });
      return data;
  }
}


