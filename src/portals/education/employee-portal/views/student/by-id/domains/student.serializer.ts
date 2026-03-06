import {CoreQueryOptions, CoreResource} from "@app-global";

export class StudentQueryOptions extends CoreQueryOptions{
    code: string;

    constructor(data: any = {}){
        super(data);
        this.code = data.code;
    }

   override toQueryString (){
        const obj = {
            code:this.code
        };
        return super.getParamByObject(obj);
    }
}

class FeePlanInfo {
    id: number;
    name: string;
    description: string;
    orgSessionId: number;
    courseId: number;
    courseSectionId: number;
    StudyModeTypeId: number;
    orgTaskId: number;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.name = model.name;
        this.description = model.description;
        this.orgSessionId = model.orgSessionId;
        this.courseId = model.courseId;
        this.courseSectionId = model.courseSectionId;
        this.StudyModeTypeId = model.StudyModeTypeId;
        this.orgTaskId = model.orgTaskId;
        // this.feeStructureList = (model.feeTypeWise || []).map(r => new FeeStructure(r));
        // this.feeTypeWise = (model.feeTypeWise || []).map((r)=> new FeeTypeWise(r));
        // this.monthYearWise = (model.monthYearWise || []).map(r => new MonthYearWiseBreakup(r));
    }
}

class ChallanSummary {
    totalFee: number;
    advance: number;
    paid: number;
    balance: number;
    dueFee: number;

    constructor(model: any = <any>{}) {
        this.totalFee = model.totalFee;
        this.advance = model.advance;
        this.paid = model.paid;
        this.balance = model.balance;
        this.dueFee = model.dueFee;
    }
}

class BatchCourseFee extends CoreResource{
    applicationFormNo: string;
    rollNo: string;
    enrollmentDate: Date;
    orgBatchId: number;
    courseId: number;
    courseSectionId: number;
    orgClassId: number;
    classSectionId: number;
    feePlanId: number;
    feeConcessionTypeId: number;
    feeConcessionRemark: string;
    studentId: string;
    netFee: number;

    feePlan: string;
    orgBatch: string;
    orgClass: string;
    classSection: string;
    course: string;
    courseSection: string;

    dueDate: string;
    challanSummary: ChallanSummary;
    feePlanInfo: FeePlanInfo;

    constructor(model: any = <any>{}){
        super();
        this.id = model.id;
        this.applicationFormNo = model.applicationFormNo;
        this.rollNo = model.rollNo;
        this.enrollmentDate = model.enrollmentDate;
        this.orgBatchId = model.orgBatchId;
        this.courseId = model.courseId;
        this.courseSectionId = model.courseSectionId;
        this.orgClassId = model.orgClassId;
        this.classSectionId = model.classSectionId;
        this.feePlanId = model.feePlanId;
        this.feeConcessionTypeId = model.feeConcessionTypeId;
        this.feeConcessionRemark = model.feeConcessionRemark;
        this.studentId = model.studentId;
        this.netFee = model.netFee;

        this.feePlan = model.feePlan;
        this.orgBatch = model.orgBatch;
        this.orgClass = model.orgClass;
        this.classSection = model.classSection;
        this.course = model.course;
        this.courseSection = model.courseSection;

        this.dueDate = model.dueDate;
        this.challanSummary = new ChallanSummary(model.challanSummary);
        this.feePlanInfo = new FeePlanInfo(model.feePlanInfo);
    }
}

export class Student extends CoreResource {
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
  accountGroupId: number;
  email: string;
  orgId: string;
  userId: string;
  nationalityId: number;
  phone: string;
  religion: string;
  profileId: string;
  profileUrl: string;
  //documents: Array<UserDocument>;
  batchCourseFee: Array<BatchCourseFee>;

  // joiningDate: string;
  // roles: Array<any>;
  // dutyTypeId: number;
  // postId: number;
  // userType: string;

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
    this.accountGroupId = model.accountGroupId;

    this.email = model.email;
    this.orgId = model.orgId;
    this.userId = model.userId;
    this.profileId = model.profileId;
    this.profileUrl = model.profileUrl;

    //this.documents = (model.documents || []).map((r)=> new UserDocument(r));
    this.batchCourseFee = (model.batchCourseFee || []).map((r)=> new BatchCourseFee(r));

    // this.joiningDate = model.joiningDate;
    // this.dutyTypeId = model.dutyTypeId;
    // this.postId = model.postId;
    // this.roles = model.roles;
    // this.userType = model.userType;
  }

  get name(){
    return this.fName + ' '+ this.lName;
  }
}

export class StudentSerializer {
  fromJson(json: any): Student {
    return new Student(json);
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
    //Hook for profile pic
    //info.profile.documentTypeId = 1;

    /*info['userContact'] = (data.contacts || []).map((model) => {
      let data = new UserContact(model);
      if(!data.id){
        delete data.id;
      }
      return data;
    });

    info['userAddress'] = (data.address || []).map((model) => {
      let data = new UserAddress(model);
      if(!data.id){
        delete data.id;
      }
      return data;
    }).filter((r)=> (r.pinCodeId));

    info['userRelation'] = (data.relation || []).map((model) => {
      let data = new UserRelation(model);
      if(!data.id){
        delete data.id;
      }
      return data;
    });*/

    /*info.courseInfo = (data.courseInfo || []).map((model) => {
      let data = new StudentBatch(model);
      if(!data.id){
        delete data.id;
      }
      return data;
    });*/


    return info;
  }
}
