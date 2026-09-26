import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {BusinessAPIResolver} from "./services/api.resolver";
import {BusinessManageView} from "./views/business-manage.view";
import {PricingInfoView} from "./views/pricing-info.view";
import {TrialBusinessView} from "./views/trial.view";
import {BUSINESS_COMPONENT} from "./components";
import {BUSINESS_SERVICES} from "./services";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule, GlobalModule,
        RouterModule.forChild([
            {
                path: '', resolve: { items: BusinessAPIResolver },
                children: [
                    { path: '', pathMatch: 'full', redirectTo:'list' },
                    { path: 'list', component: BusinessManageView },
                    {path: 'pricing', component: PricingInfoView, data: { title: 'Pricing - EnRator | Plans & Pricing' }},
                    {path: 'trial', component: TrialBusinessView, data: { title: 'Free Trial - EnRator | Start Your Journey' }},
                ]
            }
        ]),
        GlobalModule
    ],
    providers: [ BUSINESS_SERVICES ],
    declarations: [BusinessManageView, PricingInfoView, TrialBusinessView, ...BUSINESS_COMPONENT]
})
export class BusinessModule {}
