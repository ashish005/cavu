import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {TimeTracking, TimeTrackingSerializer} from "../domains/time-tracking.serializer";

@Injectable()
export class ProjectTimeTrackingService extends OrgResourceService<TimeTracking>{
    constructor(public override injector: Injector) { super(injector, 'projectTimeTracking', new TimeTrackingSerializer()); }
}
