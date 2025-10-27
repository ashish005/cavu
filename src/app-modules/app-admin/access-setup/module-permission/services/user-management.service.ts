import {Injectable, Injector} from '@angular/core';
import { OrgResourceService } from "@app-global";
import {Role, UserRoleSerializer} from "../domains/role.model";
import {User, UserSerializer} from "../domains/user.model";
import {Permission, UserPermissionSerializer} from "../domains/permission.model";

export type RolesChangedOperation = 'add' | 'delete' | 'modify';
export interface RolesChangedEventArg { roles: Role[] | string[]; operation: RolesChangedOperation; }

@Injectable()
export class UserManagementService extends OrgResourceService<User>{
    constructor(public override injector: Injector) { super(injector, 'user-management', new UserSerializer()); }
}

@Injectable()
export class UserRoleManagementService extends OrgResourceService<Role>{
    constructor(public override injector: Injector) { super(injector, 'user-role-management', new UserRoleSerializer());}
}

@Injectable()
export class UserPermissionManagementService extends OrgResourceService<Permission>{
    constructor(public override injector: Injector) { super(injector, 'user-permission-management', new UserPermissionSerializer()); }
}

