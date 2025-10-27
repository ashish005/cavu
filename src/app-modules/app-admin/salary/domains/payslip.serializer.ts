import {CoreQueryOptions, CoreResource} from "@app-global";

export class PayslipQueryOptions extends CoreQueryOptions{}

export class Payslip extends CoreResource {
  roles: Array<any>;

  constructor(model: any = <any>{}){
    super();
  }
}

export class PayslipSerializer {
  fromJson(json: any): Payslip {
    return new Payslip(json);
  }

  toJson(data: any): any {
    let info = {
      id: data.id
    };
    return info;
  }
}
