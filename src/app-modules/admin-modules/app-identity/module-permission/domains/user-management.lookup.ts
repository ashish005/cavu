import {CoreResource} from "@app-global";

export class UserManagementLookup extends CoreResource {
    userRoles: Array<any> = [];
    modules: Array<any> = [];

    constructor(model: any = <any>{}) {
        super();
        this.userRoles = model.userRoles;
        this.modules = model.modules;
    }
}

export class UserManagementLookupSerializer {
    fromJson(json: any): UserManagementLookup { return new UserManagementLookup(json); }
    toJson(data: any): any { return {}; }
}
