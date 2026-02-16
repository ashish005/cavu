import {CoreResource} from "@app-global";

export class AccessSetupUserType {
    id: number;
    name: string;
    masterType: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.masterType = model.masterType;
    }
}

export class AccessSetupUserRole {
    id: number;
    name: string;
    userTypeId: number;
    userMasterType: number;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.userTypeId = model.userTypeId;
        this.userMasterType = model.userMasterType;
    }
}

export class UserAccessSetupLookup extends CoreResource {
    userTypes: Array<AccessSetupUserType>;
    userRoles: Array<AccessSetupUserRole>;

    constructor(model: any = <any>{}){
        super();
        const { userTypes, userRoles } = model || {};
        this.userTypes = (model.userTypes || []).map(r => new AccessSetupUserType(r));
        this.userRoles = (model.userRoles || []).map(r => new AccessSetupUserRole(r));
    }
}

export class UserAccessSetupLookupSerializer {
    fromJson(json: any): UserAccessSetupLookup { return new UserAccessSetupLookup(json); }
    toJson(info: any): any { return {}; }
}
