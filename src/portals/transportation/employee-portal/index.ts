import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {MainLayout} from "./layout/layout";
import {EMPLOYEE_Routes} from "./employee-portal.routing";
import {DashboardView} from "./views/dashboard/main";
import {GlobalModule} from "@app-global";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EMPLOYEE_Routes),
    GlobalModule
  ],
  providers: [ ],
  declarations: [DashboardView]
})

export class TransportationEmployeePortal{}
