import {Injectable, Injector} from '@angular/core';
import {Associate, AssociateSerializer} from "../domains/associate.serializer";
import  { OrgResourceService } from "@app-global";

@Injectable()
export class AssociateService extends OrgResourceService<Associate>{
    constructor(public override injector: Injector) { super(injector, 'customer/contact', new AssociateSerializer()); }
}
