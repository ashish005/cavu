import {UserManagementService} from "./user-management.service";
import {RolePermissionService, UserPermissionService} from "./role-permission.service";

export const MANAGE_USER_SERVICES = [ UserManagementService, RolePermissionService, UserPermissionService ];
