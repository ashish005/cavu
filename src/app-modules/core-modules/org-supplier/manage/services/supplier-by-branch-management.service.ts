import {Injectable, Injector} from '@angular/core';
import { OrgResourceService } from "@app-global";
import {VendorBranch, VendorBranchSerializer} from "../domains/vendor-branch.serializer";

@Injectable()
export class SupplierByBranchManagementService extends OrgResourceService<VendorBranch>{
    constructor(public override injector: Injector) { super(injector, 'supplierManagement', new VendorBranchSerializer()); }

    /*public getBranchVendorDetails(vendorId): Observable<any> {
        return this.httpClient.get(`${this.viewUrl}/vendorBranch/vendor/${vendorId}`, this.requestHeaders)
            .pipe(
                take(1),
                catchError(error=> this.handleError(error, () => this.getBranchVendorDetails(vendorId)))
            );
    }*/
}
