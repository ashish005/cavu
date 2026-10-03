import {BusinessAPIResolver} from "./api.resolver";
import {ModulePermissionService} from "./module-permission.service";
import {BusinessService} from "./business.service";

export const BUSINESS_SERVICES = [
    BusinessAPIResolver, ModulePermissionService, BusinessService
];
