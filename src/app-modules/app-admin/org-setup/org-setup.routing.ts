import {Routes} from "@angular/router";
import {OrgSetupAPIResolver} from "./services/api.resolver";

import {OrgSetupLayout} from "./layout/layout";

import {OrgHostView} from "./views/org-host.view";
import {OrgInfoView} from "./views/org-info.view";
import {OrgService} from "./services/org.service";
import {
    OrgAccountingFeatureView,
    OrgInventoryFeatureView,
    OrgVoucherConfigView,
    OrgVoucherEntryConfigView
} from "./views/org-feature.view";

import {
    OrgCurrencyView, OrgLanguageView
} from "./views/org-global.view";
import {OrgBranchView} from "./views/org-branch.view";
import {OrgGlobalLayout} from "./layout/org-global.layout";
import {OrgLayout} from "./layout/org.layout";
import {OrgConfigView} from "./views/org-config.view";

const translatePath = 'modules.org_setup.sub_module';
export const OrgSetupRoutes: Routes = [
  {
    path: '', component: OrgSetupLayout, resolve: { items: OrgSetupAPIResolver, org: OrgService },
    data: { translatePath: translatePath },
    children:[
      { path: '', pathMatch: 'full', redirectTo:'org' },
    {
        path: 'org', component: OrgLayout,
        children:[
            { path: '', pathMatch: 'full', redirectTo:'info' },
            { path: 'info', component: OrgInfoView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.org.info.title`, header: `${translatePath}.org.info.header` } },
            { path: 'host', component: OrgHostView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.org.host.title`, header: `${translatePath}.org.host.header` } },
            { path: 'branch', component: OrgBranchView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.org.branch.title`, header: `${translatePath}.org.branch.header` } },
            { path: 'currency', component:OrgCurrencyView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.global.currency.title`, header: `${translatePath}.global.currency.header` } },
            { path: 'language', component:OrgLanguageView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.global.language.title`, header: `${translatePath}.global.language.header` } },
            { path: 'config', component: OrgConfigView, data: { code:'', icon: 'fa fa-dashboard', title: `Configuration`, header: `Configuration` } }
        ]
    },
        {
            path: 'config',
            children:[
                { path: '', pathMatch: 'full', redirectTo:'invoice' },
                { path: 'voucher-entry', component: OrgVoucherEntryConfigView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.config.entry.title`, header: `${translatePath}.config.entry.header` } },
                { path: 'invoice', component: OrgVoucherConfigView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.config.invoice.title`, header: `${translatePath}.config.invoice.header` } }
            ]
        },
      {
          path: 'feature',
          children:[
              { path: 'account', component: OrgAccountingFeatureView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.feature.account.title`, header: `${translatePath}.feature.account.header` } },
              { path: 'inventory', component: OrgInventoryFeatureView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.feature.inventory.title`, header: `${translatePath}.feature.inventory.header` } }
          ]
      }
    ]
  }
];

export const ORG_SETUP_VIEWS = [
    OrgSetupLayout,
    OrgLayout, OrgInfoView, OrgHostView, OrgConfigView, OrgBranchView,
    OrgAccountingFeatureView, OrgInventoryFeatureView, OrgVoucherEntryConfigView, OrgVoucherConfigView,
    OrgGlobalLayout, OrgCurrencyView, OrgLanguageView
];
