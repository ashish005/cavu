import {Routes} from '@angular/router';
import {MainLayout} from "./layout/layout";
import {DashboardView} from "./views/dashboard/main";

export const EMPLOYEE_Routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo:'dashboard' },
      { path: 'dashboard', component: DashboardView, data: { title: 'Dashboard', header:'Dashboard' } }
    ]
  }
];
