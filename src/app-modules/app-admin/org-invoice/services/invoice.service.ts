import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {
    OrgInvoice, OrgInvoiceSerializer
} from "../domains/invoice.serializer";
import {tap} from "rxjs/operators";

@Injectable()
export class OrgInvoiceService extends OrgResourceService<OrgInvoice>{
    constructor(public override injector: Injector) { super(injector, `orgInvoice`, new OrgInvoiceSerializer()); }

    voucherConfig(voucherTypeId, form: any)
    {
        return this.httpClient.post(this.viewUrl + `/${voucherTypeId}/config`, form, this.requestHeaders)
            .pipe(
                tap(
                    (resp: any) => console.log('read logged'),
                    (error)=>{ this.handleError(error, () => this.voucherConfig(voucherTypeId, form)) }
                )
            );
    }
}
