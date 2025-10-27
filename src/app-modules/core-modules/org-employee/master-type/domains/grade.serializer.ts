import {CoreQueryOptions} from "@app-global";

export class GradeMasterQueryOptions extends CoreQueryOptions{}

export class GradeMaster {
  id: string;
  name: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
  }
}

export class GradeMasterSerializer {
  fromJson(json: any): GradeMaster { return new GradeMaster(json); }

  toJson(data: any): any { return data; }
}
