import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {MyTaskScheduleLog, MyTaskScheduleLogSerializer} from "../domains/my-task/my-task-schedule-log.serializer";

@Injectable()
export class MyTaskSchedulerLogService extends OrgResourceService<MyTaskScheduleLog>{
    constructor(public override injector: Injector) { super(injector, 'myOrgTask/scheduleLog', new MyTaskScheduleLogSerializer()); }
}
