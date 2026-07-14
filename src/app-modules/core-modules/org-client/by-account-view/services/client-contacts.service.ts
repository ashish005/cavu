import {Injectable, Injector} from '@angular/core';
import {CoreEndpointBase, OrgResourceService} from "@app-global";
import {Contact, ContactSerializer} from "../domains/contact.serializer";

@Injectable()
export class ClientContactService extends OrgResourceService<Contact>{
    constructor(public override injector: Injector) { super(injector, 'customerContact', new ContactSerializer()); }
}
