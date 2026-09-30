import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PAYMENT_GATEWAY_SERVICES} from "./services";
import {PaymentGatewayLayout, PaymentSystemLayout} from "./layout/layout";
import {PaymentModeView} from "./views/payment-mode.view";
import {PaymentGatewayView} from "./views/payment-gateway.view";
import {PAYMENT_GATEWAY_COMPONENT} from "./components";
import {PAYMENT_GATEWAY_ENTRY_COMPONENT} from "./grid-cell";

const getTranslationString = (key)=> `master_type.modules.${key}`;
@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', component: PaymentGatewayLayout,
                children: [
                    {
                        path: ':code', component: PaymentSystemLayout,
                        data: { title: getTranslationString('transaction.cash.title'), header: getTranslationString('transaction.cash.header') },
                        children: [
                            { path: '', pathMatch: 'full', redirectTo: 'mode' },
                            { path: 'system', data: { title: getTranslationString('transaction.cash.title'), header: getTranslationString('transaction.cash.header')}, component: PaymentGatewayView },
                            { path: 'mode', data: { key: 'all', title: getTranslationString('transaction.cash.title'), header: getTranslationString('transaction.all.header')}, component: PaymentModeView }
                        ]
                    }
                ]
            }
        ]),
        GlobalModule
    ],
    providers: [PAYMENT_GATEWAY_SERVICES],
    declarations: [PaymentSystemLayout, PaymentGatewayLayout, PaymentModeView, PaymentGatewayView, PAYMENT_GATEWAY_COMPONENT, PAYMENT_GATEWAY_ENTRY_COMPONENT]
})

export class PaymentSystemTypeModule {
}
