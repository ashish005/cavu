import {Injectable, Injector, NgModule} from "@angular/core";
import {OrgSetupAPIResolver} from "./services/api.resolver";
import {OrgLayout} from "./layout/layout";
import {GlobalModule} from "@app-global";
import {OrgConfigView} from "./components/org-config.view";
import {SyncMasterComponent} from "./components/sync-master.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([{
            path: '', resolve: {items: OrgSetupAPIResolver}, component: OrgLayout,
        }]),
        ReactiveFormsModule, GlobalModule
    ],
    providers: [OrgSetupAPIResolver],
    declarations: [OrgLayout, OrgConfigView, SyncMasterComponent],
    exports: []
})
export class OrgCoreSetupModule{}