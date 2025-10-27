import {Branch, SoftwareLicense} from "./business.serializer";


export class SeedBusiness {
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
    softwareLicense: SoftwareLicense;

    orgBusinessType: string;
    orgSectorMasterType: string;
    appMasterType: string;

    hostName: string;
    isUnderConstruction: boolean;
    connectionType: string;
    connection: string;

    constructor(model: any = <any>{}) {
        const {branches, softwareLicenses, hostConfigs} = model;
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
        this.softwareLicense = new SoftwareLicense((softwareLicenses || [])[0]);

        this.orgBusinessType = model.orgBusinessType;
        this.orgSectorMasterType = model.orgSectorMasterType;
        this.appMasterType = model.appMasterType;

        const {dbConnectionType, hostName, isUnderConstruction, enable} = hostConfigs[0];
        this.connectionType = dbConnectionType;
        this.hostName = hostName;
        this.isUnderConstruction = isUnderConstruction;
    }
}

export class OrgBusinessSetupModule {
    id: string;
    name: string;
    module: string;
    type: string;
    submitted: boolean;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.module = model.module;
        this.type = model.type;
        this.submitted = false;
    }
}

