import {CoreResource} from "@app-global";


class CourseSubject {
  id: string;
  name: string;
  code: string;

  constructor(model: any = <any>{}) {
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
  subjects: Array<CourseSubject>;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.name = model.name;
    this.code = model.code;
    this.courseId = model.courseId;
    this.subjects = (model.subjects || []).map((r) => new CourseSubject(r));
  }
}

class Course {
  id: string;
  name: string;
  abbreviation: string;
  duration: string;
  eligibility: string;
  created: string;
  sections: Array<CourseSection>;
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
  studyLevel: string;
  studyModes: Array<number>;

  constructor(model: any = <any>{}) {
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
    this.sections = model.sections.map((r) => new CourseSection(r));
    this.countryId = model.countryId;
    this.studyModes = model.studyModes;
    this.parentId = model.parentId;
    this.orgUnitId = model.orgUnitId;
    this.studyLevel = model.studyLevel;
  }

  get sectionCount() {
    return (this.sections || []).length;
  }
}

class OrgSession {
  id: string;
  name: string;
  fromYear: string;
  toYear: string;
  startDate: string;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.name = model.name;
    this.fromYear = model.fromYear;
    this.toYear = model.toYear;
    this.startDate = model.startDate;
  }

  getMonthRange() {
    const _rangeInfo = new Date(this.startDate);
    var start = _rangeInfo.getMonth();
    var end = _rangeInfo.getMonth() - 1;
    var startYear = parseInt(this.fromYear);
    var endYear = parseInt(this.toYear);
    var dates = [];

    for (var i = startYear; i <= endYear; i++) {
      var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
      var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
      for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
        var month = j + 1;
        var displayMonth = month < 10 ? '0' + month : month;
        dates.push([i, displayMonth, '01'].join('-'));
      }
    }
    return dates;
  }
}

class FrequencyType {
  id: string;
  name: string;
  isFeeType: boolean;
  isPeriodType: boolean;
  masterType: string;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.name = model.name;
    this.masterType = model.masterType;
    this.isFeeType = model.isFeeType;
    this.isPeriodType = model.isPeriodType;
  }
}

class GatewayAccount {
    accountId: string;
    accountName: string;
    accountGroupId: number;
    accountGroupName: string;
    constructor(model: any = <any>{}) {
        this.accountId = model.accountId;
        this.accountName = model.accountName;
        this.accountGroupId = model.accountGroupId;
        this.accountGroupName = model.accountGroupName;
    }
}

class GatewayServiceCharge {
    id: number;
    mapperId: number;
    cardTypeId: number;
    serviceChargeRate: number;
    taxRate: number;
    trxnAmountFrom: number;
    trxnAmountTo: number;

    cardTypeName: string;
    status: string;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.mapperId = model.mapperId;
        this.cardTypeId = model.cardTypeId;
        this.serviceChargeRate = model.serviceChargeRate;

        this.taxRate = model.taxRate;
        this.trxnAmountFrom = model.trxnAmountFrom;
        this.trxnAmountTo = model.trxnAmountTo;

        this.cardTypeName = model.cardTypeName;
        this.status = model.status;
    }
}

export class PaymentModeGatewayMapper {
  id: string;
  modeId: number;
  gatewayId: number;
  isPaymentAllowed: boolean;
  isReceiptAllowed: boolean;

  gatewayName: string;
  modeName: string;

  isReferenceNoRequired: boolean;
  hasPaymentAccount: boolean;
  hasReceiptAccount: boolean;

  systemTypeId: number;
  // isMobileWallet: boolean;
  // isPOS: boolean;
  // isReconciliationRequired: boolean;
  // systemType: string;
  serviceCharges: Array<GatewayServiceCharge>;

  providerAccount: GatewayAccount;
  realizationAccount: GatewayAccount;

