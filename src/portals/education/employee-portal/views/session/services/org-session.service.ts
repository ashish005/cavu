import {Injectable, Injector} from "@angular/core";
import {OrgSession, OrgSessionSerializer} from "../domains/session.serializer";
import  { OrgResourceService } from "@app-global"

@Injectable()
export class OrgSessionService extends OrgResourceService<OrgSession>{
    constructor(public override injector: Injector) { super(injector, 'orgSession', new OrgSessionSerializer()); }
}