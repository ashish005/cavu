import {UserManagementService} from "./user-management.service";
import {RolePermissionService, UserPermissionService} from "./role-permission.service";
import {ContactService} from "./contact.service";

export const MANAGE_USER_SERVICES = [
    UserManagementService,
    RolePermissionService,
    UserPermissionService,
    ContactService
];
