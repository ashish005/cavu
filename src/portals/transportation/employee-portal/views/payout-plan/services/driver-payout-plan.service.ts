import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {DriverPayoutPlan, DriverPayoutPlanSerializer} from "../domains/driver-payout-plan.serializer";

@Injectable()
export class DriverPayoutPlanService extends OrgResourceService<DriverPayoutPlan>{
  constructor(public override injector: Injector) { super(injector, 'driverPayoutPlan', new DriverPayoutPlanSerializer()); }
}
