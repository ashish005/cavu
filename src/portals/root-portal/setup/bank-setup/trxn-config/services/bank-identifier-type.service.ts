import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {BankIdentifierType, BankIdentifierTypeSerializer} from "../domains/bank-identifier-type.serializer";

@Injectable()
export class BankIdentifierTypeService extends OrgResourceService<BankIdentifierType>{
    constructor(public override injector: Injector) { super(injector, 'v1/global/BankIdentifierType', new BankIdentifierTypeSerializer()); }
}
