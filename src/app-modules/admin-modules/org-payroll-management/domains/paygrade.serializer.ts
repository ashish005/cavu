import {CoreQueryOptions, CoreResource} from "@app-global";

export class PaygradeQueryOptions extends CoreQueryOptions{}

export class Paygrade extends CoreResource {

  maxSalary: number;
  minSalary: number;
  name: string;

  constructor(model: any = <any>{}){
    super();
    const { name, minSalary, maxSalary } = model;
    this.name = name;
    this.minSalary = minSalary;
    this.maxSalary = maxSalary;
  }
}

export class PaygradeSerializer {
  fromJson(json: any): Paygrade {
    return new Paygrade(json);
  }

  toJson(data: any): any {
    let info = {
      id: data.id
    };
    return info;
  }
}
