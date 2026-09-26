import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {ROOT_Routes} from "./root-portal.routing";
import {Layout} from "./layout/layout";
import {DashboardView} from "./views/dashboard";
import {GlobalModule} from "@app-global";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule, GlobalModule,
        RouterModule.forChild(ROOT_Routes)
    ],
    declarations: [Layout, DashboardView]
})

export class RootPortalModule{
  constructor(){}
}
