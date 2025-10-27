import {Routes} from '@angular/router';
import {MainLayout} from "./layout/layout";
import {DashboardView} from "./views/dashboard/main";
import {PortalCommonModuleRoutes} from "@app-core-module";

export const EMPLOYEE_Routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo:'dashboard' },
      { path: 'dashboard', component: DashboardView, data: { title: 'Dashboard', header:'Dashboard' } },
      ...PortalCommonModuleRoutes
    ]
  }
];
