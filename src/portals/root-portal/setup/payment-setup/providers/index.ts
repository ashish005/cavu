import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProviderLayout, ProviderSubLayout} from "./layout/layout";

import {PAYMENT_PROVIDER_SERVICES} from "./services";
import {PaymentProviderView} from "./views/payment-provider.view";
import {ProviderCountryView} from "./views/provider-country.view";
import {ProviderRailView} from "./views/provider-rail.view";

const getTranslationString = (key)=> `master_type.modules.${key}`;
@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', component: ProviderLayout,
                children: [
                    {
                        path: ':code', component: ProviderSubLayout,
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
                                }, component: ProviderCountryView
                            },
                            {
                                path: 'rail',
                                data: {
                                    title: getTranslationString('transaction.cash.title'),
                                    header: getTranslationString('transaction.cash.header')
                                },
                                component: ProviderRailView
                            }
                        ]
                    }
                ]
            }
        ]),
        GlobalModule
    ],
    providers: [ PAYMENT_PROVIDER_SERVICES],
    declarations: [
        ProviderLayout, ProviderSubLayout,
        PaymentProviderView, ProviderCountryView, ProviderRailView
    ]
})

export class PaymentProviderModule {
}
