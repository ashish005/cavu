import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PAYMENT_RAIL_SERVICES} from "./services";
import {RailLayout, RailSubLayout} from "./layout/layout";
import {RailCountryView} from "./views/rail-country.view";
import {RailCurrencyView} from "./views/rail-currency.view";
import {RailModeView} from "./views/rail-mode.view";

const getTranslationString = (key)=> `master_type.modules.${key}`;
@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', component: RailLayout,
                children: [
                    {
                        path: ':code', component: RailSubLayout,
                        data: {
                            title: getTranslationString('transaction.cash.title'),
                            header: getTranslationString('transaction.cash.header')
                        },
                        children: [
                            { path: '', pathMatch: 'full', redirectTo: 'country' },
                            {
                                path: 'country',
                                data: {
                                    title: getTranslationString('transaction.cash.title'),
                                    header: getTranslationString('transaction.cash.header')
                                }, component: RailCountryView
                            },
                            {
                                path: 'currency',
                                data: {
                                    title: getTranslationString('transaction.cash.title'),
                                    header: getTranslationString('transaction.cash.header')
                                },
                                component: RailCurrencyView
                            },
                            {
                                path: 'mode',
                                data: {
                                    title: getTranslationString('transaction.cash.title'),
                                    header: getTranslationString('transaction.cash.header')
                                },
                                component: RailModeView
                            }
                        ]
                    }
                ]
            }
        ]),
        GlobalModule
    ],
    providers: [PAYMENT_RAIL_SERVICES],
    declarations: [RailLayout, RailSubLayout, RailCountryView, RailCurrencyView, RailModeView]
})

export class PaymentRailModule {
}
