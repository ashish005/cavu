import {CoreQueryOptions} from "@app-global";

export class StudentBatchQueryOptions extends CoreQueryOptions {
    orgUserId: string;
    constructor(data: any = {}){
        super(data);
        this.orgUserId = data.orgUserId;
    }

   override toQueryString (){
        const obj = {
            orgUserId: this.orgUserId
        };
        return super.getParamByObject(obj);
    }
}

export class MonthYearWiseBreakup {
    monthId: number;
    name: string;
    totalFee: number;
    paid: number;
    balance: number;
    dueFee: number;
    constructor(model: any = <any>{}) {
        this.monthId = model.monthId;
        this.name = model.name;
        this.totalFee = model.totalFee;
        this.paid = model.paid;
        this.balance = model.balance;
        this.dueFee = model.dueFee;
    }
}
export class FeeTypeWise {
    feeType: string;
    amount: number;
    taxAmount: number;

    constructor(model: any = <any>{}) {
        const { feeType, amount, taxAmount} = model;
        this.feeType = feeType;
        this.amount = amount;
        this.taxAmount = taxAmount;
    }

    get netPay(){
        return this.amount + this.taxAmount;
    }
}

export class FeePlanInfo {
    id: number;
    name: string;
    description: string;
    orgSessionId: number;
    courseId: number;
    courseSectionId: number;
    StudyModeTypeId: number;
    orgTaskId: number;
    feeTypeWise: Array<FeeTypeWise>;
    monthYearWise: Array<MonthYearWiseBreakup>;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.name = model.name;
        this.description = model.description;
        this.orgSessionId = model.orgSessionId;
        this.courseId = model.courseId;
        this.courseSectionId = model.courseSectionId;
        this.StudyModeTypeId = model.StudyModeTypeId;
        this.orgTaskId = model.orgTaskId;
        this.feeTypeWise = (model.feeTypeWise || []).map(r => new FeeTypeWise(r));
        this.monthYearWise = (model.monthYearWise || []).map(r => new MonthYearWiseBreakup(r));
    }

    getTotalAmount(){
        return (this.feeTypeWise || []).reduce((r, c) => {
            r += c.amount;
            return r
        }, 0);
    }
    getTotalTaxAmount(){
        return (this.feeTypeWise || []).reduce((r, c) => {
            r += c.taxAmount;
            return r
        }, 0);
    }
    getNetPay(){
        return (this.feeTypeWise || []).reduce((r, c) => {
            r += c.netPay;
            return r
        }, 0);
    }

    getSessionTotal(){
        return (this.monthYearWise || []).reduce((r, c) => {
            r += c.totalFee;
            return r
        }, 0);
    }
}

export class ChallanSummary {
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

export class StudentBatch {
    id: string;
    studentId: string;
    accountId: string; //required to generate Fee Receipt
    accountGroupId: string; //required to generate Fee Receipt
    applicationFormNo: string;
    registrationNo: string;
    rollNo: string;
    enrollmentDate: string;
    orgClassId: number;
    classSectionId: number;
    courseId: number;
    orgBatchId: number;
    orgSessionId: number;
    feePlanId: number;

    student: string;
    orgClass: string;
    classSection: string;
    course: string;
    courseSection: string;
    orgBatch: string;
    orgSession: string;
    feePlan: string;

    feeConcessionTypeId: number;
    feeConcessionRemark: string;

    dueDate: string;
    totalFee: number;
    advance: number;
    paid: number;
    balance: number;
    dueFee: number;

    challanSummary: ChallanSummary;
    feePlanInfo: FeePlanInfo;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.studentId = model.studentId;
        this.accountId = model.accountId;
        this.accountGroupId = model.accountGroupId;
        this.applicationFormNo = model.applicationFormNo;
        this.registrationNo = model.registrationNo;
        this.rollNo = model.rollNo;
        this.enrollmentDate = model.enrollmentDate;
        this.orgClassId = model.orgClassId;
        this.classSectionId = model.classSectionId;
        this.courseId = model.courseId;
        this.orgBatchId = model.orgBatchId;
        this.orgSessionId = model.orgSessionId;
        this.feePlanId = model.feePlanId;

        this.student = model.student;
        this.orgClass = model.orgClass;
        this.classSection = model.classSection;
        this.course = model.course;
        this.courseSection = model.courseSection;
        this.orgBatch = model.orgBatch;
        this.orgSession = model.orgSession;
        this.feePlan = model.feePlan;

        this.feeConcessionTypeId = model.feeConcessionTypeId;
        this.feeConcessionRemark = model.feeConcessionRemark;

        this.dueDate = model.dueDate;
        this.challanSummary = new ChallanSummary(model.challanSummary);

        this.feePlanInfo = new FeePlanInfo(model.feePlanInfo);
    }
}

export class StudentBatchSerializer {
    fromJson(json: any): StudentBatch {
        return new StudentBatch(json);
    }

    toJson(model: any): any {
        return null;
    }
}