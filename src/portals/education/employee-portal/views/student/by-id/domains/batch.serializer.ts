import {CoreQueryOptions, CoreResource} from "@app-global";

export class StudentBatchQueryOptions extends CoreQueryOptions{
  studentId: string;
  constructor(data: any = {}){
    super(data);
  }
  override toQueryString (){
    const obj = {
      studentId: this.studentId
    };
    return super.getParamByObject(obj);
  }
}

class ChallanSummary {
    dueMonth: number;
    dueYear: number;
    advance: number;
    balance: number;
    dueFee: number;
    paid: number;
    totalFee: number;
    name: string;

    constructor(model: any = {}){
        const { dueMonth, dueYear, advance, balance, dueFee, paid, totalFee, name } = model;
        this.dueMonth = dueMonth;
        this.dueYear = dueYear;
        this.advance = advance || 0;
        this.balance = balance || 0;
        this.dueFee = dueFee || 0;
        this.paid = paid || 0;
        this.totalFee = totalFee || 0;
        this.name = name;
    }
}

export class StudentBatch extends CoreResource{
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
  orgSession: string;

  dueDate: string;
  challanSummary: ChallanSummary;
  challanStructure: Array<ChallanSummary>;

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
    this.orgSession = model.orgSession;

    this.dueDate = model.dueDate;
    this.challanSummary = new ChallanSummary(model.challanSummary || {});
    this.challanStructure = (model.challanStructure || []).map(r => new ChallanSummary(r));
  }

    get advance(){ return this.challanSummary.advance; }
    get balance(){ return this.challanSummary.balance; }
    get dueFee(){ return this.challanSummary.dueFee; }
    get paid(){ return this.challanSummary.paid; }
    get totalFee(){ return this.challanSummary.totalFee; }
}

export class StudentBatchSerializer {
  fromJson(json: any): StudentBatch { return new StudentBatch(json); }

  toJson(info: any): any {
    let data = {
      applicationFormNo: info.applicationFormNo,
      courseId: info.courseId,
      courseSectionId: info.courseSectionId,
      enrollmentDate: info.enrollmentDate,
      feeConcessionRemark: info.feeConcessionRemark,
      feeConcessionTypeId: info.feeConcessionTypeId,
      feePlanId: info.feePlanId,
      orgBatchId: info.orgBatchId,
      orgClassId: info.orgClassId,
      classSectionId: info.classSectionId,
      rollNo: info.rollNo,
      studentId: info.studentId,
    };
    return data;
  }
}
