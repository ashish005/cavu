import {BusinessAPIResolver} from "./api.resolver";
import {ModulePermissionService} from "./module-permission.service";
import {BusinessService, OrgBranchService} from "./business.service";

export const BUSINESS_SERVICES = [
    BusinessAPIResolver, ModulePermissionService, BusinessService, OrgBranchService
];
