import {FeeByCommon} from "./fee-by.common";

class FeeChallanSummary {
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




export class FeeByStudentBatch extends FeeByCommon {
  //id: string;//org batch id
  studentId:string;
  studentAccountId:string;
  studentAccountGroupId:number;
  registrationNo:string;
  rollNo:string;
  enrollmentDate:string;

  orgClassId: number;
  classSectionId: number;

  courseId: number;
  courseSectionId: number;
  orgSessionId:string;
  feePlanId: number;

  studentName: string;
  courseName:string;
  courseSectionName:string;
  className:string;
  classSectionName:string;
  orgBatchName:string;
  orgSessionName:string;
  feePlanName:string;

  constructor(model: any = <any>{}){
    super(model);
    const {
      id, studentId, studentAccountId, studentAccountGroupId,
      registrationNo, rollNo, enrollmentDate,
      orgClassId, classSectionId, courseId, courseSectionId, orgSessionId, feePlanId,
      studentName, courseName, courseSectionName, className,classSectionName,orgBatchName,orgSessionName,feePlanName
    } = model;
      this.id = id;
      this.studentId = studentId;
      this.studentAccountId = studentAccountId;
      this.studentAccountGroupId = studentAccountGroupId;
      this.registrationNo = registrationNo;
      this.rollNo = rollNo;
      this.enrollmentDate = enrollmentDate;

      this.orgClassId = orgClassId;
      this.classSectionId = classSectionId;

      this.courseId = courseId;
      this.courseSectionId = courseSectionId;
      this.orgSessionId = orgSessionId;
      this.feePlanId = feePlanId;

      this.studentName = studentName;
      this.courseName = courseName;
      this.courseSectionName = courseSectionName;

      this.className = className;
      this.classSectionName = classSectionName;
      this.orgBatchName = orgBatchName;
      this.orgSessionName = orgSessionName;
      this.feePlanName = feePlanName;
  }
}

export class FeeByStudentBatchSerializer {
  fromJson(json: any): FeeByStudentBatch { return new FeeByStudentBatch(json); }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}


