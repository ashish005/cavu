import {NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe} from "@angular/common";
import {RouterLink, RouterModule} from "@angular/router";
import {EMPLOYEE_COMPONENT} from "./components";
import {EDU_EMPLOYEE_VIEWS, EMPLOYEE_Routes} from "./employee-portal.routing";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(EMPLOYEE_Routes),
        GlobalModule
    ],
    providers: [ CurrencyPipe ],
    declarations: [EDU_EMPLOYEE_VIEWS, EMPLOYEE_COMPONENT]
})
export class REEmployeePortal{}
