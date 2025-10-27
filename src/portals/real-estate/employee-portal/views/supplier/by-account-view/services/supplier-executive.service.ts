import {Injectable, Injector} from '@angular/core';
import  { OrgResourceService } from "@app-global";
import {VendorExecutive, VendorExecutiveSerializer} from "../domains/vendor-executive.serializer";

@Injectable()
export class SupplierExecutiveService extends OrgResourceService<VendorExecutive>{
    constructor(public override injector: Injector) { super(injector, 'supplierExecutive', new VendorExecutiveSerializer()); }
}
