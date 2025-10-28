import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {SUBSCRIPTION_VIEWS, SubscriptionRoutes} from "./org-subscription.routing";
import {PRICING_COMPONENT} from "./components";
import {SUBSCRIPTION_SERVICES} from "./services";
import {GlobalModule} from "@app-global";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(SubscriptionRoutes),
        GlobalModule
    ],
    providers: [SUBSCRIPTION_SERVICES],
    declarations: [SUBSCRIPTION_VIEWS, PRICING_COMPONENT]
})

export class OrgSubscriptionModule{}
