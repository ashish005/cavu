import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {MainLayout} from "./layout/layout";
import {EMPLOYEE_Routes} from "./driver-portal.routing";
import {DashboardView} from "./views/dashboard/main";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EMPLOYEE_Routes)
  ],
  providers: [ ],
  declarations: [MainLayout, DashboardView]
})

export class TransportationDriverPortal{}
