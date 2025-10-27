import {BusinessAPIResolver} from "./api.resolver";
import {BusinessService} from "./business.service";
import {ModulePermissionService} from "./module-permission.service";

export const BUSINESS_SERVICES = [ BusinessAPIResolver, BusinessService, ModulePermissionService ];