  constructor(model: any = {}) {
      const {
          id, gatewayId, gatewayName, modeName,
          isMobileWallet, isPOS, isPaymentAllowed, isReceiptAllowed, isReferenceNoRequired,
          hasPaymentAccount, hasReceiptAccount,
          modeId, systemTypeId,
          providerAccount, realizationAccount, serviceCharges
      } = model;

    this.id = id;
    this.modeId = modeId;
    this.gatewayId = gatewayId;
    // this.isMobileWallet = isMobileWallet;
    // this.isPOS = isPOS;
    this.isPaymentAllowed = isPaymentAllowed;
    this.isReceiptAllowed = isReceiptAllowed;
    this.isReferenceNoRequired = isReferenceNoRequired;

      this.gatewayName = gatewayName;
      this.modeName = modeName;

    this.systemTypeId = systemTypeId;
    this.providerAccount = new GatewayAccount(providerAccount);
    this.realizationAccount = new GatewayAccount(realizationAccount);
    this.serviceCharges = (serviceCharges || []).map(r => new GatewayServiceCharge(r));
  }

  get name(){ return `${this.gatewayName}: ${this.modeName}` }
}

export class VoucherSundryType {
  id: string;
  name: string;
  hasTax: boolean;
  hasVoucherCredit: boolean;
  accountId: string;
  accountGroupId: number;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.name = model.name;
    this.hasTax = model.hasTax;
    this.hasVoucherCredit = model.hasVoucherCredit;
    this.accountId = model.accountId;
    this.accountGroupId = model.accountGroupId;
  }
}

class OrgTaskScheduler {
    id: string;
    orgTaskScheduleDescription: string;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.orgTaskScheduleDescription = model.orgTaskScheduleDescription;
    }
}

class OrgTask {
    id: string;
    name: string;
    masterType: string;
    // taskType: string;
    // taskTypeId: number;
    // orgProcessId: number;
    // isManual: boolean;
    // isVerificationRequired: boolean;
    // isStatusOnMailRequired: boolean;
    // isStatusOnMailDaily: boolean;
    // isStatusOnMailWeekly: boolean;
    // isStatusOnMailMonthly: boolean;
    // verifiedByEmployee: boolean;
    // status: string;
    // nextRunTime: string;
    // lastRunTime: string;
    // lastRunResult: string;
    // createdDate: string;
    // orgTaskSchedule: Array<OrgTaskScheduler>;
    // triggers: Array<string>;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
        // this.status = model.status;
        // this.taskType = model.taskType;
        // this.nextRunTime = model.nextRunTime;
        // this.lastRunTime = model.lastRunTime;
        // this.lastRunResult = model.lastRunResult;
        // this.createdDate = model.createdDate;
        // this.orgTaskSchedule = (model.orgTaskSchedule || []).map((r)=> new OrgTaskScheduler(r));
        //
        // this.triggers = (this.orgTaskSchedule || []).reduce((prev, curr)=> {
        //     prev.push(curr.orgTaskScheduleDescription);
        //     return prev;
        // }, []);
    }
}

class Account {
    id: number;
    name: string;
    accountGroupId: number;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.accountGroupId = model.accountGroupId;
    }
}

class FeeTypeTax {
    id: number;
    feeTypeId: number;
    studyLevelTypeId: number;
    studyModeTypeId: number;
    taxMapperId: number;
    name: string;
    rate: number;
    status: any;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.feeTypeId = model.feeTypeId;
        this.studyLevelTypeId = model.studyLevelTypeId;
        this.studyModeTypeId = model.studyModeTypeId;
        this.taxMapperId = model.taxMapperId;
        this.name = model.name;
        this.rate = model.rate;
        this.status = model.status;
    }
}

class FeeType {
    id: string;
    name: string;
    amount: number;
    accountId: number;

    accountName: string;

    sortOrder: number;

    isRefundable: boolean;

    defaultFrequencyTypeId: number;
    defaultFrequencyMasterType: string;
    depositDurationType: any;

    voucherTypeId: number;
    defaultTaskId: number;
    defaultTaskName: string;

    defaultDay: number;
    defaultMonth: number;
    feeTaxes: Array<FeeTypeTax>;

    constructor(model: any = <any>{}) {
        const { defaultFrequencyTypeId, defaultDay, defaultMonth, isRefundable, sortOrder, depositDurationType, defaultFrequencyMasterType } = model;
        this.id = model.id;
        this.name = model.name;
        this.amount = model.amount;
        this.accountId = model.accountId;
        this.voucherTypeId = model.voucherTypeId;
        this.defaultTaskId = model.defaultTaskId;
        this.defaultTaskName = model.defaultTaskName;
        this.defaultFrequencyMasterType = defaultFrequencyMasterType;

        this.sortOrder = sortOrder;
        this.isRefundable = isRefundable;
        this.defaultFrequencyTypeId = defaultFrequencyTypeId;
        this.depositDurationType = depositDurationType;
        this.defaultDay = defaultDay;
        this.defaultMonth = defaultMonth;
        this.feeTaxes = (model.feeTaxes || []).map(r => new FeeTypeTax(r));
    }

