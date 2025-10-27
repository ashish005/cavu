import {Routes} from '@angular/router';
import {LayoutComponent} from "./layout/layout";
import {DashboardView} from "./views/dashboard.view";
import {AssociateManageView} from "./views/associate-manage.view";
import {PortalCommonModuleRoutes} from "@app-core-module";
export const Client_Routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo:'dashboard' },
      { path: 'dashboard', component: DashboardView, data: { title: 'Dashboard', header:'Dashboard' } },
      { path: 'associates', component: AssociateManageView, data: { title: 'Executive', header:'Executive' } },
      /*{ path: 'quotation', loadChildren: () => import('app-modules/manage-invoice/index').then(m => m.InvoiceManageModule), data: { code:'', title: 'Quotation', icon: 'fa fa-shield', header: 'Quotation', hideSidebar: true, isUserIdMandate: true, vFor: 'clientUser',
          vMasterType: 'QUOTATION'
      } },
      { path: 'invoice', loadChildren: () => import('app-modules/manage-invoice/index').then(m => m.InvoiceManageModule), data: {title: 'Sale', icon: 'fa fa-pie-chart', hideSidebar: true, isUserIdMandate: true, header: 'Invoice', vFor: 'clientUser',
          vMasterType: 'ALL_USER_TYPE_INVOICE'
      } },
      { path: 'sale-order', loadChildren: () => import('app-modules/manage-invoice/index').then(m => m.InvoiceManageModule), data: { code:'', title: 'Sale Order', icon: 'fa fa-shield', header: 'Sale History', hideSidebar: true, isUserIdMandate: true, vFor: 'clientUser',
          vMasterType: 'SALE_ORDER'
          }
        },*/
      ...PortalCommonModuleRoutes
    ]
  }
];
export const CLIENT_VIEWS = [LayoutComponent, DashboardView, AssociateManageView];
