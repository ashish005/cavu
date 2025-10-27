import {Injectable, Injector} from "@angular/core";
import { OrgResourceService } from "@app-global";
import {GradeMaster, GradeMasterSerializer} from "../domains/grade.serializer";

@Injectable()
export class GradeMasterService extends OrgResourceService<GradeMaster>{
  constructor(public override injector: Injector) {
    super(injector, 'masterType/grade', new GradeMasterSerializer());
  }
}
