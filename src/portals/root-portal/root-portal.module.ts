import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {ROOT_Routes} from "./root-portal.routing";
import {Layout} from "./layout/layout";
import {DashboardView} from "./views/dashboard";
import {GlobalModule} from "@app-global";
import {BusinessManageView} from "./views/business-manage.view";
import {ReactiveFormsModule} from "@angular/forms";
import {BUSINESS_COMPONENT} from "./components/index";
import { BUSINESS_SERVICES } from './services';
import {PricingInfoView} from "./views/pricing-info.view";
import {TrialBusinessView} from "./views/trial.view";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule, GlobalModule,
        RouterModule.forChild(ROOT_Routes)
    ],
    providers: [ BUSINESS_SERVICES ],
    declarations: [Layout, DashboardView, BusinessManageView, PricingInfoView, TrialBusinessView, ...BUSINESS_COMPONENT]
})

export class RootPortalModule{
  constructor(){}
}
