import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PAYMENT_PROVIDER_SERVICES} from "./services";
import {PaymentProviderView} from "./views/payment-provider.view";

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', component: PaymentProviderView
            }
        ]),
        GlobalModule
    ],
    providers: [ PAYMENT_PROVIDER_SERVICES],
    declarations: [PaymentProviderView]
})

export class PaymentProviderModule {
}
