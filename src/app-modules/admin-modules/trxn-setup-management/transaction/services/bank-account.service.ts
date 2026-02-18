import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {BankAccount, BankAccountSerializer} from "../domains/bank-account.serializer";

@Injectable()
export class BankAccountService extends OrgResourceService<BankAccount>{
    constructor(public override injector: Injector) { super(injector, 'bankAccount', new BankAccountSerializer()); }
}
