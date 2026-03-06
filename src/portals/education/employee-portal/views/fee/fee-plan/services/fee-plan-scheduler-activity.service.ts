import {EventEmitter, Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {
    FeePlanSchedulerActivity,
    FeePlanSchedulerActivitySerializer
} from "../domains/fee-plan-scheduler-activity.serializer";

@Injectable()
export class FeePlanSchedulerActivityService extends OrgResourceService<FeePlanSchedulerActivity>{
  synchTask$: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(public override injector: Injector) { super(injector, 'feePlan/allByTask', new FeePlanSchedulerActivitySerializer()); }
}