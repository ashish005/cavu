import {FeePlanSchedulerActivityComponent} from "./fee-plan-scheduler-activity.component";
import {FeeStructureRowCeFormComponent} from "./fee-structure-row-ce-form.component";
import {PlanStructureTestComponent} from "./plan-structure-test.component";
import {FeeTaxRowCeFormComponent} from "./fee-tax-row-ce-form.component";
import {FeePlanCeComponent} from "./fee-plan-ce.component";
import {FeeTypeCeFormComponent} from "./fee-type-ce-form.component";
import {FeeConcessionCeComponent} from "./fee-concession-ce.component";
import {FeePenaltyTypeCeFormComponent} from "./fee-penalty-type-ce-form.component";

export const FEE_PLAN_COMPONENT = [
    FeePlanSchedulerActivityComponent,
    FeePlanCeComponent, FeeStructureRowCeFormComponent,
    FeeTypeCeFormComponent,
    FeeConcessionCeComponent, FeePenaltyTypeCeFormComponent,
    PlanStructureTestComponent, FeeTaxRowCeFormComponent
];