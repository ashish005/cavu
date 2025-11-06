import {TrialBusinessAPIResolver} from "./api.resolver";
import {PricingService, TrialBusinessService} from "./business.service";

export {TrialBusinessAPIResolver} from "./api.resolver";
export {TrialBusinessService, PricingService} from "./business.service";

export const COMPANY_SERVICES = [TrialBusinessAPIResolver,TrialBusinessService, PricingService];
