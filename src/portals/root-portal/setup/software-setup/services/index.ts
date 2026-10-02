import {SoftwareModulesService, SoftwarePlanService} from "./software.service";
import {SoftwareSetupResolver} from "./api.resolver";

export const PAYMENT_IDENTIFIER_SERVICES = [
    SoftwareSetupResolver, SoftwarePlanService, SoftwareModulesService
];


