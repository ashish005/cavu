import {CoreQueryOptions} from "../../../services";

export class UserDocumentQueryOptions extends CoreQueryOptions{
    id: any;
    userMasterType: string;
    userId: string;

    constructor(data: any = {}){
        super(data);
    }

   override toQueryString (){
        const obj = {
            userMasterType: this.userMasterType,
            userId: this.userId,
        };
        return super.getParamByObject(obj);
    }
}


class UserDocumentInfo {
  id: number | string;
  contentType: string;
  documentNo: string;
  name: string;
  documentTypeId: number;
  documentType: string;
  documentCategoryId: number;
  documentCategory: string;
  fileName: string;
  fileSize: string;
  isFrontImage: boolean;
  fileUrl: string;
  userId: string;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.name = model.name;
    this.documentNo = model.documentNo;
    this.documentTypeId = model.documentTypeId;
    this.documentType = model.documentType;
    this.documentCategoryId = model.documentCategoryId;
    this.documentCategory = model.documentCategory;
    this.fileName = model.fileName;
    this.contentType = model.contentType;
    this.fileSize = model.fileSize;
    this.isFrontImage = model.isFrontImage;
    this.fileUrl = model.fileUrl;
    this.userId = model.userId;
  }
}

export class UserDocument {
  id: number | string;
  count: number;
  size: number;
  status: string;

  documentTypeId: number;
  documentTypeName: string;
  documentCategoryId: number;
  documentCategoryName: string;
  docs: Array<UserDocumentInfo>;

  verificationByUserId: string;
  verificationBy: string;
  isVerificationRequired: boolean;
  isMandatory: boolean;

  constructor(model: any){
    const {
        id, count, size, status, documentTypeId, documentTypeName, documentCategoryId, documentCategoryName, docs,
        verificationByUserId, verificationBy, isVerificationRequired, isMandatory
    } = model;
    this.id = id;
    this.count = count;
    this.size = size;
    this.status = status;
    this.documentTypeId = documentTypeId;
    this.documentTypeName = documentTypeName;
    this.documentCategoryId = documentCategoryId;
    this.documentCategoryName = documentCategoryName;

      this.verificationByUserId = verificationByUserId;
      this.verificationBy = verificationBy;
      this.isVerificationRequired = isVerificationRequired;
      this.isMandatory = isMandatory;
    this.docs = (docs || []).map(r => new UserDocumentInfo(r));
  }
}
export class DocumentLookup {
    id: number | string;
    docTypes: Array<any>;

    constructor(model: any){
        this.docTypes = model.docTypes;
    }
}
export class UserDocumentGrid {
    lookups: DocumentLookup;
    entities: Array<UserDocument>;

    constructor(model: any){
        const { data, entities} = model;
        this.lookups = new DocumentLookup(data);
        this.entities = (entities || []).map(r => new UserDocument(r));
    }
}
