import {CoreResource} from "@app-global";

/*class OrgFeeTaskScheduler {
  id: string;
  orgTaskScheduleDescription: string;
  constructor(model: any = <any>{}){
    this.id = model.id;
    this.orgTaskScheduleDescription = model.orgTaskScheduleDescription;
  }
}*/

class FeeTypeWise {
  id: string;
  feeType: string;
  feeTypeId: number;
  feePlanId: number;
  amount: number;
  taxAmount: number;

  sortOrder: number;
  voucherTypeId: number;
  voucherConfigId: number;
  orgTaskScheduleId: number;
  fineAmountPerDay: number;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.feeType = model.feeType;
    this.feeTypeId = model.feeTypeId;
    this.amount = model.amount;
    this.taxAmount = model.taxAmount;
    this.sortOrder = model.sortOrder;
    this.voucherTypeId = model.voucherTypeId;
    this.voucherConfigId = model.voucherConfigId;
    this.fineAmountPerDay = model.fineAmountPerDay;
    this.orgTaskScheduleId = model.orgTaskScheduleId;
  }
}

class StudyModeType {
  id: string;
  name: string;
  parentId: number;
  isDefault: boolean;
  sortOrder: number;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.parentId = model.parentId;
    this.isDefault = model.isDefault;
    this.sortOrder = model.sortOrder;
  }
}

class ClassSection{
  id: string;
  name: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
  }
}

class Classes{
  id: number;
  name: string;
  courseId: number;
  courseSectionId: number;
  studyModeTypeId: number;

  course: string;
  studyModeType: string;
  courseSection: string;

  classSection: Array<ClassSection>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.courseId = model.courseId;
    this.courseSectionId = model.courseSectionId;
    this.studyModeTypeId = model.studyModeTypeId;

    this.course = model.course;
    this.studyModeType = model.studyModeType;
    this.courseSection = model.courseSection;

