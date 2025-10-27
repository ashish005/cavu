import {Injectable, Injector} from '@angular/core';
import {Expense, ExpenseSerializer} from "../domains/expense.serializer";
import {Account, AccountSerializer} from "../domains/account.serializer";
import {AccountGroup, AccountGroupSerializer} from "../domains/account-group.serializer";
import  { OrgResourceService } from "@app-global"

@Injectable()
export class ExpenseVoucherService extends OrgResourceService<Expense>{
  constructor(override injector: Injector) { super(injector, 'expense', new ExpenseSerializer()); }
}

@Injectable()
export class ExpenseAccountService extends OrgResourceService<Account>{
    constructor(override injector: Injector) { super(injector, 'expense/account', new AccountSerializer()); }
}

@Injectable()
export class ExpenseAccountGroupService extends OrgResourceService<AccountGroup>{
    constructor(override injector: Injector) { super(injector, 'expense/group', new AccountGroupSerializer()); }
}
