import {SupplierFacilityService} from "./vendor.service";
import {VendorByIdAPIResolver, VendorLookupResolver} from "./api.resolver";
import {SupplierExecutiveService} from "./supplier-executive.service";

export const VENDOR_SERVICES =  [
    VendorLookupResolver,
    VendorByIdAPIResolver,
    SupplierExecutiveService,
    SupplierFacilityService
];