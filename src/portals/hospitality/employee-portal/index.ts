import {NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe} from "@angular/common";
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
  providers: [ CurrencyPipe ],
  declarations: [MainLayout, DashboardView]
})

export class HospitalityEmployeePortal{}
