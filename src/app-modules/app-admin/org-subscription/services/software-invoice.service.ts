import { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {
    OrgSoftwareInvoiceReceipt, OrgSoftwareInvoiceReceiptSerializer
} from "../domains/org-software-invoice.serializer";

@Injectable()
export class OrgSoftwareInvoiceService extends OrgResourceService<OrgSoftwareInvoiceReceipt>{
    constructor(public override injector: Injector) { super(injector, 'softwareInvoice', new OrgSoftwareInvoiceReceiptSerializer()); }
}
