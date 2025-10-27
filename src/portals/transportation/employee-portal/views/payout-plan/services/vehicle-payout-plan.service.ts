import {Injectable, Injector} from "@angular/core";
import  { CoreResourceService } from "@app-global";
import {VehiclePayoutPlan, VehiclePayoutPlanSerializer} from "../domains/vehicle-payout-plan.serializer";

@Injectable()
export class VehiclePayoutPlanService extends CoreResourceService<VehiclePayoutPlan>{
  constructor(public override injector: Injector) { super(injector, 'vehiclePayoutPlan', new VehiclePayoutPlanSerializer()); }
}
