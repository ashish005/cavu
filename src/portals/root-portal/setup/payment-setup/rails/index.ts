import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaymentRailView} from "./views/payment-rail.view";
import {PAYMENT_RAIL_SERVICES} from "./services";
import {RailLayout, RailSubLayout} from "./layout/layout";

const getTranslationString = (key)=> `master_type.modules.${key}`;
@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', component: RailLayout,
                children: [
                    {
                        path: '', component: RailSubLayout,
                        data: { title: getTranslationString('transaction.cash.title'), header: getTranslationString('transaction.cash.header') },
                        children: [
                            { path: '', pathMatch: 'full', redirectTo: 'system' },
                            { path: 'system',
                                data: { title: getTranslationString('transaction.cash.title'), header: getTranslationString('transaction.cash.header')},
                                component: PaymentRailView
                            }
                        ]
                    }
                ]
            }
        ]),
        GlobalModule
    ],
    providers: [PAYMENT_RAIL_SERVICES],
    declarations: [RailLayout, RailSubLayout, PaymentRailView]
})

export class PaymentRailModule {
}
