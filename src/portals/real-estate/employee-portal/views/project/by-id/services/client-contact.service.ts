import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {ClientContact, ClientContactSerializer} from "../domains/client-contact.serializer";

@Injectable()
export class ContactService extends OrgResourceService<ClientContact>{
    constructor(public override injector: Injector) { super(injector, 'contact', new ClientContactSerializer()); }
}
