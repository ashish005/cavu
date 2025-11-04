import {UserListSearchComponent} from "./user-list-search/user-list-search";
import {UserListComponent} from "./user-list/user-list";

import {ModulePermissionComponent} from "./module-permission/module-permission.component";
import {ModuleCeComponent} from "./module-ce/module-ce.component";
import {UserRoleCeComponent} from "./user-role-ce/user-role-ce.component";
import {
    RolePermissionManager,
    SubModulePermissionRowComponent,
    ModulePermissionRowComponent,
    RolePermissionView
} from "./role-permission-manager";

export const PERMISSION_MANAGEMENT_COMPONENT = [
    RolePermissionManager, RolePermissionView,
    ModulePermissionRowComponent, SubModulePermissionRowComponent
];

export const USER_MANAGEMENT_COMPONENT = [
    UserListSearchComponent,
    UserListComponent,
    UserRoleCeComponent, ModuleCeComponent, ModulePermissionComponent
];
