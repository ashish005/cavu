import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {MainLayout} from "./layout/layout";
import {EMPLOYEE_Routes} from "./driver-portal.routing";
import {DashboardView} from "./views/dashboard/main";
import {OrgDashboardComponent} from "@app-global";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EMPLOYEE_Routes),
    OrgDashboardComponent
  ],
  providers: [ ],
  declarations: [MainLayout, DashboardView]
})

export class TransportationDriverPortal{}
