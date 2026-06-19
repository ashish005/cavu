import {CanActivateFn, Router, RouterModule, ROUTES, Routes} from '@angular/router';
import {PricingInfoView} from "./views/pricing-info.view";
import {TrialBusinessView} from "./views/trial.view";
import {COMPANY_SERVICES, TrialBusinessAPIResolver} from "./services";
import {CoreLayout} from "./layouts/core.layout";
import {AppHomeView} from "./views-app/app-home.view";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {GlobalModule, TypingComponent} from "@app-global";

@NgModule({
    imports: [
        ReactiveFormsModule, CommonModule, // Add CommonModule to imports
        FormsModule, RouterModule, TypingComponent,
        RouterModule.forChild([
            {
                path: '', component: CoreLayout,
                children: [
                    { path: '', redirectTo: 'home', pathMatch: 'full'},
                    {path: 'pricing', resolve: {items: TrialBusinessAPIResolver}, component: PricingInfoView, data: { title: 'Pricing - EnRator | Plans & Pricing' }},
                    {path: 'trial', resolve: {items: TrialBusinessAPIResolver}, component: TrialBusinessView, data: { title: 'Free Trial - EnRator | Start Your Journey' }}
                ]
            }
        ]), GlobalModule
    ],
    declarations: [ CoreLayout, PricingInfoView, TrialBusinessView ],
    providers: [ COMPANY_SERVICES ]
})
export class AppCompanyModule { }

@NgModule({
    imports: [
        ReactiveFormsModule, CommonModule, // Add CommonModule to imports
        FormsModule, RouterModule, TypingComponent,
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: '', redirectTo: 'home', pathMatch: 'full'},
                    {path: 'home', component: AppHomeView, data: { title: 'Home - EnRator | Digital Transformation & IT Solutions' }},
                ]
            }
        ]), GlobalModule
    ],
    declarations: [ AppHomeView ],
    providers: [ COMPANY_SERVICES ]
})
export class OrgCompanyModule { }
