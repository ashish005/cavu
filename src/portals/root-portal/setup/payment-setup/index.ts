import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {PAYMENT_GATEWAY_VIEWS, PaymentGatewayRoutes} from "./payment-gateway.routing";
import {GlobalModule} from "@app-global";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaymentSetupLookupAPIResolver} from "./api.resolver";

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild(PaymentGatewayRoutes),
        GlobalModule
    ],
    providers: [PaymentSetupLookupAPIResolver],
    declarations: [PAYMENT_GATEWAY_VIEWS]
})

export class PaymenyGatewayModule {
}
