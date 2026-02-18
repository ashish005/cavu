import {CoreResource} from "@app-global";

export class SoftwareLicenseType {
    id: any;
    softwareId: number;
    name: string;
    masterType: string;
    isDefault: boolean;
    public sortOrder: string;
    constructor(model: any = <any>{}){
        const  { id, softwareId, name, masterType, isDefault, sortOrder } = model;
        this.id = id;
        this.softwareId = softwareId;
        this.name = name;
        this.isDefault = isDefault;
        this.masterType = masterType;
        this.sortOrder = sortOrder;
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

export class ModuleLookup extends CoreResource{
  softwares: Array<Software>;

  constructor(model: any = <any>{}){
    super();
    const { softwares } = model;
    this.softwares = (softwares || []).map(r => new Software(r));
  }

  getLicenseTypesBySoftwareId(softwareId, licenseTypeId)
  {
      return this.softwares?.find(r => r.id == softwareId)?.licenseTypes?.find(r => r.id == licenseTypeId);
  }
}


export class ModuleLookupSerializer {
  fromJson(json: any): ModuleLookup { return new ModuleLookup(json); }

  toJson(data: any): any {
    return {};
  }
}

