import {FeePlanSchedulerActivityService} from "./fee-plan-scheduler-activity.service";
import {FeePlanService} from "./fee-plan.service";
import {FeeTypeService} from "./fee-type.service";
import {FeePenaltyTypeService} from "./fee-penalty-type.service";
import {FeeConcessionTypeService} from "./fee-concession.service";

export const FEE_PLAN_SERVICE = [
    FeePlanService,
    FeePlanSchedulerActivityService,
    FeeTypeService, FeePenaltyTypeService, FeeConcessionTypeService
];