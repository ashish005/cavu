import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InstrumentTypeLayout, InstrumentTypeSubLayout} from "./layout/layout";

import {PAYMENT_INSTRUMENT_SERVICES} from "./services";
import {InstrumentCountryView} from "./views/instrument-country.view";

const getTranslationString = (key)=> `master_type.modules.${key}`;
@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', component: InstrumentTypeLayout,
                children: [
                    {
                        path: ':code', component: InstrumentTypeSubLayout,
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
                                }, component: InstrumentCountryView
                            }
                        ]
                    }
                ]
            }
        ]),
        GlobalModule
    ],
    providers: [ PAYMENT_INSTRUMENT_SERVICES ],
    declarations: [
        InstrumentTypeLayout, InstrumentTypeSubLayout,
        InstrumentCountryView
    ]
})

export class BankInstrumentTypeModule {}
