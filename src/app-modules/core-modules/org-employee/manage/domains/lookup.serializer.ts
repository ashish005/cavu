class EmployeePost {
  id: string;
  name: string;
  userRole: string;
  userRoleId: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.userRole = model.userRole;
    this.userRoleId = model.userRoleId;
  }
}
class DocumentTypeRule {
  id: string;
  userTypeId: number;
  userType: string;
  documentTypeId: number;
  isVerificationRequired: boolean;
  isMandatory: boolean;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.userTypeId = model.userTypeId;
    this.userType = model.userType;
    this.documentTypeId = model.documentTypeId;
    this.isVerificationRequired = model.isVerificationRequired;
    this.isMandatory = model.isMandatory;
  }
}
class DocumentType {
  id: string;
  name: string;
  documentCategoryId: number;
  documentRule: Array<DocumentTypeRule>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.documentCategoryId = model.documentCategoryId;
    this.documentRule = (model.documentRule || []).map(r=> new DocumentTypeRule(r));
  }
}

class BloodGroupType {
  id: string;
  name: string;

  constructor(model: any = <any>{}){

    this.id = model.id;
    this.name = model.name;
  }
}

class DutyType {
  id: string;
  name: string;
  employeeDutyRule: Array<DutyTypeRule>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.employeeDutyRule = (model.employeeDutyRule || []).map(r=> new DutyTypeRule(r));
  }
}

class DutyTypeRule {
  id: string;
  userTypeId: number;
  userType: string;
  dutyTypeId: number;
  value: any;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.userTypeId = model.userTypeId;
    this.userType = model.userType;
    this.dutyTypeId = model.dutyTypeId;
    this.value = model.value;
  }
}

class CasteType {
  id: string;
  name: string;

  constructor(model: any = <any>{}){

    this.id = model.id;
    this.name = model.name;
  }
}

class ContactType {
  id: string;
  name: string;
  contactTypeRule: Array<ContactTypeRule>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.contactTypeRule = (model.contactTypeRule || []).map(r=> new ContactTypeRule(r));
  }
}

class ContactTypeRule {
  id: string;
  isVerificationRequired: boolean;
  userTypeId: number;
  userType: string;
  isMandatory: boolean;
  status: number;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.isVerificationRequired = model.isVerificationRequired;
    this.userTypeId = model.userTypeId;
    this.userType = model.userType;
    this.isMandatory = model.isMandatory;
    this.status = model.status;
  }
}

class GenderType {
  id: string;
  name: string;

  constructor(model: any = <any>{}){

    this.id = model.id;
    this.name = model.name;
  }
}

class MaritalStatusType {
  id: string;
  name: string;

  constructor(model: any = <any>{}){

    this.id = model.id;
    this.name = model.name;
  }
}

class ReservationCategoryType {
  id: string;
  name: string;

  constructor(model: any = <any>{}){

    this.id = model.id;
    this.name = model.name;
  }
}

class RelationType {
  id: string;
  name: string;

  constructor(model: any = <any>{}){

    this.id = model.id;
    this.name = model.name;
  }
}

class NationalityType {
  id: string;
  name: string;

  constructor(model: any = <any>{}){

    this.id = model.id;
    this.name = model.name;
  }
}

class ReligionType {
  id: string;
  name: string;

  constructor(model: any = <any>{}){

    this.id = model.id;
    this.name = model.name;
  }
}

class AddressType {
  id: string;
  name: string;
  addressTypeRule: Array<AddressTypeRule>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.addressTypeRule = (model.addressTypeRule || []).map(r=> new AddressTypeRule(r));
  }
}

class EmployeeRole {
    id: string;
    name: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
    }
}

class AddressTypeRule {
  id: string;
  isVerificationRequired: boolean;
  addressTypeId: number;
  userTypeId: number;
  userType: string;
  isMandatory: boolean;
  status: number;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.isVerificationRequired = model.isVerificationRequired;
    this.userTypeId = model.userTypeId;
    this.userType = model.userType;
    this.isMandatory = model.isMandatory;
    this.status = model.status;
    this.addressTypeId = model.addressTypeId;
  }
}

export class DocumentCategoryType {
  id: string;
  name: string;
  documentTypes: DocumentType[];

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.documentTypes = (model.documentTypes || []).map((r)=> new DocumentType(r));
  }
}

export class OrgUserLookup {
  id: any;
  bloodGroup: Array<BloodGroupType> = [];
  nationality: Array<NationalityType> = [];
  caste: Array<CasteType> = [];
  documentCategory: Array<DocumentCategoryType> = [];
  gender: Array<GenderType> = [];
  maritalStatus: Array<MaritalStatusType> = [];
  religion: Array<ReligionType> = [];
  reservationCategory: Array<ReservationCategoryType> = [];

  orgSession: Array<any>;

  employeePost: Array<EmployeePost> = [];
  dutyType: Array<DutyType>;

  roles: Array<EmployeeRole>;
  qualification: any;
  profession: any;
  department: any;
  designation: any;
  income: any;
  title: Array<any>;
  /* Relation Master - Ends */

  constructor(model: any = <any>{}){

    this.bloodGroup = model.bloodGroup;
    this.caste = model.caste;
    this.gender = model.gender;
    this.maritalStatus = model.maritalStatus;
    this.reservationCategory = model.reservationCategory;
    this.nationality = model.nationality;
    this.religion = model.religion;
    this.orgSession = model.orgSession;

    const _relationMaster = model.relationMaster;
    if(_relationMaster) {
      this.qualification = _relationMaster.qualification;
      this.profession = _relationMaster.profession;
      this.department = _relationMaster.department;
      this.designation = _relationMaster.designation;
      this.income = _relationMaster.income;
      this.title = model.title;
    }

    this.documentCategory = (model.documentCategory || []).map((r)=> new DocumentCategoryType(r));

    this.employeePost  = (model.employeePost || []).map((r)=> new EmployeePost(r));
    this.dutyType  = (model.dutyType || []).map((r)=> new DutyType(r));
    this.roles = (model.roles || []).map((r)=> new EmployeeRole(r));
  }
}

export class OrgUserLookupSerializer {
  fromJson(json: any): OrgUserLookup {
    return new OrgUserLookup(json);
  }

  toJson(data: any): any {
    return {};
  }
}
