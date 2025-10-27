import {RouterModule, Routes} from "@angular/router";
import {SupplierSideNavLayout} from "./layout/layout";

import {
    VendorLookupResolver,
    VendorByIdAPIResolver
} from "./services/api.resolver";

import {VendorDetailsView} from "./views/vendor-details.view";

import {SupplierProductManageView} from "./views/supplier-product-manage.view";
import {SupplierExecutiveView} from "./views/supplier-executive.view";

export const SupplierByAccountRoutes: Routes = [
  {
    path: '', component: SupplierSideNavLayout, resolve: { lookup: VendorLookupResolver, item: VendorByIdAPIResolver },
    children: [
        { path: '', pathMatch: 'full', redirectTo:'details' },
        { path: 'details', component: VendorDetailsView, data: { code:'', title: 'Details', header: 'Details' } },
        { path: 'executive', component: SupplierExecutiveView, data: { code:'', title: 'Executives', header: 'Executives' } },
        { path: 'services', component: SupplierProductManageView, data: { code:'', title: 'Product/ Services', header: 'Product/ Services' } },
        // { path: 'invoice', loadChildren: () => import('app-modules/manage-invoice').then(m => m.InvoiceManageModule), data: {title: 'Invoice', icon: 'fa fa-pie-chart', hideSidebar: true, header: 'Invoice', vFor: 'vendor', vMasterType: 'ALL_INVOICE' } },
        // { path: 'purchase-order', loadChildren: () => import('app-modules/manage-invoice').then(m => m.InvoiceManageModule), data: { code:'', title: 'Purchase Order', icon: 'fa fa-shield', header: 'Purchase History', hideSidebar: true, vMasterType: 'PURCHASE_ORDER' } }
    ]
  }
];

export const SUPPLIER_BY_ACCOUNT_VIEWS = [
    SupplierSideNavLayout,
    VendorDetailsView, SupplierExecutiveView, SupplierProductManageView, //InvoiceView
];
