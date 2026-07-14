import {Routes} from "@angular/router";
import {SupplierLayout} from "./layout/layout";

import {
    VendorLookupResolver,
} from "./services/api.resolver";

import {SupplierByBranchManageView} from "./views/supplier-by-branch-manage.view";
import {SupplierManageView} from "./views/supplier-manage.view";

export const Supplier_Routes: Routes = [
  {
    path: '', component: SupplierLayout, resolve: { lookups: VendorLookupResolver },
    data: { isVendor: true, code:'PERM_VENDOR', title: 'modules.vendor.title', header: 'modules.vendor.header' },
    children:[
        { path: '', pathMatch: 'full', redirectTo:'branch' },
        { path: 'branch', component: SupplierByBranchManageView },
        { path: 'view', component: SupplierManageView }
    ]
  },

];

export const VENDOR_VIEWS = [
    SupplierLayout,
    SupplierManageView, SupplierByBranchManageView
];