import {CoreQueryOptions, STATUS_ENUM} from "@app-global";

export class RelationTypeQueryOptions extends CoreQueryOptions {
    override toQueryString (){
        const obj = {
        };
        return super.getParamByObject(obj);
    }
}

export class RelationType {
  id: string;
  name: string;
  userTypeId: number;
  userTypeName: string;
  isLocked: boolean;
  isActive: boolean;

  createdDate: string;
  modifiedDate: string;
  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.userTypeId = model.userTypeId;
    this.userTypeName = model.userTypeName;

    this.isLocked = model.isLocked;
    this.isActive = model.isActive;
    this.createdDate = model.createdDate;
    this.modifiedDate = model.modifiedDate;
  }
}

export class RelationTypeSerializer {
  fromJson(json: any): RelationType { return new RelationType(json); }
  toJson(data: any): any {
      (data.rules || []).forEach(r=> { r.status = (r.status)? STATUS_ENUM.ACTIVE : STATUS_ENUM.INACTIVE; });
      return data;
  }
}


