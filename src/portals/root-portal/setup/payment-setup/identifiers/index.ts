import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    BankIdentifierTypeLayout,
    BankIdentifierTypeSubLayout
} from "./layout/layout";

import {PAYMENT_IDENTIFIER_SERVICES} from "./services";
import {IdentifierCountryView} from "./views/identifier-country.view";

const getTranslationString = (key)=> `master_type.modules.${key}`;
@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', component: BankIdentifierTypeLayout,
                children: [
                    {
                        path: ':code', component: BankIdentifierTypeSubLayout,
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
                                }, component: IdentifierCountryView
                            }
                        ]
                    }
                ]
            }
        ]),
        GlobalModule
    ],
    providers: [ PAYMENT_IDENTIFIER_SERVICES ],
    declarations: [
        BankIdentifierTypeLayout, BankIdentifierTypeSubLayout,
        IdentifierCountryView
    ]
})

export class BankIdentifierTypeModule {}
