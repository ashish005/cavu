import {CoreQueryOptions, CoreResource} from "@app-global";

export class SalaryQueryOptions extends CoreQueryOptions{}

export class Salary extends CoreResource {
  roles: Array<any>;

  constructor(model: any = <any>{}){
    super();
  }
}

export class SalarySerializer {
  fromJson(json: any): Salary {
    return new Salary(json);
  }

  toJson(data: any): any {
    let info = {
      id: data.id
    };
    return info;
  }
}
