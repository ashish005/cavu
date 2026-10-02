import {CoreResource} from "@app-global";

export class SoftwareLookup {
    id: number;
    name: string;
    code: string;
    constructor(model: any){
        const  { id, name, code } = model;
        this.id = id;
        this.name = name;
        this.code = code;
    }
}

export class SoftwareSetupLookup extends CoreResource{
  softwares: Array<SoftwareLookup> = [];
  constructor(model: any = <any>{}){
    super();
    const { softwares } = model;
    this.softwares = (softwares || []).map(r => new SoftwareLookup(r));
  }

  getSoftwareByCode =(code: string)=> this.softwares?.find(r => r.code == code);
}

export class SoftwareSetupLookupSerializer {
  fromJson(json: any): SoftwareSetupLookup {
    return new SoftwareSetupLookup(json);
  }

  toJson(data: any): any {
    return {};
  }
}

