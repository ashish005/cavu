import {CoreQueryOptions, CoreResource} from "@app-global";


export class EmployeeSalaryQueryOptions extends CoreQueryOptions{}

export class EmployeeSalary extends CoreResource {
  roles: Array<any>;

  constructor(model: any = <any>{}){
    super();
    this.roles = model.roles;
  }
}

export class EmployeeSalarySerializer {
  fromJson(json: any): EmployeeSalary {
    return new EmployeeSalary(json);
  }

  toJson(data: any): any {
    let info = {
      id: data.id
    };
    return info;
  }
}