    get hasEventFrequency() {
        return ('ON_EVENT' === this.defaultFrequencyMasterType);
    }
}

class FeeTax {
    id: number;
    feeTypeId: number;
    taxMapperId: number;
    studyLevelTypeId:number;
    studyModeTypeId:number;
    taxCategoryId:number;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.feeTypeId = model.feeTypeId;
        this.taxMapperId = model.taxMapperId;
        this.studyLevelTypeId = model.studyLevelTypeId;
        this.studyModeTypeId = model.studyModeTypeId;
        this.taxCategoryId = model.taxCategoryId;
    }
}

class TaxCategory {
    id: number;
    name: string;
    taxTypeName: string;
    taxTypeRateId: number;
    rate: number;
    status: boolean;
    taxMapperId: number;

    constructor(model: any = <any>{}){
        const { id, name, taxTypeName, taxTypeRateId, rate, taxMapperId, status} = model;
        this.id = id;
        this.name = name;
        this.taxTypeName = taxTypeName;
        this.taxTypeRateId = taxTypeRateId;
        this.rate = rate;
        this.taxMapperId = taxMapperId;
        this.status = status;
    }
}

export class StudyLevelType {
    id: string;
    name: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
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

export class FeeTaxType {
    id: string;
    accountId: string;
    name: string;
    parentId:number;
    rate:number;
    extraTaxRate:number;
    hasExtraTaxRate:boolean;
    supplyTypeId:number;
    supplyType:string;
    taxGroupId:number;
    taxGroup:string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.accountId = model.accountId;
        this.name = model.name;
        this.parentId = model.parentId;
        this.rate = model.rate;
        this.extraTaxRate = model.extraTaxRate;
        this.hasExtraTaxRate = model.hasExtraTaxRate;
        this.supplyTypeId = model.supplyTypeId;
        this.supplyType = model.supplyType;
        this.taxGroupId = model.taxGroupId;
        this.taxGroup = model.taxGroup;
    }
}

export class FeePaymentLookup extends CoreResource {
  courses: Array<Course> = [];
  //courseSection: Array<CourseSection> = [];
  //orgSessions: Array<OrgSession> = [];
  studyModes: Array<StudyModeType> = [];
  studyLevels: Array<StudyLevelType>;
  //frequency: Array<FrequencyType> = [];
  feeTypes: Array<FeeType> = [];
  //classes: Array<any>;
  paymentModes: Array<PaymentModeGatewayMapper> = [];
  sundryTypes: Array<VoucherSundryType> = [];
  orgTasks: Array<OrgTask> = [];

  accounts: Array<Account>;
  //taxCategories: Array<TaxCategory>;
  feeTaxes: Array<FeeTax>;

  //Fee concession types
  calculationValue: Array<any>;
  reservationCategories: Array<any>;

  constructor(model: any = <any>{}) {
    super();
    const { course, account, calculationValue, feeTax, feeType, orgTask, paymentModes, reservationCategory, studyLevel, studyMode, sundryType } = model;
    this.courses = (course || []).map(r => new Course(r));
    //this.orgSessions = (orgSession || []).map(r => new OrgSession(r));
    this.orgTasks = (orgTask || []).map(r => new OrgTask(r));
    this.studyModes = (studyMode || []).map(r => new StudyModeType(r));
    //this.frequency = (frequency || []).map(r => new FrequencyType(r));
    this.feeTypes = (feeType || []).map(r => new FeeType(r));
    //this.classes = (classes || []);
    this.sundryTypes = (sundryType || []).map(r => new VoucherSundryType(r));
    this.paymentModes = (paymentModes || []).map(r => new PaymentModeGatewayMapper(r));
    this.accounts = (account || []).map(r => new Account(r));

    this.studyLevels = (studyLevel || []).map(r => new StudyLevelType(r));
    this.feeTaxes = (feeTax || []).map(r => new FeeTax(r));
    //this.taxCategories = (taxCategory || []).map(r => new TaxCategory(r));

    this.calculationValue = calculationValue  || [];
    this.reservationCategories = reservationCategory  || [];
  }

