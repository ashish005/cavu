import {Routes} from "@angular/router";
import {Layout} from "./layout/layout";
import {EmployeeSalaryAPIResolver} from "./services/api.resolver";
import {EmployeeSalaryManageView} from "./views/manage.view";
import {EmployeeManagePayrollView} from "./views/manage-payroll.view";

export const EmployeeSalaryRoutes: Routes = [
  {
    path: '', component: Layout, //resolve: { items: EmployeeSalaryAPIResolver },
    children:[
      { path: '', pathMatch: 'full', redirectTo:'manage' },
      { path: 'manage', component: EmployeeSalaryManageView, data: {title: 'Manage'} },

    ]
  },
  { path: 'payroll', component: EmployeeManagePayrollView, data: {title: 'Pay-roll'} }
];

export const EMPLOYEE_SALARY_VIEWS = [
  Layout,
  EmployeeSalaryManageView,
  EmployeeManagePayrollView
];
