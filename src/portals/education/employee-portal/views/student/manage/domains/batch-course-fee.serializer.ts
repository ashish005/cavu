import {CoreQueryOptions, CoreResource} from "@app-global";


export class BatchCourseFeeQueryOptions extends CoreQueryOptions{
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

export class ChallanSummary {
    dueMonth: number;
    dueYear: number;
    advance: number;
    balance: number;
    dueFee: number;
    paid: number;
    totalFee: number;
    name: string;
    concession: number;
    netFee: number;
    feeStatus: string;

    constructor(model: any = {}){
        const { dueMonth, dueYear, advance, balance, dueFee, paid, totalFee, name, concession, netFee, feeStatus } = model;
        this.dueMonth = dueMonth;
        this.dueYear = dueYear;
        this.advance = advance || 0;
        this.balance = balance || 0;
        this.dueFee = dueFee || 0;
        this.paid = paid || 0;
        this.totalFee = totalFee || 0;
        this.concession = concession;
        this.netFee = netFee;
        this.name = name;
        this.feeStatus = feeStatus;
    }
}

export class BatchCourseFee extends CoreResource{
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

  feePlanName: string;
  orgBatchName: string;
  className: string;
  classSectionName: string;
  courseName: string;
  courseSectionName: string;

  challanSummary: ChallanSummary;
  challanStructure: Array<ChallanSummary>;
  feeTypeWiseSummary: Array<any>;
  feeTypeSummary: any;

  feeChallansTotal: number;
  feePlanScheduleTotal: number;

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

    this.feePlanName = model.feePlanName;
    this.orgBatchName = model.orgBatchName;
    this.className = model.className;
    this.classSectionName = model.classSectionName;
    this.courseName = model.courseName;
    this.courseSectionName = model.courseSectionName;

    this.feeChallansTotal = model.feeChallansTotal;
    this.feePlanScheduleTotal = model.feePlanScheduleTotal;

    this.challanSummary = new ChallanSummary(model.challanSummary);
    this.challanStructure = (model.challanStructure || []).map(r => new ChallanSummary(r));
    this.feeTypeWiseSummary = (model.feeTypeWiseSummary ||  []);

    this.feeTypeSummary = {
        amount: this.feeTypeWiseSummary?.reduce((result, curr)=> result+curr.amount, 0),
        taxAmount: this.feeTypeWiseSummary?.reduce((result, curr)=> result+curr.taxAmount, 0),
        concession: this.feeTypeWiseSummary?.reduce((result, curr)=> result+curr.concession, 0),
        total: this.feeTypeWiseSummary?.reduce((result, curr)=> result+curr.total, 0),
    };
  }

    get isFeeSynced(){ return (this.feePlanScheduleTotal == this.challanSummary.totalFee) && (this.feeChallansTotal == this.feePlanScheduleTotal); }

    /*get advance(){ return this.challanSummary.advance; }
    get balance(){ return this.challanSummary.balance; }
    get dueFee(){ return this.challanSummary.dueFee; }
    get paid(){ return this.challanSummary.paid; }
    get totalFee(){ return this.challanSummary.totalFee; }
    get dueDate(){ return this.challanSummary.name; }
    get concession(){ return this.challanSummary.concession; }
    get netFee(){ return this.challanSummary.netFee; }*/
}

export class BatchCourseFeeSerializer {
  fromJson(json: any): BatchCourseFee {
    return new BatchCourseFee(json);
  }

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
