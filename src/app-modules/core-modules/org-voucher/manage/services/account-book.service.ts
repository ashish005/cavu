import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {AccountBook, AccountBookSerializer} from "../domains/account-book.serializer";

@Injectable()
export class AccountBookService extends OrgResourceService<AccountBook>{
  constructor(public override injector: Injector) { super(injector, 'finance/account-book', new AccountBookSerializer()); }
}
