import {CoreQueryOptions} from "@app-global";

export class FeeStructureQueryOptions extends CoreQueryOptions{}

export class OrgFeeTaskSchedulerQueryOptions extends CoreQueryOptions{}

export class OrgFeeTaskScheduler {
  id: string;
  feeType: string;
  orgTaskScheduleDescription: string;
  constructor(model: any = <any>{}){
    this.id = model.id;
    this.feeType = model.feeType;
    this.orgTaskScheduleDescription = model.feeType + ' ' + model.orgTaskScheduleDescription;
  }
}

export class SchedulerTarget{
  pageTitle: string;
  name: string;
  id: string;
  constructor(model: any = <any>{}){
    this.pageTitle = model.pageTitle;
    this.name = model.name;
  }


  getDetails(){
    return [this.pageTitle, this.name].join(':');
  }
}

export class OrgFeeTaskSchedulerSerializer {
  fromJson(json: any): OrgFeeTaskScheduler {
    return new OrgFeeTaskScheduler(json);
  }

  toJson(data: any): any {
    let _data = {
      id: data.id,
      name: data.name,
      startDate: data.startDate,
      startTime: data.startTime,
      endDate: data.endDate,
      endTime: data.endTime,
      frequencyTypeId: data.frequencyTypeId,
      /*Daily*/
      dayInterval: data.dayInterval || 0,
      hourInterval: data.hourInterval || 0,
      minuteInterval: data.minuteInterval || 0,
      /*Weekly*/
      weekInterval: data.weekInterval || 0,
      isAllWeekDay: data.isAllWeekDay || false,//For week and month
      WeekDayNo: data.WeekDayNo,//For week and month
      /*Monthly*/
      isAllDay: data.isAllDay || false,
      dayNo: data.dayNo,

      isAllWeek: data.isAllWeek || false,
      weekNo: data.weekNo,

      isAllMonth: data.isAllMonth || false,
      monthNo: data.monthNo,
      monthInterval: data.monthInterval || 0,

      /*On Event*/
      afterSucessOnTaskId: data.afterSucessOnTaskId || 0,
      target: data.target,
      targetLink: data.targetLink,
    };

    if(!data.id){
      delete _data.id;
    }

    return _data;
  }
}

class RateInfo {
    id: any;
    name: string;
    rate: number;
    supplyTypeId: number;
    supplyType: string;
    extraTaxRate: string;
    hasExtraTaxRate: boolean;
    status: any;
    sortOrder: number;
    parentId: number;

    constructor(model: any = <any>{}){
        const { id, name, rate, supplyTypeId, supplyType, extraTaxRate, hasExtraTaxRate, status, sortOrder, parentId } = model;
        this.id = id;
        this.name = name;
        this.rate = rate;
        this.supplyTypeId = supplyTypeId;
        this.supplyType = supplyType;
        this.extraTaxRate = extraTaxRate;
        this.hasExtraTaxRate = hasExtraTaxRate;
        this.status = hasExtraTaxRate;
        this.sortOrder = sortOrder;
        this.parentId = parentId;
    }
}

class FeeTaxesRateList {
    name: string;
    rate: number;
    rateList: Array<RateInfo>;

    constructor(model: any = <any>{}){
        const { name, rate, rateList } = model;
        this.name = name;
        this.rate = rate;
        this.rateList = (rateList || []).map(r => new RateInfo(r));
    }
}

class ScheduledInfo {
    amount: number;
    taxAmount: number;
    schDate: string;

    constructor(model: any = <any>{}){
        this.amount = model.amount;
        this.taxAmount = model.taxAmount;
        this.schDate = model.schDate;
    }

    get netPay(): any{
        return this.amount + this.taxAmount;
    }
}

export class FeeStructure {
    id: string;
    feeTypeId: number;
    amount: number;
    taxAmount: number;

    frequencyTypeId: number;
    depositDurationType: number;
    voucherTypeId: number;
    voucherConfigId: number;

    orgTaskId: number;
    orgTaskScheduleId: number;

    sortOrder: number;
    status: boolean;


    feeTypeName: string;

    orgTaskName: string;
    orgTaskScheduleDesc: any;

    //depositDurationTypeName: string;
    //periodFrequencyTypeId: number;
    dueDay: string;
    totalAmount: number;
    totalTaxAmount: number;

    //schedular from fee type

    defaultDay: number; // just  set from feetype
    defaultMonth: number;// just  set from feetype

    scheduledInfo: Array<ScheduledInfo> = [];
    feeTaxesRateList: Array<FeeTaxesRateList> = [];

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.feeTypeId = model.feeTypeId;
        this.amount = model.amount;
        this.taxAmount = model.taxAmount;

        this.orgTaskId = model.orgTaskId;
        this.orgTaskScheduleId = model.orgTaskScheduleId;
        this.frequencyTypeId = model.frequencyTypeId;
        this.depositDurationType = model.depositDurationType;
        this.voucherTypeId = model.voucherTypeId;
        this.voucherConfigId = model.voucherConfigId;

        this.sortOrder = model.sortOrder;
        this.status = model.status;
        this.orgTaskName = model.defaultTaskName;
        this.orgTaskScheduleDesc = model.orgTaskScheduleDesc;
        //this.depositDurationTypeName = model.depositDurationTypeName;
        this.feeTypeName = model.feeTypeName;

        this.dueDay = model.dueDay;
        this.totalAmount = model.totalAmount;
        this.totalTaxAmount = model.totalTaxAmount;
        this.scheduledInfo = (model.scheduledInfo || []).map(r => new ScheduledInfo(r));
        this.feeTaxesRateList = (model.feeTaxesRateList || []).map(r => new FeeTaxesRateList(r));

        this.defaultDay = model.defaultDay;
        this.defaultMonth  = model.defaultMonth;
    }

    get netAmount (){ return this.totalAmount + this.totalTaxAmount; }
}

export class FeeStructureSerializer {
  fromJson(json: any): FeeStructure {
    return new FeeStructure(json);
  }

  toJson(data: any): any { return data;
    /*let _data = {
      id: data.id,
      amount: data.amount,
      taxAmount: data.taxAmount,
      dueDay: data.dueDay,
      //dueOnOrgTaskId: data.dueOnOrgTaskId,
      orgTaskScheduleId: data.orgTaskScheduleId,
      feeTypeId: data.feeTypeId,
      fineAmountPerDay: data.fineAmountPerDay,
      orgTaskSchedule: null
    };
    if(data.orgTaskSchedule){
      _data.orgTaskSchedule = new OrgFeeTaskSchedulerSerializer().toJson(data.orgTaskSchedule);
    }

    if(!data.id){
      delete _data.id;
    }

    return _data;*/
  }
}
