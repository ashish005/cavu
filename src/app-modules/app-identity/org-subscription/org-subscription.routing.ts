import {Routes} from "@angular/router";
import {PricingLayout} from "./layout/layout";
import {PricingInfoView} from "./views/pricing-info.view";
import {SoftwareInvoiceView} from "./views/software-invoice.view";
import {PaymentView} from "./views/payment.view";
import {LicenseHistoryView} from "./views/license-history.view";
import {PaymentSuccessView} from "./views/payment-success.view";

export const SubscriptionRoutes: Routes = [
  {
    path: '', component: PricingLayout,
    children:[
      { path: '', pathMatch: 'full', redirectTo:'info' },
      { path: 'info', component: PricingInfoView, data: { title: 'Info', key: 'info', header:'Info'} },
      { path: 'payment', component: PaymentView, data: { title: 'Subscription', key: 'subscription', header:'Subscription'} },
      { path: 'payment-success', component: PaymentSuccessView, data: { title: 'Payment', key: 'payment', header:'Payment'} },
      { path: 'license-history', component: LicenseHistoryView, data: { title: 'license-history', key: 'license-history', header:'license-history' } },
      { path: 'invoices', component: SoftwareInvoiceView, data: { title: 'Invoices', key: 'Invoices', header:'Invoices' } }
    ]
  }
];

export const SUBSCRIPTION_VIEWS = [
    PricingLayout, PricingInfoView, PaymentView, PaymentSuccessView, LicenseHistoryView, SoftwareInvoiceView
];
