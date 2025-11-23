import {Injectable, Injector} from '@angular/core';
import  { OrgResourceService } from "@app-global";
import {Scheduler, SchedulerSerializer} from "../domains/scheduler.serializer";

@Injectable()
export class SchedulerService extends OrgResourceService<Scheduler>{
  constructor(public override injector: Injector) {
    super(injector, 'taskSchedule', new SchedulerSerializer());
  }
}
