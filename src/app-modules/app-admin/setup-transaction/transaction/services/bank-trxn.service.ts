import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {BankTrxn, BankTrxnSerializer} from "../domains/bank-trxn.serializer";

@Injectable()
export class BankTrxnService extends OrgResourceService<BankTrxn>{
  constructor(public override injector: Injector) { super(injector, 'integration/bank-transactions', new BankTrxnSerializer()); }
}
