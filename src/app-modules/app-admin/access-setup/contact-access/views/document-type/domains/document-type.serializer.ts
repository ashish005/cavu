import {CoreQueryOptions, STATUS_ENUM} from "@app-global";

export class DocumentTypeQueryOptions extends CoreQueryOptions {
    userMasterType: string;
    categoryId: string;
    override toQueryString (){
        const obj = {
            userMasterType:this.userMasterType,
            categoryId: this.categoryId
        };
        return super.getParamByObject(obj);
    }
}

export class DocumentTypeRule {
  id: string;
  userTypeId: number;
  userTypeName: string;
  documentTypeId: number;
  isVerificationRequired: boolean;
  isMandatory: boolean;
  status: boolean;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.userTypeId = model.userTypeId;
    this.userTypeName = model.userTypeName;
    this.documentTypeId = model.documentTypeId;
    this.isVerificationRequired = model.isVerificationRequired;
    this.isMandatory = model.isMandatory;
    this.status = model.status || false;
  }
}

export class DocumentType {
  id: string;
  name: string;
  minSize: number;
  maxSize: number;
  categoryId: number;
  ruleId: string;
  userTypeId: number;
  isVerificationRequired: boolean;
  isMandatory: boolean;

  verificationByUserId: string;
  verificationByUserName: string;
  status: boolean;
  rules: Array<DocumentTypeRule>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.categoryId = model.categoryId;
    this.minSize = model.minSize || 1;
    this.maxSize = model.maxSize || 10;
    this.rules = (model.rules || []).map(r=> new DocumentTypeRule(r));

    this.userTypeId = model.userTypeId;
    this.ruleId = model.ruleId;
    this.isVerificationRequired = model.isVerificationRequired;
    this.isMandatory = model.isMandatory;
    this.verificationByUserId = model.verificationByUserId;
    this.verificationByUserName = model.verificationByUserName;
    this.status = model.status || false;
  }
}

export class DocumentTypeSerializer {
  fromJson(json: any): DocumentType { return new DocumentType(json); }
  toJson(data: any): any {
      (data.rules || []).forEach(r=> { r.status = (r.status)? STATUS_ENUM.ACTIVE : STATUS_ENUM.INACTIVE; });
      return data;
  }
}


