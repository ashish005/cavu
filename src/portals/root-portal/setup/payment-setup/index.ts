import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {PAYMENT_GATEWAY_SERVICES} from "./services";
import {PAYMENT_GATEWAY_ENTRY_COMPONENT} from "./grid-cell";
import {PAYMENT_GATEWAY_VIEWS, PaymentGatewayRoutes} from "./payment-gateway.routing";
import {PAYMENT_GATEWAY_COMPONENT} from "./components";
import {GlobalModule} from "@app-global";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild(PaymentGatewayRoutes),
        GlobalModule
    ],
    providers: [PAYMENT_GATEWAY_SERVICES],
    declarations: [PAYMENT_GATEWAY_VIEWS, PAYMENT_GATEWAY_COMPONENT, PAYMENT_GATEWAY_ENTRY_COMPONENT]
})

export class PaymenyGatewayModule {
}
