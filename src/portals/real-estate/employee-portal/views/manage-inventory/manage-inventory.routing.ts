import {Routes} from "@angular/router";

import {ProductLayout} from "./layout/product.layout";
import {ProductSideNavLayout} from "./layout/product-side-nav-layout";

import {ProductAPIResolver, ProductLookupResolver} from "./services/api.resolver";
import {ProductManageView} from "./views/product-manage.view";
import {ProductFormLayout} from "./layout/product-form-layout";
import {ProductDashboardView} from "./views/product-dashboard.view";
import {ProductCategoryView} from "./views/product-category.view";
import {ProductTokenView} from "./views/product-token.view";
import {ProductPriceVariantManageView} from "./views/price-variant-manage.view";

import {PurchaseOrderView, SaleOrderView} from "./views/order.view";
import {VariantGridComponent} from "./views/variant-grid.view";

export const Product_Routes: Routes = [
    {
        path: '', resolve: {lookup: ProductLookupResolver},
        children: [
            { path: '', pathMatch: 'full', redirectTo:'manage' },
            {
                path: 'manage',
                component: ProductLayout,
                data: {code: '', title: 'modules.product.title', header: 'modules.product.header'},
                children: [{path: '**', component: ProductManageView}]
            },
            /*{
              path: 'form', component: ProductFormLayout, resolve: { lookups: ProductModuleAPIResolver },
              children:[
                { path: 'new', component: ProductFormView, data: { code:'', title: 'New Product/ Service', header: 'New Product/ Service' } },
                { path: ':id', component: ProductFormView, data: { code:'', title: 'Edit Product/ Service', header: 'Edit Product/ Service' } }
              ]
            },*/
            {
                path: ':productId',
                component: ProductSideNavLayout,
                data: {code: '', title: 'modules.product.title', header: 'modules.product.header'},
                resolve: {item: ProductAPIResolver},
                runGuardsAndResolvers: 'paramsChange',
                children: [
                    {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
                    {
                        path: 'dashboard',
                        component: ProductDashboardView,
                        data: {code: '', title: 'Dashboard', icon: 'fa fa-dashboard', header: 'Dashboard'}
                    },
                    {
                        path: 'variant',
                        component: ProductPriceVariantManageView,
                        data: {code: '', title: 'Price Variant', icon: 'fa fa-dashboard', header: 'Price Variant'}
                    },
                    // { path: 'purchase-order', component: PurchaseOrderView, data: { code:'', title: 'Transaction', icon: 'fa fa-dashboard', header: 'Purchase History' } },
                    // { path: 'sale-order', component: SaleOrderView, data: { code:'', title: 'Transaction', icon: 'fa fa-dashboard', header: 'Sale History' } },
                    /*{
                        path: 'purchase-order',
                        loadChildren: () => import('app-modules/manage-invoice').then(m => m.InvoiceManageModule),
                        data: {
                            code: '',
                            title: 'Transaction',
                            icon: 'fa fa-shield',
                            header: 'Purchase History',
                            hideSidebar: true,
                            vMasterType: 'PURCHASE_ORDER'
                        }
                    },
                    {
                        path: 'sale-order',
                        loadChildren: () => import('app-modules/manage-invoice').then(m => m.InvoiceManageModule),
                        data: {
                            code: '',
                            title: 'Transaction',
                            icon: 'fa fa-shield',
                            header: 'Sale History',
                            hideSidebar: true,
                            vMasterType: 'SALE_ORDER'
                        }
                    },*/
                    {
                        path: 'categories',
                        component: ProductCategoryView,
                        data: {code: '', title: 'Category', icon: 'fa fa-dashboard', header: 'Category'}
                    },
                    {
                        path: 'tokens',
                        component: ProductTokenView,
                        data: {code: '', title: 'Token', icon: 'fa fa-dashboard', header: 'Token'}
                    }
                ]
            }
        ]
    }
];

export const PRODUCT_VIEWS =
    [
        ProductLayout,
        ProductManageView,
        ProductSideNavLayout, ProductPriceVariantManageView,
        ProductFormLayout, VariantGridComponent,
        ProductDashboardView, ProductTokenView, ProductCategoryView, PurchaseOrderView, SaleOrderView
    ];
