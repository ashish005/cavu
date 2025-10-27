import  { OrgResourceService } from "@app-global"
import {Injectable, Injector} from "@angular/core";
import {ScheduleLog, ScheduleLogSerializer} from "../domains/schedule-log.serializer";

@Injectable()
export class SchedulerLogService extends OrgResourceService<ScheduleLog>{
    constructor(public override injector: Injector) {
        super(injector, 'taskScheduleLog', new ScheduleLogSerializer());
    }
}
