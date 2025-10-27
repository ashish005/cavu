import {TaxManagementModuleAPIResolver} from "./api-resolver.service";
import {TaxCategoryService} from "./tax-category.service";
import {TaxManagementService} from "./tax-management.service";
import {TaxTypeRateService} from "./tax-type-rate.service";

export {TaxManagementModuleAPIResolver} from "./api-resolver.service";
export {TaxCategoryService} from "./tax-category.service";
export {TaxManagementService} from "./tax-management.service";
export {TaxTypeRateService} from "./tax-type-rate.service";
export const TAX_MANAGEMENT_SERVICES = [TaxManagementModuleAPIResolver, TaxCategoryService, TaxTypeRateService, TaxManagementService];