import {CoreResource} from "@app-global";


class StudyLevelTypeLookup {
    id: string;
    name: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
    }
}

export class FeeTypeLookup {
    id: string;
    feeTypeId: number;
    taxMapperId: number;
    studyModeTypeId: number;
    studyLevelTypeId: number;

    accountId: number;
    name: string;
    amount: number;
    rate:number;

    sortOrder: number;

    isRefundable: boolean;

    voucherTypeId: number;
    voucherConfigId: number;
    defaultTaskId: number;

    defaultFrequencyTypeId: number;
    defaultFrequencyMasterType: string;
    depositDurationType: any;

    defaultDay: number;
    defaultMonth: number;

    constructor(model: any = <any>{}) {
        const {
            id, feeTypeId, taxMapperId, studyModeTypeId, studyLevelTypeId,
            accountId, amount, rate, name, sortOrder, isRefundable,
            voucherTypeId, voucherConfigId, defaultTaskId,
            defaultFrequencyTypeId, depositDurationType, defaultFrequencyMasterType, defaultDay, defaultMonth,
        } = model;
        this.id = id;
        this.feeTypeId = feeTypeId;

        this.taxMapperId = taxMapperId;
        this.studyModeTypeId = studyModeTypeId;
        this.studyLevelTypeId = studyLevelTypeId;

        this.accountId = accountId;
        this.name = name;
        this.amount = amount;
        this.rate = rate;

        this.voucherTypeId = voucherTypeId;
        this.defaultTaskId = defaultTaskId;
        this.voucherConfigId = voucherConfigId;

        this.sortOrder = sortOrder;
        this.isRefundable = isRefundable;

        this.defaultFrequencyTypeId = defaultFrequencyTypeId;
        this.defaultFrequencyMasterType = defaultFrequencyMasterType;

        this.depositDurationType = depositDurationType;
        this.defaultDay = defaultDay;
        this.defaultMonth = defaultMonth;
    }
}

class CourseSubjectLookup {
  id: string;
  name: string;
  code: string;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.name = model.name;
    this.code = model.code;
  }
}

class CourseSectionLookup {
  id: string;
  name: string;
  code: string;
  courseId: string;
  subjects: Array<CourseSubjectLookup>;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.name = model.name;
    this.code = model.code;
    this.courseId = model.courseId;
    this.subjects = (model.subjects || []).map((r) => new CourseSubjectLookup(r));
  }
}

export class CourseLookup {
  id: string;
  name: string;
  abbreviation: string;
  duration: string;
  eligibility: string;
  created: string;
  sections: Array<CourseSectionLookup>;
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
  studyLevelName: string;
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
    this.sections = model.sections.map((r) => new CourseSectionLookup(r));
    this.countryId = model.countryId;
    this.studyModes = model.studyModes;
    this.parentId = model.parentId;
    this.orgUnitId = model.orgUnitId;
    this.studyLevelName = model.studyLevelName;
  }

  get sectionCount() {
    return (this.sections || []).length;
  }
}

export class OrgSessionLookup {
  id: string;
  name: string;
  fromYear: string;
  toYear: string;
  startDate: string;
  endDate: string;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.name = model.name;
    this.fromYear = model.fromYear;
    this.toYear = model.toYear;
    this.startDate = model.startDate;
    this.endDate = model.endDate;
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

class StudyModeTypeLookup {
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

class OrgTaskLookup {
    id: string;
    name: string;
    masterType: string;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
    }
}

class TaxMapperLookup {
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
export class FeePlanLookup extends CoreResource{
    courses: Array<CourseLookup> = [];
    //courseSection: Array<CourseSection> = [];
    orgSession: Array<OrgSessionLookup> = [];

    studyMode: Array<StudyModeTypeLookup> = [];
    studyLevel: Array<StudyLevelTypeLookup>;
    taxMapper: Array<TaxMapperLookup>;

    orgTask: Array<OrgTaskLookup> = [];
    feeTypes: Array<FeeTypeLookup> = [];

    reservationCategory: Array<any>;
    // feePenaltyTypes: Array<PenaltyTypeLookup>;

    constructor(model: any = <any>{}) {
        super();
        const {
            courses, orgSession, feeTypes, frequency,
            orgTask, studyMode, studyLevel, calculationTypes, penaltyFrequencies,
            reservationCategory, taxMapper
        } = model;
        this.courses = (courses || []).map(r => new CourseLookup(r));
        this.orgSession = (orgSession || []).map(r => new OrgSessionLookup(r));

        this.studyMode = (studyMode || []).map(r => new StudyModeTypeLookup(r));
        this.studyLevel = (studyLevel || []).map(r => new StudyLevelTypeLookup(r));
        this.taxMapper = (taxMapper || []).map(r => new TaxMapperLookup(r));

        this.orgTask = (orgTask || []).map(r => new OrgTaskLookup(r));
        this.feeTypes = (feeTypes || []).map(r => new FeeTypeLookup(r));

        this.reservationCategory = reservationCategory;
        // this.feePenaltyTypes = (feePenaltyTypes || []).map(r => new PenaltyTypeLookup(r));

    }
    getCourseByModeType(modeTypeId: any) { return (this.courses || []).filter(r => r.studyModes.indexOf(modeTypeId)>-1); }

    addFeeType=(data)=> this.feeTypes.push(new FeeTypeLookup(data));
}
export class FeePlanLookupSerializer {
  fromJson(json: any): FeePlanLookup {
    return new FeePlanLookup(json);
  }
  toJson(data: any): any { return {}; }
}
