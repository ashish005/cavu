import {Routes} from '@angular/router';
import {MainLayout} from "./layout/layout";
import {DashboardView} from "./views/dashboard/main";
import {PortalCommonModuleRoutes} from "@app-core-module";
import {AppPermissionService} from "@app-global";

export const EMPLOYEE_Routes: Routes = [
  {
    path: '',
    component: MainLayout,
    resolve: {permissions: AppPermissionService},
    children: [
      { path: '', pathMatch: 'full', redirectTo:'dashboard' },
      { path: 'dashboard', component: DashboardView, data: { title: 'Dashboard', header:'Dashboard' } },
      ...PortalCommonModuleRoutes
    ]
  }
];
