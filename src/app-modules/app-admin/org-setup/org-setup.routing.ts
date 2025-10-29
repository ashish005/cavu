import {Routes} from "@angular/router";
import {OrgSetupAPIResolver} from "./services/api.resolver";

import {OrgConfigSetupLayout, OrgFeatureSetupLayout} from "./layout/layout";

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
import {OrgLayout} from "./layout/org.layout";
import {OrgConfigView} from "./views/org-config.view";

const translatePath = 'modules.org_setup.sub_module';
export const OrgSetupRoutes: Routes = [
  {
    path: '',
      resolve: { items: OrgSetupAPIResolver, org: OrgService },
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
                { path: 'setting', component: OrgConfigView, data: { code:'', icon: 'fa fa-dashboard', title: `Configuration`, header: `Configuration` } },
                {
                    path: 'config', component: OrgConfigSetupLayout,
                    children:[
                        { path: '', pathMatch: 'full', redirectTo:'invoice' },
                        { path: 'voucher-entry', component: OrgVoucherEntryConfigView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.config.entry.title`, header: `${translatePath}.config.entry.header` } },
                        { path: 'invoice', component: OrgVoucherConfigView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.config.invoice.title`, header: `${translatePath}.config.invoice.header` } }
                    ]
                },
                {
                    path: 'features', component: OrgFeatureSetupLayout,
                    children:[
                        { path: '', pathMatch: 'full', redirectTo:'account' },
                        { path: 'account', component: OrgAccountingFeatureView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.feature.account.title`, header: `${translatePath}.feature.account.header` } },
                        { path: 'inventory', component: OrgInventoryFeatureView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.feature.inventory.title`, header: `${translatePath}.feature.inventory.header` } }
                    ]
                }
            ]
        }
    ]
  }
];

export const ORG_SETUP_VIEWS = [
    OrgLayout, OrgConfigSetupLayout, OrgFeatureSetupLayout,
    OrgInfoView, OrgHostView, OrgConfigView, OrgBranchView,
    OrgAccountingFeatureView, OrgInventoryFeatureView, OrgVoucherEntryConfigView, OrgVoucherConfigView,
    OrgCurrencyView, OrgLanguageView
];
