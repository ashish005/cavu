import {CoreResource} from "@app-global";

export class EmployeeMasterLookup extends CoreResource{
  roles: Array<{id: string, name: string}>;
  userType: Array<any>;
  constructor(model: any = <any>{}){
    super();
    this.roles = model.roles.map(r=> { return { id: r.id, name: r.name }; });
    this.userType = model.userType;
  }
}

export class EmployeeMasterLookupSerializer {
  fromJson(json: any): EmployeeMasterLookup { return new EmployeeMasterLookup(json); }
  toJson(data: any): any { return {}; }
}
