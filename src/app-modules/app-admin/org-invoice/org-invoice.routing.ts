import {Routes} from "@angular/router";
import {MoneyLayout} from "./layout/layout";
import {DashboardView} from "./views/dashboard.view";
import {OrgInvoiceAPIResolver} from "./services/api.resolver";
import {VoucherView} from "./views/voucher.view";

export const OrgInvoiceRoutes: Routes = [
  {
    path: '', component: MoneyLayout, resolve: { resolver: OrgInvoiceAPIResolver },
    children:[
      { path: '', pathMatch: 'full', redirectTo:'dashboard' },
      { path: 'dashboard', component: DashboardView },
      { path: ':voucherTypeId/invoice', component: VoucherView }
    ]
  }
];

export const ORG_INVOICE_VIEWS = [ MoneyLayout, DashboardView, VoucherView ];
