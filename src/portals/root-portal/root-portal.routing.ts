import {Routes} from '@angular/router';
import {Layout} from "./layout/layout";
import {DashboardView} from "./views/dashboard";
import {BusinessManageView} from "./views/business-manage.view";
import {BusinessAPIResolver} from "./services/api.resolver";
import {PricingInfoView} from "./views/pricing-info.view";
import {TrialBusinessView} from "./views/trial.view";
import {BankingManageView} from "./views/banking-manage.view";
import {PaymentManageView} from "./views/payment-manage.view";
import {BankingSetupResolver, PaymentSetupResolver} from "./services/account.service";

export const ROOT_Routes: Routes = [
  {
    path: '',
    component: Layout, data: { code: '', title: 'Business', icon: 'fa fa-dashboard', header: 'Business' },
    children: [
      { path: '', pathMatch: 'full', redirectTo:'business' },
      { path: 'dashboard', component: DashboardView, data: { title: 'Dashboard', header:'Dashboard' } },
      { path: 'business', resolve: { items: BusinessAPIResolver }, component: BusinessManageView, data: {title: 'Business', header:'Business'}},
      { path: 'banking', resolve: { items: BankingSetupResolver }, component: BankingManageView, data: {title: 'Banking Configuration', header:'Banking Configuration'}},
      { path: 'payment', resolve: { items: PaymentSetupResolver }, component: PaymentManageView, data: {title: 'Payment Configuration', header:'Payment Configuration'}},
      {path: 'pricing', resolve: {items: BusinessAPIResolver}, component: PricingInfoView, data: { title: 'Pricing - EnRator | Plans & Pricing' }},
      {path: 'trial', resolve: {items: BusinessAPIResolver}, component: TrialBusinessView, data: { title: 'Free Trial - EnRator | Start Your Journey' }}
    ]
  },
];
