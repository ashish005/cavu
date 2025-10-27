import {CoreResource} from "@app-global";

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
    licenseTypes: Array<SoftwareLicenseType>;
    constructor(model: any = <any>{}){
        const  { id, name, licenseTypes } = model;
        this.id = id;
        this.name = name;
        this.licenseTypes = (licenseTypes || []).map(r => new SoftwareLicenseType(r));
    }
}

export class BusinessLookup extends CoreResource{
  tenantTypes: BusinessType[] = [];
  country: Country[];
  operatedBy: Array<{Id: number, Name: string}>[];
  dbTypes: Array<any>;
  softwares: Array<Software>;

  constructor(model: any = <any>{}){
    super();
    const { softwares } = model;
    this.country = model.country;
    this.tenantTypes = model.tenantTypes;
    this.operatedBy = model.operatedBy;
    this.dbTypes = model.dbTypes;
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

