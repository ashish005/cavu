import {Injectable, Injector} from '@angular/core';
import { OrgResourceService } from "@app-global";
import {Vendor, VendorSerializer} from "../domains/vendor.serializer";

@Injectable()
export class SupplierManagementService extends OrgResourceService<Vendor>{
    constructor(public override injector: Injector) { super(injector, 'vendor', new VendorSerializer()); }
}