    this.classSection = (model.classSection || []).map((r)=> new ClassSection(r));
  }
}

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
class CourseSubject {
  id: string;
  name: string;
  code: string;
  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.code = model.code;
  }
}
class CourseSection {
  id: string;
  name: string;
  code: string;
  courseId: string;
  courseSectionId: string;
  subjects: Array<CourseSubject>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.code = model.code;
    this.courseId = this.courseId;
    this.courseSectionId = this.courseSectionId;
    this.subjects = (model.subjects || []).map((r)=> new CourseSubject(r));
  }
}
class Course {
  id: string;
  name: string;
  abbreviation: string;
  duration: string;
  eligibility: string;
  created: string;
  sections: Array<any>;
  studyDegreeId: number;
  studyLevelId: number;
  parentStudyLevelId: number;
  studyStreamId: number;
  studyProgramId: number;
  division: number;
  durationTerm: number;
  durationType: number;
  countryId: number;
  parentId: number;
  orgUnitId: string;
  studyModes: Array<number>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.abbreviation = model.abbreviation;
    this.duration = model.duration;
    this.eligibility = model.eligibility;
    this.division = model.division;
    this.durationTerm = model.durationTerm;
    this.durationType = model.durationType;
    this.studyDegreeId = model.studyDegreeId;
    this.studyLevelId = model.studyLevelId;
    this.parentStudyLevelId = model.parentStudyLevelId;
    this.studyStreamId = model.studyStreamId;
    this.studyProgramId = model.studyProgramId;
    this.sections = model.sections.map((r)=> new CourseSection(r));
    this.countryId = model.countryId;
    this.studyModes = model.studyModes;
    this.parentId = model.parentId;
    this.orgUnitId = model.orgUnitId;
  }

  get sectionCount(){
    return (this.sections || []).length;
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

export class FeePlan {
  id: string;
  name: string;
  orgSessionId: number;
  orgTaskId: number;
  courseId: number;
  courseSectionId: number;
  studyModeTypeId: number;
  feeTypeWise: Array<FeeTypeWise>;

  // extra
  description: string;
  netFee: number;
  netConcession: number;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.orgSessionId = model.orgSessionId;
    this.orgTaskId = model.orgTaskId;
    this.courseId = model.courseId;
    this.courseSectionId = model.courseSectionId;
    this.studyModeTypeId = model.studyModeTypeId;
    this.feeTypeWise = (model.feeTypeWise || []).map((r)=> new FeeTypeWise(r));

    this.description = model.description;
    this.netFee = model.netFee || 0;
    //this.schedularInfo = (model.schedularInfo || []).map((r)=> new OrgFeeTaskScheduler(r));
  }

  netFeeAmount(){
    return (this.feeTypeWise || []).reduce((prev, curr)=> prev + curr.amount + curr.taxAmount, 0);
  }

  netFeeAmountByConcession(feeConcession: any){
    let netFee = this.netFeeAmount();
    if(feeConcession){
      if(feeConcession.isFixedType){
        this.netConcession = feeConcession.calculationValue;
      } else {
        this.netConcession = Math.abs(netFee*feeConcession.calculationValue/100);
      }
      netFee -= this.netConcession;
    } else {
      this.netConcession = 0;
    }
    return netFee;
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

export class OrgStudentLookup extends CoreResource{
  bloodGroup: Array<BloodGroupType> = [];
  nationality: Array<NationalityType> = [];
  caste: Array<CasteType> = [];
  documentCategory: Array<DocumentCategoryType> = [];
  gender: Array<GenderType> = [];
  maritalStatus: Array<MaritalStatusType> = [];
  religion: Array<ReligionType> = [];
  reservationCategory: Array<ReservationCategoryType> = [];

  orgSession: Array<any>;
  classes: Array<Classes>;
  batch: Array<any>;
  course: Array<Course>;
  feePlan: Array<FeePlan>;
  feeConcession: Array<any>;

  employeePost: Array<EmployeePost> = [];
  dutyType: Array<DutyType>;

  roles: Array<any>;

  courseList: Array<any> = [];
  courseSection: Array<any> = [];
  classList: Array<any> = [];
  classSection: Array<any> = [];


  /* Relation Master - Begins */
  guardianMaritalStatus: Array<MaritalStatusType> = [];
  qualification: any;
  profession: any;
  department: any;
  designation: any;
  income: any;
  title: Array<any>;
  /* Relation Master - Ends */

  activeFeeConcession: any;

  constructor(model: any = <any>{}){
    super();

    this.bloodGroup = model.bloodGroup;
    this.caste = model.caste;
    this.gender = model.gender;
    this.maritalStatus = model.maritalStatus;
    this.reservationCategory = model.reservationCategory;
    this.nationality = model.nationality;
    this.religion = model.religion;
    this.guardianMaritalStatus = (this.maritalStatus || []).filter((r) => r.name.toLowerCase() != 'single');

    this.batch = model.batch;
    this.orgSession = model.orgSession;

    this.classes = model.classes;
    this.course = (model.course || []).map((r)=> new Course(r));
    //this.studyMode = (model.studyMode || []).map((r)=> new StudyModeType(r));
    this.feePlan = (model.feePlan || []).map((r)=> new FeePlan(r));
    //this.feeConcession = (model.feeConcession || []).map((r)=> new FeeConcessionTypeLookup(r));

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
    this.roles = model.roles;
  }

  public getCourseByBatchModeId(batchId: number){
    const batch = this.batch.find((r)=> r.id == batchId) || {};
    if(batch && batch.studyModeTypeId){
      return this.course.filter((r)=> (r.studyModes || []).some((ModeTypeId)=>ModeTypeId == batch.studyModeTypeId));
    }
    return this.course;
  }

  public getClassByCourseIdAndBatchId(courseId: number, batchId: number, courseSectionId: number){
    const batch = this.batch.find((r)=> r.id == batchId) || {};

    let filter = (r)=> r.courseId == courseId;
    if(batch && batch.studyModeTypeId && courseSectionId){
      filter = (r)=> r.courseId == courseId && r.studyModeTypeId == batch.studyModeTypeId && r.courseSectionId == courseSectionId;
    } else if(batch && batch.studyModeTypeId) {
      filter = (r)=> r.courseId == courseId && r.studyModeTypeId == batch.studyModeTypeId;
    } else if(courseSectionId){
      filter = (r)=> r.courseId == courseId && r.courseSectionId == courseSectionId;
    }

    return this.classes.filter(filter);
  }

  public getFeePlanByCourse(courseId: number, batchId: number, courseSectionId: number){
    const batch = this.batch.find((r)=> r.id == batchId) || {};

    let filter = (r)=> r.courseId == courseId;
    if(batch && batch.studyModeTypeId && courseSectionId){
      filter = (r)=> r.courseId == courseId && r.studyModeTypeId == batch.studyModeTypeId && r.courseSectionId == courseSectionId;
    } else if(batch && batch.studyModeTypeId) {
      filter = (r)=> r.courseId == courseId && r.studyModeTypeId == batch.studyModeTypeId;
    } else if(courseSectionId){
      filter = (r)=> r.courseId == courseId && r.courseSectionId == courseSectionId;
    }

    return this.feePlan.filter(filter);
  }

  public getFeePlanByClass(courseId, courseSectionId, classId: number){
    let classFilter = (r)=> r.id == classId && r.courseId == courseId;
    if(courseSectionId){
      classFilter = (r)=> r.id == classId && r.courseId == courseId && r.courseSectionId == courseSectionId;
    }

    const orgClass = (this.classes || []).find(classFilter) || null;

    if(orgClass){
      return this.feePlan.filter((r)=> r.courseId == orgClass.courseId && r.studyModeTypeId == orgClass.studyModeTypeId && r.courseSectionId == orgClass.courseSectionId);
    }
    return this.feePlan;
  }

  getFeePlanByConcessionType(feeConcessionTypeId: string, feePlan: Array<FeePlan>){
    const _feeConcession = (this.feeConcession || []).find((r)=> r.id == feeConcessionTypeId);
    this.activeFeeConcession  = _feeConcession;

    feePlan.map(r => {
      r.netFee = r.netFeeAmountByConcession(_feeConcession);
    });

    return feePlan;
  }
}

export class OrgStudentLookupSerializer {
  fromJson(json: any): OrgStudentLookup { return new OrgStudentLookup(json); }

  toJson(data: any): any {
    return {};
  }
}
