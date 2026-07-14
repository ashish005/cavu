import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {OrgClientRoutes} from "./client.routing";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(OrgClientRoutes),
    ]
})
export class OrgClientModule{}