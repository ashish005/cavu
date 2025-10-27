import {CoreQueryOptions} from "@app-global";


export class DepartmentMasterQueryOptions extends CoreQueryOptions{}

export class DepartmentMaster {
  id: string;
  name: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
  }
}

export class DepartmentMasterSerializer {
  fromJson(json: any): DepartmentMaster { return new DepartmentMaster(json); }
  toJson(data: any): any { return data; }
}
