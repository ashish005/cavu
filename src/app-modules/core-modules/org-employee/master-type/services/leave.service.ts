import {Injectable, Injector} from "@angular/core";
import { OrgResourceService } from "@app-global";
import {LeaveType, LeaveTypeSerializer} from "../domains/leave-type.serializer";
import {LeaveGroup, LeaveGroupSerializer} from "../domains/leave-group.serializer";

@Injectable()
export class LeaveGroupService extends OrgResourceService<LeaveGroup>{
    constructor(public override injector: Injector) {
      super(injector, 'masterType/leaveGroup', new LeaveGroupSerializer());
    }
}

@Injectable()
export class LeaveTypeService extends OrgResourceService<LeaveType>{
    constructor(public override injector: Injector) {
      super(injector, 'masterType/leaveType', new LeaveTypeSerializer());
    }
}
