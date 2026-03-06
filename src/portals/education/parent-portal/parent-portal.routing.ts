import {Routes} from '@angular/router';
import {LayoutComponent} from "./layout/layout";
import {DashboardView} from "./views/dashboard/dashboard";
import {PortalCommonModuleRoutes} from "@app-core-module";

export const PARENT_Routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo:'dashboard' },
      { path: 'dashboard', component: DashboardView, data: { title: 'Dashboard', header:'Dashboard' } },

      ...PortalCommonModuleRoutes
    ]
  }
];
export const PARENT_VIEWS = [LayoutComponent, DashboardView];
