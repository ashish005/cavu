import  { OrgResourceService } from "@app-global"
import {Injectable, Injector} from "@angular/core";
import {OrgClass, OrgClassSerializer} from "../domains/class.serializer";

@Injectable()
export class OrgClassService extends OrgResourceService<OrgClass>{
    constructor(public override injector: Injector){ super(injector, 'orgClass', new OrgClassSerializer());
  }
}
