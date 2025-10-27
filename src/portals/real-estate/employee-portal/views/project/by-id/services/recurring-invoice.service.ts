import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {RecurringInvoice, RecurringInvoiceSerializer} from "../domains/recurring-invoice.serializer";

@Injectable()
export class RecurringInvoiceService extends OrgResourceService<RecurringInvoice>{
    constructor(public override injector: Injector) { super(injector, 'invoice/recurring', new RecurringInvoiceSerializer()); }
}
