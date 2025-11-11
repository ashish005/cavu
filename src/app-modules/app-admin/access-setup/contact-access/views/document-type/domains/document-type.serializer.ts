import {CoreQueryOptions, STATUS_ENUM} from "@app-global";
export class DocumentTypeQueryOptions extends CoreQueryOptions {
    categoryId: string;
    override toQueryString (){
        const obj = {
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
  isActive: boolean;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.userTypeId = model.userTypeId;
    this.userTypeName = model.userTypeName;
    this.documentTypeId = model.documentTypeId;
    this.isVerificationRequired = model.isVerificationRequired;
    this.isMandatory = model.isMandatory;
    this.isActive = model.isActive || false;
  }
}

export class DocumentType {
  id: string;
  name: string;
  minSize: number;
  maxSize: number;
  categoryId: number;
  categoryName: string;

  verificationByUserId: string;
  verificationByUserName: string;
  isActive: boolean;
  isLocked: boolean;
  rulePermissions: Array<DocumentTypeRule>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.categoryId = model.categoryId;
    this.minSize = model.minSize || 1;
    this.maxSize = model.maxSize || 10;
    this.rulePermissions = (model.rulePermissions || []).map(r=> new DocumentTypeRule(r));

    this.categoryName = model.categoryName;
    this.verificationByUserId = model.verificationByUserId;
    this.verificationByUserName = model.verificationByUserName;
    this.isActive = model.isActive || false;
    this.isLocked = model.isLocked;
  }
}

export class DocumentTypeSerializer {
  fromJson(json: any): DocumentType { return new DocumentType(json); }
  toJson(data: any): any {
      (data.rules || []).forEach(r=> { r.status = (r.status)? STATUS_ENUM.ACTIVE : STATUS_ENUM.INACTIVE; });
      return data;
  }
}


