import {EventEmitter, Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global"
import {OrgProcess, OrgProcessSerializer} from "../domains/org-process.serializer";

@Injectable()
export class OrgProcessService extends OrgResourceService<OrgProcess>{
  constructor(public override injector: Injector) {
    super(injector, 'orgProcess', new OrgProcessSerializer());
  }
}
