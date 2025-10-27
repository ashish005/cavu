import {Injectable, Injector} from "@angular/core";
import {Account, AccountSerializer} from "../domains/account.serializer";
import  { OrgResourceService } from "@app-global";
import {AccountGroup, AccountGroupSerializer} from "../domains/account-group.serializer";

@Injectable()
export class LedgerService extends OrgResourceService<Account>{
  constructor(public override injector: Injector) { super(injector, 'ledger', new AccountSerializer()); }
}

@Injectable()
export class AccountGroupService extends OrgResourceService<AccountGroup> {
    constructor(public override injector: Injector) { super(injector, 'accountgroup', new AccountGroupSerializer()); }
}

