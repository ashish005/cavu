import {CoreResource} from "@app-global";

export class StudentContact{
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
export class StudentAddress {
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
class StudentRelation{
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

export class StudentCommunication extends CoreResource {
  userContact: Array<StudentContact>;
  userAddress: Array<StudentAddress>;
  userRelation: Array<StudentRelation>;

  constructor(model: any = <any>{}){
    super();
    this.userContact = (model.userContact || []).map((r)=> new StudentContact(r));
    this.userAddress = (model.userAddress || []).map((r)=> new StudentAddress(r));
    this.userRelation = (model.userRelation || []).map((r)=> new StudentRelation(r));
  }
}
export class StudentCommunicationSerializer {
  fromJson(json: any): StudentCommunication {
    return new StudentCommunication(json);
  }

  toJson(data: any): any {
    return {};
  }
}
