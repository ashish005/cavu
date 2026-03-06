import {Injectable, Injector} from "@angular/core";
import {BatchReceipt, BatchReceiptSerializer} from "../domain/batch-receipt.serializer"
import {OrgResourceService} from "@app-global";

@Injectable()
export class BatchFeeReceiptService extends OrgResourceService<BatchReceipt> {
    constructor(public override injector: Injector) { super(injector, 'FeePayment/receipt', new BatchReceiptSerializer()); }
}