import {NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {EDU_EMPLOYEE_Routes, EDU_EMPLOYEE_VIEWS} from "./edu-employee-portal.routing";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(EDU_EMPLOYEE_Routes), GlobalModule
    ],
    declarations: [EDU_EMPLOYEE_VIEWS],
    exports: [GlobalModule]
})

export class EduEmployeePortal{}
