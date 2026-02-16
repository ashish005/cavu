import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {InvoiceTrxnSerializer, InvoiceTrxn } from "../domains/invoice-trxn";

@Injectable()
export class InvoiceTrxnService extends OrgResourceService<InvoiceTrxn>{
    constructor(public override injector: Injector) { super(injector, 'invoice', new InvoiceTrxnSerializer()); }
}
