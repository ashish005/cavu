import {CoreResource} from "@app-global";

export class EmployeeSalaryLookup extends CoreResource {
  roles: Array<any>;

  constructor(model: any = <any>{}){
    super();
    this.roles = model.roles;
  }
}

export class EmployeeSalaryLookupSerializer {
  fromJson(json: any): EmployeeSalaryLookup {
    return new EmployeeSalaryLookup(json);
  }

  toJson(data: any): any {
    return {};
  }
}
