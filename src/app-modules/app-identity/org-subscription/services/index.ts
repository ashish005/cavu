import {OrgLicenseHistoryService} from "./license-history.service";
import {ModulePermissionService} from "./module-permission.service";
import {OrgSoftwareInvoiceService} from "./software-invoice.service";
import {PaymentService} from "./payment.service";

export const SUBSCRIPTION_SERVICES = [
    PaymentService,
    OrgLicenseHistoryService,
    ModulePermissionService,
    OrgSoftwareInvoiceService
];