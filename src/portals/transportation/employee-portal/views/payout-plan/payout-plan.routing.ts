import {Routes} from "@angular/router";
import {PayoutLayout} from "./layout/layout";
import {VehiclePlanManageView} from "./views/vehicle-plan-manage.view";
import {PayoutPlanLookupService} from "./services/api.resolver";
import {DriverPlanManageView} from "./views/driver-plan-manage.view";

export const PayoutPlanRoutes: Routes = [
    {
        path: '', component: PayoutLayout,
        resolve: { items: PayoutPlanLookupService },
        children:[
            { path: '', pathMatch: 'full', redirectTo:'driver-plan' },
            { path: 'driver-plan', component: DriverPlanManageView, data: {title: 'Driver Payout Plan', header:'Driver Payout Plan'} },
            { path: 'vehicle-plan', component: VehiclePlanManageView, data: {title: 'Vehicle Payout Plan', header:'Vehicle Payout Plan'} }
        ]
    }
];
export const PAYOUT_PLAN_VIEWS = [
    PayoutLayout,
    DriverPlanManageView, VehiclePlanManageView
];