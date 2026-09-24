import {BusinessAPIResolver} from "./api.resolver";
import {BusinessService, ModulePermissionService, PricingService} from "./module-permission.service";

export const BUSINESS_SERVICES = [ BusinessAPIResolver, ModulePermissionService, BusinessService, PricingService ];
