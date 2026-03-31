import {FeePlanSchedulerActivityService} from "./fee-plan-scheduler-activity.service";
import {FeePlanService} from "./fee-plan.service";
import {FeeTypeService} from "./fee-type.service";
import {FeePenaltyTypeService} from "./fee-penalty-type.service";
import {FeeConcessionTypeService} from "./fee-concession.service";
import {FeePlanLookupService} from "./api.resolver";
import {FeePlanPluginFactory} from "./fee-plan.factory";

export const FEE_PLAN_SERVICE = [
    FeePlanService,
    FeePlanSchedulerActivityService,
    FeeTypeService, FeePenaltyTypeService, FeeConcessionTypeService,
    FeePlanLookupService, FeePlanPluginFactory
];