  getCourseByCourseId = (courseId: any) => this.courses.find(r => r.id == courseId);
  getSundryTypeIdBasedOnName=(name)=> this.sundryTypes.find(r => r.name === name) || null;

  getOrgTaskForFeePlan=()=> this.orgTasks.find(r => r.masterType == "fee_collection");
  get hasStudyMode() { return (this.studyModes || []).length > 1; }

  /*getAmountAndTaxAmount(amount, feeTypeId: any, studyLevelId: string, studyModeTypeId: any) {
    let feeStructureAmount: number = parseFloat(amount);
    const feeType = this.feeType.find(r => r.id == feeTypeId) || {feeTaxes: []};
    const match = r => r.studyLevelTypeId == studyLevelId && r.studyModeTypeId == studyModeTypeId;

    // Total Tax
    const feeTaxes = (feeType.feeTaxes || []).filter(match);
    const taxAmountData: any = feeTaxes.reduce((prev, curr) => {
      prev += curr.rate;
      return prev;
    }, 0);

    const taxAmount: any = (taxAmountData * feeStructureAmount) / 100;

    return {
      feeTaxes: (feeTaxes || []).map(k => {
        return {
          id: k.id,
          name: k.taxTypeName,
          rate: k.rate,
          rateList: (k.rateList || []).map(p => {
            return { name: p.name, rate: p.rate, hasExtraTaxRate: p.hasExtraTaxRate, extraTaxRate: p.extraTaxRate, supplyType: p.supplyType };
          })
        }
      }),
      rateList: feeTaxes[0],
      taxAmount: taxAmount,
      totalAmount: feeStructureAmount + taxAmount
    };
  }*/

    // getAmountAndTaxAmount(amount, feeTypeId: any, studyLevelId: string, studyModeTypeId: any, taxMapperId: number) {
    //     const taxCategory: TaxCategory = this.taxCategories.find(r => r.taxMapperId == taxMapperId) || new TaxCategory();
    //
    //     const { id, name, taxTypeName, taxTypeRateId, rate, status} = taxCategory;
    //
    //     let _amount: number = parseFloat(amount);
    //     const taxAmount: number = (taxCategory.rate * _amount)/100;
    //
    //     const match = (r)=> r.feeTypeId == feeTypeId && r.studyLevelTypeId == studyLevelId && r.studyModeTypeId == studyModeTypeId && r.taxCategoryId  == id && r.taxMapperId  == taxMapperId;
    //     const feeTaxes: Array<FeeTax> = this.feeTaxes.filter(r => match);
    //
    //     return {
    //         taxCategory: taxCategory,
    //         feeTaxes: (feeTaxes || []).map(k => {
    //             return {
    //                 id: id,
    //                 name: taxTypeName,
    //                 rate: rate,
    //                 /*rateList: (k.rateList || []).map(p => {
    //                   return { name: p.name, rate: p.rate, hasExtraTaxRate: p.hasExtraTaxRate, extraTaxRate: p.extraTaxRate, supplyType: p.supplyType };
    //                 })*/
    //             }
    //         }),
    //         rate: taxCategory.rate,
    //         rateList: feeTaxes,
    //         taxAmount: taxAmount,
    //         totalAmount: _amount + taxAmount
    //     };
    // }

    hasAlreadyAssignedFeeTypeByLevelModeFeeTypeId(levelTypeId: number, modeTypeId: number, feeTypeId: number){
        const match = (r)=> r.feeTypeId == feeTypeId && r.studyLevelTypeId == levelTypeId && r.studyModeTypeId == modeTypeId;
        return this.feeTaxes.find(match);
    }

    //getCategoryByMapperId = (taxMapperId: number) => this.taxCategories.find(r => r.taxMapperId == taxMapperId);
    getPaymentModeById=(paymentModeId) => this.paymentModes.find(r => r.id == paymentModeId);
    getSundryTypeBasedOnId =(sundryTypeId) => this.sundryTypes.find(r => r.id == sundryTypeId);
}

export class FeePaymentLookupSerializer {
  fromJson(json: any): FeePaymentLookup { return new FeePaymentLookup(json); }
  toJson(data: any): any { return {}; }
}
