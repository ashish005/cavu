import {Routes} from '@angular/router';
import {Layout} from "./layout/layout";
import {DashboardView} from "./views/dashboard";
import {BusinessManageView} from "./views/business-manage.view";
import {BusinessAPIResolver} from "./services/api.resolver";
import {PricingInfoView} from "./views/pricing-info.view";
import {TrialBusinessView} from "./views/trial.view";

export const ROOT_Routes: Routes = [
  {
    path: '',
    component: Layout, data: { code: '', title: 'Business', icon: 'fa fa-dashboard', header: 'Business' },
    children: [
      { path: '', pathMatch: 'full', redirectTo:'business' },
      { path: 'dashboard', component: DashboardView, data: { title: 'Dashboard', header:'Dashboard' } },
      { path: 'business', resolve: { items: BusinessAPIResolver }, component: BusinessManageView, data: {title: 'Business', header:'Business'}},
      {path: 'pricing', resolve: {items: BusinessAPIResolver}, component: PricingInfoView, data: { title: 'Pricing - EnRator | Plans & Pricing' }},
      {path: 'trial', resolve: {items: BusinessAPIResolver}, component: TrialBusinessView, data: { title: 'Free Trial - EnRator | Start Your Journey' }}
    ]
  },
];
