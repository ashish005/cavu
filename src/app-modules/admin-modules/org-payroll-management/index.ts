import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {EMPLOYEE_SALARY_VIEWS, EmployeeSalaryRoutes} from "./salary.routing";
import {EMPLOYEE_SALARY_SERVICE} from "./services";
import {EMPLOYEE_SALARY_COMPONENT, EMPLOYEE_SALARY_ENTRY_COMPONENT} from "./components";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(EmployeeSalaryRoutes),
      GlobalModule
    ],
    providers: [EMPLOYEE_SALARY_SERVICE],
    declarations: [EMPLOYEE_SALARY_VIEWS, EMPLOYEE_SALARY_COMPONENT, EMPLOYEE_SALARY_ENTRY_COMPONENT]
})

export class SalaryModule{}
