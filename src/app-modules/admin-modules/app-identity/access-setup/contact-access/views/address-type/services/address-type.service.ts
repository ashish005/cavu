import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {AddressType, AddressTypeRule, AddressTypeSerializer} from "../domains/address-type.serializer";

@Injectable()
export class AddressTypeService extends OrgResourceService<AddressType>{
    constructor(public override injector: Injector) { super(injector, 'access-setup/addressType', new AddressTypeSerializer());}
}
