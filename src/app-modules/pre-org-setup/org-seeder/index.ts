import {Injectable, Injector, NgModule} from "@angular/core";
import {OrgSetupAPIResolver} from "./services/api.resolver";
import {OrgLayout} from "./layout/layout";
import {GlobalModule} from "@app-global";
import {OrgConfigView} from "./views/org-config.view";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: "",
                resolve: {items: OrgSetupAPIResolver},
                children: [
                    {path: "", redirectTo: "config", pathMatch: "full"},
                    {path: "config", component: OrgConfigView}
                ]
            }
        ]),
        ReactiveFormsModule,
        GlobalModule
    ],
    providers: [OrgSetupAPIResolver],
    declarations: [OrgLayout, OrgConfigView],
    exports: []
})
export class OrgCoreSetupModule{}
