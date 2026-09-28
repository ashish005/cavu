import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {BankTransactionType, BankTransactionTypeSerializer} from "../domains/bank-transaction-type.serializer";

@Injectable()
export class BankTransactionTypeService extends OrgResourceService<BankTransactionType>{
    constructor(public override injector: Injector) { super(injector, 'v1/global/bankTransactionType', new BankTransactionTypeSerializer()); }
}
