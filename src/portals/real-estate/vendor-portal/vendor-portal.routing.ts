import {Routes} from '@angular/router';
import {LayoutComponent} from "./layout/layout";
import {DashboardView} from "./views/dashboard/dashboard";
import {ExecutiveManageView} from "./views/executive-manage.view";
import {ServicesManageView} from "./views/service-manage.view";
//import {PortalCommonModuleRoutes} from "@app-core-module";

export const VENDOR_Routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo:'dashboard' },
      { path: 'dashboard', component: DashboardView, data: { title: 'Dashboard', header:'Dashboard' } },
      { path: 'services', component: ServicesManageView, data: { title: 'Service', header:'Service' } },
      { path: 'executives', component: ExecutiveManageView, data: { title: 'Executive', header:'Executive' } },
      // { path: 'invoice', loadChildren: () => import('app-modules/manage-invoice').then(m => m.InvoiceManageModule), data: {title: 'Invoice', icon: 'fa fa-pie-chart', hideSidebar: true, isUserIdMandate: true, header: 'Invoice', vFor: 'vendorUser', vMasterType: 'ALL_USER_TYPE_INVOICE'} },
      // { path: 'purchase-order', loadChildren: () => import('app-modules/manage-invoice').then(m => m.InvoiceManageModule), data: { code:'', title: 'Purchase Order', icon: 'fa fa-shield', header: 'Purchase History', hideSidebar: true, isUserIdMandate: true, vFor: 'vendorUser', vMasterType: 'PURCHASE_ORDER' } },
      //...PortalCommonModuleRoutes
    ]
  }
];
export const VENDOR_VIEWS = [LayoutComponent, DashboardView, ExecutiveManageView, ServicesManageView];
