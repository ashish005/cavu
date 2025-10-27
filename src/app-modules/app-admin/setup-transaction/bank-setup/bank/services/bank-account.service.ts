import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {Bank, BankSerializer} from "../domains/bank.serializer";
import {BankAccount, BankAccountSerializer} from "../domains/bank-account.serializer";

@Injectable()
export class BankService extends OrgResourceService<Bank>{
    constructor(public override injector: Injector) { super(injector, 'bank', new BankSerializer()); }
}

@Injectable()
export class BankAccountService extends OrgResourceService<BankAccount>{
    constructor(public override injector: Injector) { super(injector, 'bankAccount', new BankAccountSerializer()); }
}
