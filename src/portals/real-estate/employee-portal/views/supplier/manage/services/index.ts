import {VendorLookupResolver} from "./api.resolver";
import {SupplierByBranchManagementService} from "./supplier-by-branch-management.service";
import {SupplierManagementService} from "./supplier-management.service";

export const VENDOR_SERVICES =  [
    VendorLookupResolver,
    SupplierManagementService, SupplierByBranchManagementService
];