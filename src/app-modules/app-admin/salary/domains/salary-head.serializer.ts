import {CoreQueryOptions, CoreResource} from "@app-global";

export class SalaryHeadQueryOptions extends CoreQueryOptions{}

export class SalaryHead extends CoreResource {
  name: string;
  isDeduction: boolean;
  code: string;

  constructor(model: any = <any>{}){
    super();
    const { name, isDeduction, code } = model;

    this.name = name;
    this.isDeduction = isDeduction;
    this.code = code;
  }
}

export class SalaryHeadSerializer {
  fromJson(json: any): SalaryHead {
    return new SalaryHead(json);
  }

  toJson(data: any): any {
    let info = {
      id: data.id
    };
    return info;
  }
}
