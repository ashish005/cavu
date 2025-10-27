import {Routes} from '@angular/router';
import {DashboardView} from "./views/dashboard/dashboard";
import {CoreCommonModuleRoutes, PortalCommonModuleRoutes} from "@app-core-module";
import {DashboardAPIResolver} from "@app-global";
import {MainLayout} from "./layout/layout";

export const EMPLOYEE_Routes: Routes = [
  {
    path: '', data: { title: 'Home', header:'Home' },
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo:'dashboard' },
      { path: 'dashboard', resolve: { lookups: DashboardAPIResolver }, component: DashboardView, data: { title: 'Dashboard', header:'Dashboard' } },

        { path: 'client', loadChildren: () => import('portals/real-estate/employee-portal/views/client').then(m => m.OrgClientModule) },
        { path: 'project', loadChildren: () => import('portals/real-estate/employee-portal/views/project').then(m => m.ProjectModule) },
        { path: 'vendor', loadChildren: () => import('portals/real-estate/employee-portal/views/supplier').then(m => m.OrgSupplierModule) },
        { path: 'product1', loadChildren: () => import('portals/real-estate/employee-portal/views/manage-inventory').then(m => m.ManageInventoryModule) },
        { path: 'product', loadChildren: () => import('app-modules/core-modules/product').then(m => m.ProductModule) },

        // { path: 'quotation', loadChildren: () => import('app-modules/manage-invoice').then(m => m.InvoiceManageModule), data: { code:'PERM_QUOTATION', title: 'modules.quotation.title', header: 'modules.quotation.header', icon: 'fa fa-shield', hideSidebar: true, vMasterType: 'QUOTATION' } },
        ...PortalCommonModuleRoutes,
        ...CoreCommonModuleRoutes
    ]
  }
];
