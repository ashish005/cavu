class Country{
  id: number;
  name: string;

  constructor(model: any){
    this.id = model.id;
    this.name = model.name;
  }
}

class BusinessType {
  id: string;
  name: string;

  constructor(model: any){
    this.id = model.id;
    this.name = model.name;
  }
}

export class SoftwareLicenseType {
    id: any;
    softwareId: number;
    name: string;
    masterType: string;
    isDefault: boolean;
    constructor(model: any = <any>{}){
        const  { id, softwareId, name, masterType, isDefault } = model;
        this.id = id;
        this.softwareId = softwareId;
        this.name = name;
        this.isDefault = isDefault;
        this.masterType = masterType;
    }
}

export class Software {
    id: number;
    name: string;
    code: string;
    licenseTypes: Array<SoftwareLicenseType>;
    businessTypes: Array<BusinessType>;
    constructor(model: any = <any>{}){
        const  { id, name, code, licenseTypes, businessTypes } = model;
        this.id = id;
        this.name = `${code} : ${name}`;
        this.code = code;
        this.licenseTypes = (licenseTypes || []).map((r: any) => new SoftwareLicenseType(r));
        this.businessTypes = (businessTypes || []).map((r: any) => new BusinessType(r));
    }
}

class OperatedBy {
  id: number;
  name: string;
  constructor(model: any = <any>{}){
    const  { id, name } = model;
    this.id = id;
    this.name = name;
  }
}

export class BusinessLookup {
  country: Country[];
  operatedBy: OperatedBy[];
  //dbTypes: Array<any>;
  softwares: Array<Software>;

  constructor(model: any = <any>{}){
    const { softwares } = model;
    this.country = model.country;
    this.operatedBy = (model.operatedBy || []).map((r: any) => new OperatedBy(r));
    //this.dbTypes = model.dbTypes;
    this.softwares = (softwares || []).map((r: any) => new Software(r));
  }

  getLicenseTypesBySoftwareId(softwareId: number, licenseTypeId: number)
  {
      return this.softwares?.find(r => r.id == softwareId)?.licenseTypes?.find((r: any) => r.id == licenseTypeId);
  }

    getBusinessTypesBySoftwareId(softwareId: number)
    {
        return this.softwares?.find((r: any) => r.id == softwareId)?.businessTypes;
    };
}

