import {CoreQueryOptions, STATUS_ENUM} from "@app-global";

export class UserTypeQueryOptions extends CoreQueryOptions {
    userMasterType: string;
    override toQueryString (){
        const obj = {};
        return super.getParamByObject(obj);
    }
}

export class UserRole {
  id: string;
  userTypeId: number;
  name: string;
  isActive: boolean;
  isLocked: boolean;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.userTypeId = model.userTypeId;
    this.name = model.name;
    this.isActive = model.isActive || false;
    this.isLocked = model.isLocked || false;
  }
}

export class UserRelation {
    id: string;
    name: string;
    userTypeId: number;
    isLocked: boolean;
    isActive: boolean;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.userTypeId = model.userTypeId;

        this.isLocked = model.isLocked;
        this.isActive = model.isActive;
    }
}
export class UserType {
  id: number;
  name: string;
  accountGroupId: number;
  accountGroupName: string;
  isLocked: boolean;
  isActive: boolean;
  userRoles: Array<UserRole>;
  userRelations: Array<UserRelation>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
      this.accountGroupId = model.accountGroupId;
      this.accountGroupName = model.accountGroupName;
    this.userRoles = (model.userRoles || []).map(r=> new UserRole(r));
    this.userRelations = (model.userRelations || []).map(r=> new UserRelation(r));
    this.isLocked = model.isLocked || false;
      this.isActive = model.isActive || false;
  }
}
export class UserTypeSerializer {
  fromJson(json: any): UserType { return new UserType(json); }
  toJson(data: any): any { return data; }
}


