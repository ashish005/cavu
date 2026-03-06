import {Injectable, Injector} from "@angular/core";
import {FeeSaleInvoice, FeeSaleInvoiceSerializer} from "../domain/fee-sale-invoice.serializer";
import {OrgResourceService} from "@app-global";

@Injectable()
export class FeeSaleInvoiceService extends OrgResourceService<FeeSaleInvoice>{
    constructor(public override injector: Injector) { super(injector, 'FeePayment', new FeeSaleInvoiceSerializer()); }
}