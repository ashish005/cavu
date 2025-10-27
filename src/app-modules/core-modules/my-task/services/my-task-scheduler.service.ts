import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {MyTaskSchedule, MyTaskScheduleSerializer} from "../domains/my-task/my-task-schedule.serializer";

@Injectable()
export class MyTaskScheduleService extends OrgResourceService<MyTaskSchedule>{
    constructor(public override injector: Injector) { super(injector, 'myOrgTask/scheduled', new MyTaskScheduleSerializer()); }
}
