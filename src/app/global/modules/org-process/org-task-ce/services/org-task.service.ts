import {EventEmitter, Injectable, Injector} from "@angular/core";
import {CoreSectorResourceService} from "../../../../core-setup";
import {map} from "rxjs";
import {OrgTask, OrgTaskSerializer} from "../domains/org-task.serializer";

@Injectable()
export class OrgTaskService extends CoreSectorResourceService<OrgTask>{
  constructor(public injector: Injector) { super(injector, 'orgTask', new OrgTaskSerializer()); }
}
