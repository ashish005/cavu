import {CoreQueryOptions, STATUS_ENUM} from "@app-global";

export class RelationTypeQueryOptions extends CoreQueryOptions {
    userMasterType: string;
    toQueryString (){
        const obj = {
            userMasterType:this.userMasterType
        };
        return super.getParamByObject(obj);
    }
}

export class RelationType {
  id: string;
  name: string;
  userTypeId: number;
  status: boolean;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;

    this.userTypeId = model.userTypeId;
    this.status = model.status || false;
  }
}

export class RelationTypeSerializer {
  fromJson(json: any): RelationType { return new RelationType(json); }
  toJson(data: any): any {
      (data.rules || []).forEach(r=> { r.status = (r.status)? STATUS_ENUM.ACTIVE : STATUS_ENUM.INACTIVE; });
      return data;
  }
}


