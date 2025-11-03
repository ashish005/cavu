import {Routes} from "@angular/router";
import {OrgSetupAPIResolver} from "./services/api.resolver";

import {OrgSetupLayout} from "./layout/org-setup.layout";
import {OrgConfigSetupLayout, OrgFeatureSetupLayout} from "./layout/layout";
import {OrgLayout} from "./layout/org.layout";

import {OrgHostView} from "./views/org-host.view";
import {OrgInfoView, OrgBrandImageView, OrgOfficeInfoView, OrgCurrencyView, OrgLanguageView} from "./views/general";
import {OrgService} from "./services/org.service";

import {OrgBranchView} from "./views/org-branch.view";

import {OrgInventoryFeatureView} from "./views/features/org-inventory-feature.view";
import {OrgAccountingFeatureView} from "./views/features/org-accounting-feature.view";

import {OrgConfigView} from "./views/config/org-config.view";
import {OrgVoucherEntryConfigView} from "./views/config/org-voucher-entry-config.view";
import {OrgVoucherConfigView} from "./views/config/org-voucher-config.view";

const translatePath = 'modules.org_setup.sub_module';
export const OrgSetupRoutes: Routes = [
  {
    path: '', component: OrgSetupLayout,
    resolve: { items: OrgSetupAPIResolver, org: OrgService },
    data: { translatePath: translatePath },
    children:[
      { path: '', pathMatch: 'full', redirectTo:'general' },
        {
            path: 'general', component: OrgLayout,
            children:[
                { path: '', pathMatch: 'full', redirectTo:'info' },
                { path: 'info', component: OrgInfoView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.org.info.title`, header: `${translatePath}.org.info.header` } },
                { path: 'brand-image', component: OrgBrandImageView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.org.info.title`, header: `${translatePath}.org.info.header` } },
                { path: 'host', component: OrgHostView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.org.host.title`, header: `${translatePath}.org.host.header` } },
                { path: 'branch', component: OrgBranchView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.org.branch.title`, header: `${translatePath}.org.branch.header` } },
                { path: 'currency', component:OrgCurrencyView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.global.currency.title`, header: `${translatePath}.global.currency.header` } },
                { path: 'language', component:OrgLanguageView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.global.language.title`, header: `${translatePath}.global.language.header` } },
                { path: 'office', component: OrgOfficeInfoView, data: { code:'', icon: 'fa fa-dashboard', title: `Configuration`, header: `Configuration` } }
            ]
        },
        {
            path: 'config', component: OrgConfigSetupLayout,
            children:[
                { path: '', pathMatch: 'full', redirectTo:'general' },
                { path: 'general', component: OrgConfigView, data: { code:'', icon: 'fa fa-dashboard', title: `Configuration`, header: `Configuration` } },
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
];

export const ORG_SETUP_VIEWS = [
    OrgSetupLayout,
    OrgLayout, OrgConfigSetupLayout, OrgFeatureSetupLayout,
    OrgInfoView, OrgBrandImageView, OrgOfficeInfoView,
    OrgHostView, OrgConfigView, OrgBranchView,
    OrgAccountingFeatureView, OrgInventoryFeatureView, OrgVoucherEntryConfigView, OrgVoucherConfigView,
    OrgCurrencyView, OrgLanguageView
];
