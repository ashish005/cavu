import {Routes} from "@angular/router";
import {FeeMasterLayout, Layout} from "./layout/layout";
import {FeePlanManageView} from "./views/manage.view";
import {FeePlanDetailView} from "./views/fee-plan-detail.view";
import {FeeTypeManageView} from "./views/fee-type-manage.view";
import {FeePenaltyManageView} from "./views/fee-penalty-manage.view";
import {FeeConcessionManageView} from "./views/fee-concession-manage.view";
import {FeePlanLookupService} from "./services/api.resolver";

export const FeePlanRoutes: Routes = [
    {
        path: '', component: Layout, data: {title: 'Manage Fee Plan', header:'Fee Plan'},
        resolve: {lookups: FeePlanLookupService},
        children:[
            { path: '', pathMatch: 'full', redirectTo:'manage' },
            { path: 'manage', component: FeePlanManageView }
        ]
    },
    {
        path: 'master', component: FeeMasterLayout,
        children:[
            { path: '', pathMatch: 'full', redirectTo:'feeType' },
            {
                path: 'feeType',
                data: {code: '', title: 'Fee Type', icon: 'fa fa-dashboard', header: 'Fee Type'},
                component: FeeTypeManageView
            },
            {
                path: 'penalty',
                data: {code: '', title: 'Penalty', icon: 'fa fa-dashboard', header: 'Penalty'},
                component: FeePenaltyManageView
            },
            {
                path: 'concession',
                data: {code: '', title: 'Concession', icon: 'fa fa-dashboard', header: 'Concession'},
                component: FeeConcessionManageView
            }
        ]
    }
];
export const FEE_PLAN_VIEWS = [
    Layout, FeePlanManageView, FeePlanDetailView,
    FeeMasterLayout, FeeTypeManageView, FeePenaltyManageView, FeeConcessionManageView
];