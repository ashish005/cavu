import {CoreResource} from "@app-global";

class Country{
  id: number;
  name: string;

  constructor(model: any){
    this.id = model.id;
    this.name = model.name;
  }
}

class OperatedBy{
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

  constructor(model: any = <any>{}){
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
    constructor(model: any){
        const  { id, name, code, licenseTypes, businessTypes } = model;
        this.id = id;
        this.name = `${code} : ${name}`;
        this.code = code;
        this.licenseTypes = (licenseTypes || []).map((r: any) => new SoftwareLicenseType(r));
        this.businessTypes = (businessTypes || []).map((r: any) => new BusinessType(r));
    }
}

export class BusinessLookup extends CoreResource{
  tenantTypes: BusinessType[] = [];
  country: Country[];
  operatedBy: Array<OperatedBy> = [];
  softwares: Array<Software> = [];

  constructor(model: any = <any>{}){
    super();
    const { country, softwares, tenantTypes, operatedBy } = model;
    this.country = country;
    this.tenantTypes = tenantTypes;
    this.operatedBy = (operatedBy || []).map((r: any) => new OperatedBy(r));
    //this.dbTypes = model.dbTypes;
    this.softwares = (softwares || []).map(r => new Software(r));
  }

  getSoftwareById =(softwareId: number)=> this.softwares?.find(r => r.id == softwareId);

  getLicenseTypesBySoftwareId(softwareId: number, licenseTypeId: number)
  {
    const { licenseTypes } = this.getSoftwareById(softwareId) || { licenseTypes: [] };

      let licenseType = licenseTypes?.find(r => r.id == licenseTypeId);

      if(!licenseType){
        return licenseTypes?.find(r => r.isDefault);
      }
      return licenseType;
  }
}


export class BusinessLookupSerializer {
  fromJson(json: any): BusinessLookup {
    return new BusinessLookup(json);
  }

  toJson(data: any): any {
    return {};
  }
}

