import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FEE_PLAN_VIEWS, FeePlanRoutes} from "./fee-plan.routing";
import {FEE_PLAN_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {FEE_PLAN_COMPONENT} from "./components";
import {FEE_PLAN_SERVICE} from "./services";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(FeePlanRoutes),
        GlobalModule
    ],
    providers: [
        FEE_PLAN_SERVICE
    ],
    declarations: [FEE_PLAN_VIEWS, FEE_PLAN_GRID_COLUMN_CELL_COMPONENTS, FEE_PLAN_COMPONENT]
})
export class FeePlanModule{}
