import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import { GlobalModule } from "@app-global";
import {RouterModule, Routes} from "@angular/router";
import {ORG_SETUP_VIEWS, OrgSetupRoutes} from "./org-setup.routing";
import {ORG_SETUP_SERVICES} from "./services";
import {ORG_SETUP_COMPONENTS} from "./components";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(OrgSetupRoutes),
        GlobalModule
    ],
    providers: [ORG_SETUP_SERVICES],
    declarations: [ORG_SETUP_VIEWS, ORG_SETUP_COMPONENTS]
})

export class OrgSetupModule{
}
