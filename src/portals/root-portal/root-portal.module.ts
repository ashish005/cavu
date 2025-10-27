import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {ROOT_Routes} from "./root-portal.routing";
import {Layout} from "./layout/layout";
import {DashboardView} from "./views/dashboard";
import {GlobalModule} from "@app-global";
import {BusinessManageView} from "./views/business-manage.view";
import {ReactiveFormsModule} from "@angular/forms";
import {BUSINESS_COMPONENT} from "./components/index";
import { BUSINESS_SERVICES } from './services';

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule, GlobalModule,
        RouterModule.forChild(ROOT_Routes)
    ],
    providers: [ BUSINESS_SERVICES ],
    declarations: [Layout, DashboardView, BusinessManageView, ...BUSINESS_COMPONENT]
})

export class RootPortalModule{
  constructor(){}
}
