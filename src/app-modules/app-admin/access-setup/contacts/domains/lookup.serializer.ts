import {CoreResource} from "@app-global";

export class UserRoleLookup {
    id: number | string;
    name: string;
    userTypeId: number | string;
    masterType: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.userTypeId = model.userTypeId;
        this.masterType = model.masterType;
    }
}

export class UserTypeLookup {
    id: number;
    name: string;
    masterType: string;
    isLocked: boolean;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
        this.isLocked  = model.isLocked;
    }
}
export class ContactLookup extends CoreResource{
  userTypes: Array<UserTypeLookup>;
  userRoles: Array<UserRoleLookup>;
  constructor(model: any = <any>{}){
    super();
      const { userTypes, userRoles } = model;
      this.userTypes = (userTypes || []).map(r => new UserRoleLookup(r));
      this.userRoles = (userRoles || []).map(r => new UserRoleLookup(r));
  }
  getUserTypeByKey=(masterType: string) => this.userTypes.find(r => r.masterType == masterType);
}

export class ContactLookupSerializer {
  fromJson(json: any): ContactLookup {
    return new ContactLookup(json);
  }

  toJson(data: any): any {
    return {};
  }
}
