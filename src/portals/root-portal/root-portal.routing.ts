import {Routes} from '@angular/router';
import {Layout} from "./layout/layout";
import {DashboardView} from "./views/dashboard";
import {BusinessManageView} from "./views/business-manage.view";
import {BusinessAPIResolver} from "./services/api.resolver";

export const ROOT_Routes: Routes = [
  {
    path: '',
    component: Layout, data: { code: '', title: 'Business', icon: 'fa fa-dashboard', header: 'Business' },
    children: [
      { path: '', pathMatch: 'full', redirectTo:'business' },
      { path: 'dashboard', component: DashboardView, data: { title: 'Dashboard', header:'Dashboard' } },
      { path: 'business', resolve: { items: BusinessAPIResolver }, component: BusinessManageView, data: {title: 'Business', header:'Business'}}
    ]
  },
];
