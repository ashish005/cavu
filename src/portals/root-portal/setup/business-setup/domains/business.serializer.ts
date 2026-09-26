import {CoreQueryOptions} from "@app-global";
import {BusinessHostConfig} from "./business-host.serializer";

export class GridEnhanceOptions{
  isChecked: boolean;
  constructor(model: any = <any>{}){
    this.isChecked = model.isChecked || false;
  }
}

export class BusinessQueryOptions extends CoreQueryOptions {
    countryId: string;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            countryId: this.countryId
        };
        return this.getParamByObject(obj);
    }
}

export class SoftwareLicense {
    id: number;
    softwareId: number;
    licenseNo: string;
    licenseType: string;
    licenseTypeId: number;

    softwareName: string;
    softwareCode: string;
    validityInDays: number;
    showExpiryWarning: boolean;

    constructor(model: any = <any>{}){
        const  { id, licenseNo, licenseType, licenseTypeId, softwareId, softwareName, softwareCode, validityInDays, showExpiryWarning } = model;
        this.id = id;
        this.licenseNo = licenseNo;
        this.licenseType = licenseType;
        this.licenseTypeId = licenseTypeId;
        this.softwareId = softwareId;
        this.softwareName = softwareName;
        this.softwareCode = softwareCode;
        this.validityInDays = validityInDays;
        this.showExpiryWarning = showExpiryWarning;
    }
}

export class Branch {
  id: number;
  name: string;
  orgBranchId: string;
  parentOrgUnitId: any;
  isHeadBranch: boolean;
  isLocked: boolean;
  isSelfAdministration: boolean;
  status: any;
  constructor(model: any = <any>{}) {
    const  { id, name, orgBranchId, parentOrgUnitId, isHeadBranch, isLocked, isSelfAdministration, status} = model;
    this.id = id;
    this.name = name;
    this.orgBranchId = orgBranchId;
    this.parentOrgUnitId = parentOrgUnitId;
    this.isHeadBranch = isHeadBranch;
    this.isLocked = isLocked;
    this.isSelfAdministration = isSelfAdministration;
    this.status = status;
  }
}

export class Business extends GridEnhanceOptions{
  id: string;
  name: string;
  licenseNo: string;
  validFromDate: string;
  validToDate: string;
  contactPersonEmail: string;
  contactPersonMobile: string;
  contactPersonName: string;
  referenceContact: string;
  referenceMail: string;
  referenceSource: string;
  userName: string;
  orgBusinessTypeId: number;
  businessId: string;
  countryId: string;
  isMasterData: boolean;
  isDemoData: boolean;
  demoDataText: string;
  masterDataText: string;
  orgUnitId: string;
  operatedById: number;
  createdDate: string;
  branches: Array<Branch>;
  license: SoftwareLicense;

  orgBusinessType: string;
  orgSectorMasterType: string;
  appMasterType: string;

  countryName: string;
  operatedByName: string;

  hostConfigs: Array<BusinessHostConfig>;
  constructor(model: any = <any>{}){
    super(model);
    const { branches, license, hostConfigs, operatedByName, countryName } = model;
    this.id = model.id;
    this.name = model.name;

    this.orgBusinessTypeId = model.orgBusinessTypeId;
    this.businessId = model.businessId;
    this.licenseNo = model.licenseNo;
    this.validFromDate = model.validFromDate;
    this.validToDate = model.validToDate;
    this.contactPersonEmail = model.contactPersonEmail;
    this.contactPersonMobile = model.contactPersonMobile;
    this.contactPersonName = model.contactPersonName;
    this.referenceContact = model.referenceContact;
    this.referenceMail = model.referenceMail;
    this.referenceSource = model.referenceSource;
    this.userName = model.userName;

    this.countryId = model.countryId;
    this.isMasterData = model.isMasterData;
    this.isDemoData = model.isDemoData;

    this.demoDataText = model.demoDataText;
    this.masterDataText = model.masterDataText;
    this.orgUnitId = model.orgUnitId;
    this.operatedById = model.operatedById;
    this.createdDate = model.createdDate;

    this.branches = (branches || []).map(r => new Branch(r));
    this.license = new SoftwareLicense(license);

    this.orgBusinessType = model.orgBusinessType;
    this.orgSectorMasterType = model.orgSectorMasterType;
    this.appMasterType = model.appMasterType;

    this.countryName = countryName;
    this.operatedByName = operatedByName;

    this.hostConfigs = (hostConfigs || []).map(r => new BusinessHostConfig(r));
  }
}

export class BusinessSerializer {
  fromJson(json: any): Business {
    return new Business(json);
  }

  toJson(data: any): any {
    return data;
  }
}
