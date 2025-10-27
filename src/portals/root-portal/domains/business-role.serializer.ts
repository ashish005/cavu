import {CoreQueryOptions} from "@app-global";

export class GridEnhanceOptions{
  isChecked: boolean;
  constructor(model: any = <any>{}){
    this.isChecked = model.isChecked || false;
  }
}

export class BusinessRole extends GridEnhanceOptions{
  id: string;
  name: string;

  constructor(model: any = <any>{}){
    super(model);
    this.id = model.id;
    this.name = model.name;
  }
}

export class BusinessRoleSerializer {
  fromJson(json: any): BusinessRole {
    return new BusinessRole(json);
  }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}
