import {EventEmitter, Injectable, Injector} from "@angular/core";
import {OrgProcess, OrgProcessSerializer} from "../domains/org-process.serializer";
import {OrgResourceService} from "../../../../services";
@Injectable()
export class OrgProcessService extends OrgResourceService<OrgProcess>{
    constructor(public override injector: Injector) { super(injector, 'orgProcess', new OrgProcessSerializer()); }
}
