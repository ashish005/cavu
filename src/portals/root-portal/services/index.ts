import {BusinessAPIResolver} from "./api.resolver";
import {BusinessService, ModulePermissionService, PricingService} from "./module-permission.service";
import {BankingSetupResolver, BankService, PaymentProviderService, PaymentSetupResolver} from "./account.service";

export const BUSINESS_SERVICES = [
    BusinessAPIResolver, ModulePermissionService, BusinessService, PricingService,
    BankingSetupResolver, PaymentSetupResolver,
    BankService, PaymentProviderService
];
