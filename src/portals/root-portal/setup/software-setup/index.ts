import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SoftwareLayout, SoftwareSubLayout } from "./layout/layout";

import {PAYMENT_IDENTIFIER_SERVICES} from "./services";
import {SoftwarePlanView} from "./views/software-plan.view";
import {ModulePermissionComponent} from "./views/module-permission.view";
import {SoftwareSetupResolver} from "./services/api.resolver";

const getTranslationString = (key)=> `master_type.modules.${key}`;
@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', resolve: { items: SoftwareSetupResolver }, component: SoftwareLayout,
                children: [
                    {
                        path: ':code', component: SoftwareSubLayout,
                        data: {
                            title: getTranslationString('transaction.cash.title'),
                            header: getTranslationString('transaction.cash.header')
                        },
                        children: [
                            { path: '', pathMatch: 'full', redirectTo: 'plan' },
                            {
                                path: 'plan',
                                data: {
                                    title: getTranslationString('transaction.cash.title'),
                                    header: getTranslationString('transaction.cash.header')
                                }, component: SoftwarePlanView
                            },
                            {
                                path: 'modules',
                                data: {
                                    title: getTranslationString('transaction.cash.title'),
                                    header: getTranslationString('transaction.cash.header')
                                }, component: ModulePermissionComponent
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
        SoftwareLayout, SoftwareSubLayout,
        SoftwarePlanView, ModulePermissionComponent
    ]
})
export class SoftwareSetupModule {}
