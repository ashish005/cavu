import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {Bank, BankSerializer} from "../domains/bank.serializer";

@Injectable()
export class BankService extends OrgResourceService<Bank>{
    constructor(public override injector: Injector) { super(injector, 'v1/global/bank', new BankSerializer()); }
}
