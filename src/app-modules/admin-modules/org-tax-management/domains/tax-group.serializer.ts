import {CoreQueryOptions} from "@app-global";
class MasterType {
  isLocked: boolean;
  status: string;
  isDeleted: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;

  constructor(model: any = <any>{}){
    this.isLocked = model.isLocked;
    this.status = model.status;
    this.isDeleted = model.isDeleted;
    this.createdBy = model.createdBy;
    this.createdDate = new Date(model.createdDate).toDateString();
    this.modifiedBy = model.modifiedBy;
    this.modifiedDate = model.modifiedDate? new Date(model.modifiedDate).toDateString(): null;
  }
}

export class TaxGroupQueryOptions extends CoreQueryOptions{}

export class TaxGroup extends MasterType {
  id: string;
  name: string;
  code: string;
  tags: boolean;

  constructor(model: any = <any>{}){
    super(model);
    const { id, name, code, tags} = model;
    this.id = id;
    this.name = name;
    this.code = code;
    this.tags = tags;
  }
}

export class TaxGroupSerializer {
  fromJson(json: any): TaxGroup {
    return new TaxGroup(json);
  }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}
