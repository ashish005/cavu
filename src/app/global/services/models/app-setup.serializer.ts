import { DateHelper } from "../../helpers/date-helper";

class OrgSoftware {
    name: string;
    description: string;
    constructor(model: any = {}) {
        const { name, description } = model;
        this.name = name;
        this.description = description;
    }
}

export class OrgOptions {
    id: number;
    passwordChangeOnFirstLoginEnabled: boolean;
    hasMultipleBranch: boolean;
    hasMultipleStudyMode: boolean;
    hasMultipleClassSection: boolean;
    hasMultipleCourseSection: boolean;

    hasMultiProjectModule: boolean;
    hasProjectWorkFlow: boolean;

    hasMultiCurrency: boolean;
    hasMultiLanguage: boolean;

    isEducational: boolean;
    isRealEstate: boolean;
    isTransportation: boolean;
    isHealthCare: boolean;
    isHospitality: boolean;
    constructor(model: any = {}) {
        const { id,
            passwordChangeOnFirstLoginEnabled,
            hasMultipleBranch,
            hasMultipleStudyMode, hasMultipleClassSection, hasMultipleCourseSection,
            hasMultiProjectModule, hasProjectWorkFlow,
            hasMultiCurrency, hasMultiLanguage,

            isEducational, isRealEstate, isTransportation, isHealthCare, isHospitality
        } = model;
        this.id = id;
        this.passwordChangeOnFirstLoginEnabled = passwordChangeOnFirstLoginEnabled;
        this.hasMultipleBranch = hasMultipleBranch;
        this.hasMultipleStudyMode = hasMultipleStudyMode;
        this.hasMultipleClassSection = hasMultipleClassSection;
        this.hasMultipleCourseSection = hasMultipleCourseSection;

        this.hasMultiProjectModule = hasMultiProjectModule;
        this.hasProjectWorkFlow = hasProjectWorkFlow;

        this.hasMultiCurrency = hasMultiCurrency;
        this.hasMultiLanguage = hasMultiLanguage;

        this.isEducational = isEducational;
        this.isRealEstate = isRealEstate;
        this.isTransportation = isTransportation;
        this.isHealthCare = isHealthCare;
        this.isHospitality = isHospitality;
    }
}

export class OrgConfigOptions {
    id: number;

    fontId:number;
    fontName: string;

    countryId:number;
    countryCode: string;

    currencyId: number;
    currencyCode: string;
    currencySymbol: string;

    languageId: number;
    cultureCode: string;
    languageName: string;

    logoDocumentId: number;
    startWeekDay:  number;

    dateFormat: string;
    dateSeparator: string;
    dateFormater: string;

    ofcStartTime: string;
    ofcEndTime: string;
    fyStartDay: number;
    fyStartMonth: number;
    fyCloseDay: number;
    fyCloseMonth: number;

    timeZone: string;
    constructor(model: any = {}){
        const {
            id,
            fontId, fontName, countryId, countryCode,
            currencyId, currencyCode, currencySymbol,
            languageId, languageName, cultureCode,
            logoDocumentId,
            startWeekDay, dateFormat, dateSeparator,
            ofcStartTime, ofcEndTime, fyStartDay, fyStartMonth, fyCloseDay, fyCloseMonth, timeZone
        } = model;
        this.id = id;

        this.fontId = fontId;
        this.fontName = fontName;

        this.countryId = countryId;
        this.countryCode = countryCode;

        this.currencyId = currencyId;
        this.currencyCode = currencyCode;
        this.currencySymbol = currencySymbol;

        this.languageId = languageId;
        this.languageName = languageName;
        this.cultureCode = cultureCode;

        this.logoDocumentId = logoDocumentId;

        this.startWeekDay = startWeekDay || 1;
        this.dateFormat = dateFormat || 'dd MMM yyyy';
        this.dateSeparator = dateSeparator || '';
        this.dateFormater =  dateSeparator ? (dateFormat || '').replace(/\s/g, dateSeparator): dateFormat;

        this.ofcStartTime  = ofcStartTime || '09:00:00';
        this.ofcEndTime = ofcEndTime || '17:00:00';

        this.fyStartDay = fyStartDay || 1;
        this.fyStartMonth = fyStartMonth || 1;

        this.fyCloseDay = fyCloseDay || 31;
        this.fyCloseMonth = fyCloseMonth || 12;
        this.timeZone = timeZone;
    }

    public hasValidConfig =(): boolean=> Boolean((this.currencyCode && this.cultureCode && this.timeZone));

    // public get assumedStartDate() { return DateHelper.toDateControlFormat(new Date()); }
    // public get assumedEndDate() {
    //     var d = new Date();
    //     var utcDate = new Date(d.getFullYear(), this.fyCloseMonth-1, this.fyCloseDay);
    //     return DateHelper.toDateControlFormat(utcDate);
    // }
}

class Org {
    id: string;

    public name: string;
    public profileId: string;
    public profileUrl: string;
    public orgAddress: string;
    public isHeadBranch: boolean;

    public countryId: number;
    public countryName: string;
    public countryCode: string;
    public softwareId: number;
    public softwareCode: string;

    public isUnderConstruction: boolean;

