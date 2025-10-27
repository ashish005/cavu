import {NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe} from "@angular/common";
import {RouterLink, RouterModule} from "@angular/router";
import {MainLayout} from "./layout/layout";
import {DashboardView} from "./views/dashboard/dashboard";
import {EMPLOYEE_COMPONENT} from "./components";
import {EMPLOYEE_Routes} from "./employee-portal.routing";
import {GlobalModule} from "@app-global";
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(EMPLOYEE_Routes),
        GlobalModule, MainLayout
    ],
    providers: [ CurrencyPipe ],
    declarations: [DashboardView, EMPLOYEE_COMPONENT]
})

export class REEmployeePortal{}
