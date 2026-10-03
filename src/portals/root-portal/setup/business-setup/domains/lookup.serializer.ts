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
class BusinessTypeLookup {
  id: string;
  name: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
  }
}

export class SoftwarePlanLookup {
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
    plans: Array<SoftwarePlanLookup>;
    businessTypes: Array<BusinessTypeLookup>;
    constructor(model: any){
        const  { id, name, code, plans, businessTypes } = model;
        this.id = id;
        this.name = `${code} : ${name}`;
        this.code = code;
        this.plans = (plans || []).map((r: any) => new SoftwarePlanLookup(r));
        this.businessTypes = (businessTypes || []).map((r: any) => new BusinessTypeLookup(r));
    }
}

export class BusinessLookup extends CoreResource{
  tenantTypes: BusinessTypeLookup[] = [];
  country: Country[];
  operatedBy: Array<OperatedBy> = [];
  softwares: Array<Software> = [];

  constructor(model: any = <any>{}){
    super();
    const { country, softwares, tenantTypes, operatedBy } = model;
    this.country = country;
    this.tenantTypes = tenantTypes;
    this.operatedBy = (operatedBy || []).map((r: any) => new OperatedBy(r));
    this.softwares = (softwares || []).map(r => new Software(r));
  }

  getSoftwareById =(softwareId: number)=> this.softwares?.find(r => r.id == softwareId);

  getLicenseTypesBySoftwareId(softwareId: number, planId: number)
  {
    const { plans } = this.getSoftwareById(softwareId) || { plans: [] };

      let plan = plans?.find(r => r.id == planId);

      if(!plan){
        return plans?.find(r => r.isDefault);
      }
      return plan;
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

