import {PayoutPlanLookupService} from "./api.resolver";
import {DriverPayoutPlanService} from "./driver-payout-plan.service";
import {VehiclePayoutPlanService} from "./vehicle-payout-plan.service";


export const PAYOUT_PLAN_SERVICE = [
    PayoutPlanLookupService, DriverPayoutPlanService, VehiclePayoutPlanService
];