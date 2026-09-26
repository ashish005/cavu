import {BusinessAPIResolver} from "./api.resolver";
import {ModulePermissionService} from "./module-permission.service";
import {BusinessService} from "./business.service";
import {PricingService} from "./pricing.service";

export const BUSINESS_SERVICES = [
    BusinessAPIResolver, ModulePermissionService, BusinessService, PricingService,
];