    public orgConfig: OrgConfigOptions;
    public branches: Array<OrgBranch>;
    public sectorMasterType: string;
    public businessMasterType: string;
    public tenantPoint: string;
    public software: OrgSoftware;
    constructor(model: any = {}){
        const {
            id, name, countryId, countryName, countryCode,
            profileId, profileUrl, orgAddress, isHeadBranch,
            isUnderConstruction, branches,
            sectorMasterType, businessMasterType,
            orgConfig, tenantPoint, softwareId, softwareCode, software
        } = model;
        this.id = id;
        this.name = name;

        this.countryId = countryId;
        this.countryName = countryName;
        this.countryCode = countryCode;
        this.softwareId = softwareId;
        this.softwareCode = softwareCode;

        this.isUnderConstruction = isUnderConstruction;

        this.profileId = profileId;
        this.profileUrl = profileUrl;
        this.orgAddress = orgAddress;
        this.isHeadBranch = isHeadBranch;
        this.sectorMasterType = sectorMasterType;
        this.businessMasterType = businessMasterType;
        this.tenantPoint = tenantPoint;

        this.branches = (branches || []).map(r => new OrgBranch(r));
        this.orgConfig = new OrgConfigOptions(orgConfig || {});
        this.software = new OrgSoftware(software || {});
    }

    public get currencyCode(){ return this.orgConfig.currencyCode; }
    public get dateFormat(){ return this.orgConfig.dateFormat; }

    public get hasValidConfig() { return this.orgConfig.hasValidConfig(); }
}

class OrgBranch {
    public id: string;

    public websiteUrl: string;
    public address: string;
    public branchCode: string;
    public branchOrgId: string;
    public contactNo1: string;
    public contactNo2: string;
    public countryId: string;
    public countryName: string;
    public emailId1: string;
    public emailId2: string;
    public taxId: string;
    public establishedDate: string;
    public isHeadBranch: boolean;
    public isSelfAdministration: boolean;
    public name: string;
    public orgUnitId: string;

    public isMasterSeedApplied: boolean;
    public isDemoSeedApplied: boolean;
    public syncInitiated: boolean;

    constructor(model: any = {}){
        this.id = model.id;
        this.websiteUrl = model.websiteUrl;
        this.address = model.address;
        this.branchCode = model.branchCode;
        this.branchOrgId = model.branchOrgId;
        this.contactNo1 = model.contactNo1;
        this.contactNo2 = model.contactNo2;
        this.countryId = model.countryId;
        this.countryName = model.countryName;
        this.emailId1 = model.emailId1;
        this.emailId2 = model.emailId2;
        this.taxId = model.taxId;
        this.establishedDate = model.establishedDate;
        this.isHeadBranch = model.isHeadBranch;
        this.isSelfAdministration = model.isSelfAdministration;
        this.name = model.name;
        this.orgUnitId = model.orgUnitId;

        this.isMasterSeedApplied = model.isMasterSeedApplied;
        this.isDemoSeedApplied = model.isDemoSeedApplied;
    }
}

class OrgRole {
  id:number;
  name: string;
  userTypeId: number;
  userType: string;

  constructor(model: any = {}){
    const { id, name, userTypeId, userType } = model;
    this.id =id;
    this.name = name;
    this.userTypeId = userTypeId;
    this.userType = userType;
  }
}

class OrgLicense {
    id:number;
    licenseNo: string;
    licenseTypeName: string;
    remark: string;
    validFrom: string;
    validityInDays: number;

    showExpiryWarning: boolean;
    licenseTypeId: number;
    softwareId: number;
    licenseMasterType: string;

    constructor(model: any = {}){
        const {
            id, licenseNo, remark, validFrom, validityInDays,
            showExpiryWarning,
            licenseTypeId, softwareId,
            licenseTypeName, licenseMasterType
        } = model;
        this.id =id;
        this.licenseNo = licenseNo;
        this.remark = remark;
        this.validFrom = validFrom;
        this.validityInDays = validityInDays;

        this.showExpiryWarning = showExpiryWarning;

        this.licenseTypeId = licenseTypeId;
        this.softwareId = softwareId;
        this.licenseTypeName = licenseTypeName;
        this.licenseMasterType = licenseMasterType;
    }
}

class OrgTheme {
  fontId:number;
  font: string;
  id: number | string;
  isBoxedLayout: boolean;
  isFixedAside: boolean;
  isFixedContent: boolean;
  isFoldedAside: boolean;
  isFullscreen: boolean;
  name: string;
  code: string;

  constructor(model: any = {}){
    const { id, name, code, fontId, font, isBoxedLayout, isFixedAside, isFixedContent, isFoldedAside, isFullscreen} = model;

    this.id = model.id;
    this.fontId = fontId;
    this.font = font;
    this.isBoxedLayout = isBoxedLayout;
    this.isFixedAside = isFixedAside;
    this.isFixedContent = isFixedContent;
    this.isFoldedAside = isFoldedAside;
    this.isFullscreen = isFullscreen;
    this.name = name;
    this.code = code;
  }
}
export class AppSetup extends Org {
  public theme: OrgTheme;
  public options: OrgOptions;
  public license: OrgLicense;
  public masterBranch: OrgBranch;
  constructor(model: any = <any>{}){
    super(model);
    const { theme, options, license } = model;
    this.theme = new OrgTheme(theme);
    this.options = new OrgOptions(options || {});
    this.license = license? new OrgLicense(license): null;
    this.masterBranch = this.getDefaultHeadBranch();
  }

    // public get isRealEstate() { return this.sectorMasterType == ORG_SECTOR.REAL_ESTATE }
    // public get isEducational() { return this.sectorMasterType == ORG_SECTOR.EDUCATION }
    // public get isHealthCare() { return this.sectorMasterType == ORG_SECTOR.HEALTH_CARE }
    // public get isHospitality() { return this.sectorMasterType == ORG_SECTOR.HOSPITALLITY }

  getDefaultHeadBranch=() => (this.branches || []).find(r => r.isHeadBranch);
  getActiveBranchById=(branchId) => (this.branches || []).find(r => r.id == branchId);
  hasValidOrgSetup=()=>(this.countryId && this.masterBranch.isMasterSeedApplied && this.orgConfig.hasValidConfig);
}
export class AppSetupSerializer {
  fromJson(json: any): AppSetup { return new AppSetup(json); }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}
