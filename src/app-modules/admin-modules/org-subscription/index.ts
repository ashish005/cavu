import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {GlobalModule} from "@app-global";
import {SUBSCRIPTION_VIEWS, SubscriptionRoutes} from "./org-subscription.routing";
import {SUBSCRIPTION_SERVICES} from "./services";

/** Tenant subscription: license overview, plan purchase, license history and invoices. See README.md. */
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(SubscriptionRoutes),
        GlobalModule
    ],
    providers: [SUBSCRIPTION_SERVICES],
    declarations: [SUBSCRIPTION_VIEWS]
})
export class OrgSubscriptionModule {}
