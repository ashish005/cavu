import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {ContactType, ContactTypeSerializer} from "../domains/contact-type.serializer";

@Injectable()
export class ContactTypeService extends OrgResourceService<ContactType>{
    constructor(public override injector: Injector) { super(injector, 'access-setup/contactType', new ContactTypeSerializer());}
}
