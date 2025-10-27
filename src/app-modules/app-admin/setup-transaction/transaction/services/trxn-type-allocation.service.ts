import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {
    TrxnTypeAllocation,
    TrxnTypeAllocationSerializer
} from "../domains/trxn-type-allocation.serializer";

@Injectable()
export class TrxnTypeAllocationService extends OrgResourceService<TrxnTypeAllocation>{
  constructor(public override injector: Injector) { super(injector, 'transactionTypeAllocation', new TrxnTypeAllocationSerializer()); }
}
