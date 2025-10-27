import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {PAYOUT_PLAN_VIEWS, PayoutPlanRoutes} from "./payout-plan.routing";
import {GlobalModule} from "@app-global";
import {PAYOUT_PLAN_SERVICE} from "./services";
import {PLAN_COMPONENT} from "./components";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(PayoutPlanRoutes),
        GlobalModule
    ],
    providers: [PAYOUT_PLAN_SERVICE],
    declarations: [PAYOUT_PLAN_VIEWS, PLAN_COMPONENT]
})
export class PayoutPlanModule{}
