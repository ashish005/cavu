import {Injectable, Injector} from "@angular/core";
import { OrgResourceService } from "@app-global";
import {
    DutyMasterType, DutyMasterTypeSerializer,
} from "../domains/duty.serializer";

@Injectable()
export class DutyMasterService extends OrgResourceService<DutyMasterType>{
  constructor(public override injector: Injector) { super(injector, 'masterType/dutyConstraintType', new DutyMasterTypeSerializer()); }
}
