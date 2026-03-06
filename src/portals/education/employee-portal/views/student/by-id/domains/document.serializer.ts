export class UserDocument {
    id: string;
    documentTypeId: number;
    name: string;
    fileName: string;
    contentType: string;
    fileSize: string;
    file: any;
    fileLocation: string;
    showName: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.documentTypeId = model.documentTypeId;
        this.name = model.name;
        this.fileName = model.fileName;
        this.contentType = model.contentType;
        this.fileSize = model.fileSize;
        this.file = model.file;
        this.fileLocation = model.fileLocation;
        this.showName = model.showName;
    }
}

export class StudentDocument {
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

/*export class OrgStudentDocument {
  id: number | string;
  count: number;
  documentType: string;
  front: Array<UserDocument>;
  back: Array<UserDocument>;
  size: number;
  status: string;

  constructor(model: any){
    this.id = model.id;
    this.count = model.count;
    this.status = model.status;
    this.documentType = model.documentType;
    this.front = model.front.map(r => new UserDocument(r));
    this.back = model.back.map(r => new UserDocument(r));
    this.size = model.size;
    this.status = model.status;
  }
}*/

export class StudentDocumentSerializer {
  fromJson(json: any): StudentDocument { return new StudentDocument(json); }

  toJson(data: any): any {
    let info = {};
    return info;
  }
}
