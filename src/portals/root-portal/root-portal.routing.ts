import {Routes} from '@angular/router';
import {Layout} from "./layout/layout";
import {DashboardView} from "./views/dashboard";

export const ROOT_Routes: Routes = [
  {
    path: '',
    component: Layout, data: { code: '', title: 'Business', icon: 'fa fa-dashboard', header: 'Business' },
    children: [
      { path: '', pathMatch: 'full', redirectTo:'business' },
      { path: 'dashboard', component: DashboardView, data: { title: 'Dashboard', header:'Dashboard' } },
      {
        path: 'business-setup', //canLoad:[ModuleGuard],
        loadChildren: () => import('./setup/business-setup').then(m => m.BusinessModule),
        data: {title: 'business', header:'business', name: "business", key: 'layout.banking' }//code: "ACCESS_VT_MGT",
      },
      {
        path: 'bank-setup', //canLoad:[ModuleGuard],
        loadChildren: () => import('./setup/bank-setup').then(m => m.BankingModule),
        data: {title: 'Bank', header:'Bank', name: "Banking", key: 'layout.banking' }//code: "ACCESS_VT_MGT",
      },
      {
        path: 'payment-setup', //canLoad:[PortalAuthGuard],
        loadChildren: () => import('./setup/payment-setup').then(m => m.PaymenyGatewayModule),
        data: { code: "ACCESS_TAX_MGT", title: 'Paymeny Gateway', header:'Paymeny Gateway'}
      },
    ]
  },
];
