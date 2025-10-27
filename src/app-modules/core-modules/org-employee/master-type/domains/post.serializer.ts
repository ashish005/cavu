import {CoreQueryOptions} from "@app-global";

export class PostMasterQueryOptions extends CoreQueryOptions{}

export class PostMaster {
  id: string;
  name: string;
  userRole: string;
  userRoleId: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.userRole = model.userRole;
    this.userRoleId = model.userRoleId;
  }
}

export class PostMasterSerializer {
  fromJson(json: any): PostMaster { return new PostMaster(json); }

  toJson(data: any): any { return data; }
}
