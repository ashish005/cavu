import {CoreResource} from "@app-global";

export class OrgModuleModel extends CoreResource{
  public id: string;
  public name: string;
  public description: string;
  public parentId: number;

  constructor(model: any = {}) {
    super();
    this.id = model.id;
    this.name = model.name;
    this.description = model.description;
    this.parentId = model.parentId
  }
}

export class OrgModuleModelSerializer {
  fromJson(json: any): OrgModuleModel {
    return new OrgModuleModel(json);
  }
  toJson(model: any): any {
    return null;
  }
}
