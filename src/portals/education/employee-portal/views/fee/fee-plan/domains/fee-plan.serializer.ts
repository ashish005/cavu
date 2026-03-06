import { FeeStructure, FeeStructureSerializer} from "./fee-structure.serializer";
import {CoreQueryOptions, CoreResource} from "@app-global";

export class FeePlanQueryOptions extends CoreQueryOptions{}

class FeeTypeWise {
    feeTypeName: string;
    amount: number;
    taxAmount: number;
    fineAmountPerDay: string;
    sortOrder: number;

    constructor(model: any = <any>{}) {
        const { feeTypeName, amount, taxAmount, fineAmountPerDay,  sortOrder} = model;
        this.feeTypeName = feeTypeName;
        this.amount = amount;
        this.taxAmount = taxAmount;
        this.fineAmountPerDay = fineAmountPerDay;
        this.sortOrder = sortOrder;
    }

    get netPay(){ return this.amount + this.taxAmount; }
}

export class MonthYearWise {
    monthId: number;
    name: number;
    totalFee: number;
    totalAmount: number;
    totalTax: number;
    dueFee: number;
    feeTypes: Array<FeeTypeWise>;

    constructor(model: any = <any>{}){
        const { monthId, name, totalFee, totalAmount, totalTax, feeTypes} = model;
        this.monthId = monthId;
        this.name = name;

        this.totalAmount = totalAmount;
        this.totalTax = totalTax;
        this.totalFee = totalFee;
        this.feeTypes = (feeTypes || []).map((r)=> new FeeTypeWise(r));
    }
}

export class FeePlan {
  id: string;

  name: string;
  orgSessionId: number;
  courseId: number;
  courseSectionId: number;
  studyModeTypeId: number;
  penaltyTypeId: number;

  levelTypeId: number;

  startDate: string;
  endDate: string;

  feeStructureList: Array<FeeStructure> = [];
  feeTypeWise: Array<FeeTypeWise> = [];
  monthYearWise: Array<MonthYearWise> = [];
  orgSessionName: string;
  courseName: string;
  courseSectionName: string;
  studyModeName: string;
  studyLevelName: string; //just to show

    totalAmount: number;
    totalTaxAmount: number;
    netPayAmount: number;
  constructor(model: any = <any>{}){
    const {
      id, name, orgSessionId, penaltyTypeId, courseId, courseSectionId, studyModeTypeId, levelTypeId,
        orgSessionName, orgTaskName, courseName, courseSectionName, studyModeName, studyLevelName, netPay,
        feeStructureList,
        startDate, endDate,
        feeTypeWise, monthYearWise,
        summary
    } = model;
    this.id = id;
    this.name = name;
    this.orgSessionId = orgSessionId;
    this.penaltyTypeId = penaltyTypeId;
    this.courseId = courseId;
    this.courseSectionId = courseSectionId;
    this.studyModeTypeId = studyModeTypeId;
    this.levelTypeId = levelTypeId;

    this.orgSessionName = orgSessionName;
    this.courseName = courseName;
    this.courseSectionName = courseSectionName;
    this.studyModeName = studyModeName;
    this.studyLevelName = studyLevelName;

    this.startDate = startDate;
    this.endDate = endDate;

    const { netPayAmount, totalAmount, totalTaxAmount } = summary || {};
    this.netPayAmount = netPayAmount;
    this.totalAmount = totalAmount;
    this.totalTaxAmount = totalTaxAmount;

    this.feeStructureList = (feeStructureList || []).map((r)=> new FeeStructure(r));
    this.feeTypeWise = (feeTypeWise || []).map((r)=> new FeeTypeWise(r));
    this.monthYearWise = (monthYearWise || []).map((r)=> new MonthYearWise(r));
    //this.schedularInfo = (schedularInfo || []).map((r)=> new OrgFeeTaskScheduler(r));
  }

  getTotalAmount(){
    return (this.feeTypeWise || []).reduce((r, c) => {
      r += c.amount;
      return r;
    }, 0);
  }
  getTotalTaxAmount(){
    return (this.feeTypeWise || []).reduce((r, c) => {
      r += c.taxAmount;
      return r;
    }, 0);
  }
  getNetPay(){
    return (this.feeTypeWise || []).reduce((r, c) => {
      r += c.netPay;
      return r;
    }, 0);
  }
  getSessionTotal(){
    return (this.monthYearWise || []).reduce((r, c) => {
      r += c.totalFee;
      return r;
    }, 0);
  }
}

export class FeePlanSerializer {
  fromJson(json: any): FeePlan { return new FeePlan(json); }

  toJson(data: any): any {
    return data;
    /*{
      id: data.id,
      name: data.name,
      orgSessionId: data.orgSessionId,
      courseId: data.courseId,
      courseSectionId: data.courseSectionId,
      studyModeTypeId: data.studyModeTypeId,
      feeStructureList: (data.feeStructureList || []).map((r)=> new FeeStructureSerializer().toJson(r))
    };*/
  }
}
