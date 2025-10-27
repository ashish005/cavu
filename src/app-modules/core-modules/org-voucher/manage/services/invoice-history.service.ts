import {EventEmitter, Injectable, Injector} from "@angular/core";
import { OrgResourceService } from "@app-global";
import {InvoiceHistory, InvoiceHistorySerializer} from "../domains/invoice-history.serializer";

@Injectable()
export class InvoiceHistoryService extends OrgResourceService<InvoiceHistory> {
    constructor(public override injector: Injector) { super(injector, `invoice/history`, new InvoiceHistorySerializer()); }
}
