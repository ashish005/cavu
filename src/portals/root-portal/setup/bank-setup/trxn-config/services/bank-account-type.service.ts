import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {BankAccountType, BankAccountTypeSerializer} from "../domains/bank-account-type.serializer";

@Injectable()
export class BankAccountTypeService extends OrgResourceService<BankAccountType>{
    constructor(public override injector: Injector) { super(injector, 'v1/global/BankAccountType', new BankAccountTypeSerializer()); }
}
