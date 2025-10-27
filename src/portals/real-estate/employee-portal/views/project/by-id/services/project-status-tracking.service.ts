import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {StatusTracking, StatusTrackingSerializer} from "../domains/status-tracking.serializer";

@Injectable()
export class ProjectStatusTrackingService extends OrgResourceService<StatusTracking>{
    constructor(public override injector: Injector) { super(injector, 'projectStatusTracking', new StatusTrackingSerializer()); }
}
