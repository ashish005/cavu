import {CoreResource} from "@app-global";
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

export class UserContact{
  id: number;
  userId: string;
  userContactTypeId: number;
  name: string;
  showName: string;
  isPrimary: boolean;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.userId = model.userId;
    this.userContactTypeId = model.userContactTypeId;
    this.name = model.name;
    this.showName = model.name;
    this.isPrimary = model.isPrimary;
  }
}
export class UserAddress {
  id: number;
  userAddressTypeId: number;
  address1: string;
  address2: string;
  cityId: number;
  countryId: number;
  pinCodeId: number;
  stateId: number;
  isPrimary: boolean;
  showName: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.userAddressTypeId = model.userAddressTypeId;
    this.address1 = model.address1;
    this.address2 = model.address2;
    this.cityId = model.cityId;
    this.countryId = model.countryId;
    this.pinCodeId = model.pinCodeId;
    this.stateId = model.stateId;
    this.isPrimary = model.isPrimary;
    this.showName = model.name;
  }
}
export class UserRelation{
  id: number;
  relationTypeId: number;
  title: string;
  fName: string;
  lName: string;
  qualificationId: number;
  professionId: number;
  departmentId: number;
  designationId: number;
  incomeId: number;
  phone: string;
  email: string;
  photoDocumentId: number;
  isPrimary: boolean;
  showName: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.relationTypeId = model.relationTypeId;
    this.title = model.title;
    this.fName = model.fName;
    this.lName = model.lName;
    this.qualificationId = model.qualificationId;
    this.professionId = model.professionId;
    this.departmentId = model.departmentId;
    this.designationId = model.designationId;
    this.incomeId = model.incomeId;
    this.phone = model.phone;
    this.email = model.email;
    this.photoDocumentId = model.photoDocumentId;
    this.isPrimary = model.isPrimary || false;
    this.showName = model.name;
  }
}

export class StudentUserCommunication extends CoreResource {
  userContact: Array<UserContact>;
  userAddress: Array<UserAddress>;
  userRelation: Array<UserRelation>;

  constructor(model: any = <any>{}){
    super();
    this.userContact = (model.userContact || []).map((r)=> new UserContact(r));
    this.userAddress = (model.userAddress || []).map((r)=> new UserAddress(r));
    this.userRelation = (model.userRelation || []).map((r)=> new UserRelation(r));
  }
}
export class StudentUserCommunicationSerializer {
  fromJson(json: any): StudentUserCommunication {
    return new StudentUserCommunication(json);
  }

  toJson(data: any): any {
    return {};
  }
}

export class StudentUser extends CoreResource {
  registrationNo: string;
  registrationDate: string;
  title: string;
  fName: string;
  mName: string;
  lName: string;
  dob: string;
  genderId: number;
  maritalStatusId: number;
  bloodGroupId: number;
  casteId: number;
  reservationCategoryId: number;
  accountId: string;
  email: string;
  orgId: string;
  userId: string;
  nationalityId: number;
  phone: string;
  religion: string;
  profileId: string;
  profileUrl: string;
  documents: Array<UserDocument>;

  constructor(model: any = <any>{}){
    super();
    this.id = model.id;
    this.registrationNo = model.registrationNo;
    this.registrationDate = model.registrationDate;
    this.dob = model.dob;
    this.title = model.title;
    this.fName = model.fName;
    this.mName = model.mName;
    this.lName = model.lName;
    this.phone = model.phone;
    this.genderId = model.genderId;
    this.maritalStatusId = model.maritalStatusId;
    this.bloodGroupId = model.bloodGroupId;
    this.casteId = model.casteId;
    this.reservationCategoryId = model.reservationCategoryId;
    this.nationalityId = model.nationalityId;

    this.accountId = model.accountId;
    this.email = model.email;
    this.orgId = model.orgId;
    this.userId = model.userId;
    this.profileId = model.profileId;
    this.profileUrl = model.profileUrl;

    this.documents = (model.documents || []).map((r)=> new UserDocument(r));
  }

  get name(){
    return this.fName + ' '+ this.lName;
  }
}

export class StudentUserSerializer {
  fromJson(json: any): StudentUser {
    return new StudentUser(json);
  }

  toJson(data: any): any {
    let info = {
      id: data.id,
      registrationNo: data.registrationNo,
      registrationDate: data.registrationDate,
      title: data.title,
      fName: data.fName,
      mName: data.mName,
      lName: data.lName,
      email: data.email,
      phone: data.phone,
      dob: data.dob,
      genderId: data.genderId,
      maritalStatusId: data.maritalStatusId,
      bloodGroupId: data.bloodGroupId,
      religion: data.religion,
      casteId: data.casteId,
      nationalityId: data.nationalityId,
      reservationCategoryId: data.reservationCategoryId,
      courseInfo: data.courseInfo,
      feePlan: data.feePlan
    };

    return info;
  }
}
