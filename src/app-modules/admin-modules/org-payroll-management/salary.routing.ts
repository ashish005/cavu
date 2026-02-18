import {Routes} from "@angular/router";
import {Layout} from "./layout/layout";
import {EmployeeSalaryManageView} from "./views/manage.view";

export const EmployeeSalaryRoutes: Routes = [
  {
    path: '', component: Layout, //resolve: { items: EmployeeSalaryAPIResolver },
    children:[
      { path: '', pathMatch: 'full', redirectTo:'manage' },
      { path: 'manage', component: EmployeeSalaryManageView, data: {title: 'Manage'} }
    ]
  }
];

export const EMPLOYEE_SALARY_VIEWS = [
  Layout,
  EmployeeSalaryManageView
];
