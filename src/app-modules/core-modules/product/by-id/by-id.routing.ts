import {Routes} from "@angular/router";
import {ProductSideNavLayout} from "./layout/product-side-nav-layout";
import {ProductDashboardView} from "./views/dashboard.view";
import {ProductPriceVariantManageView} from "./views/price-variant-manage.view";
import {ProductTokenView} from "./views/token.view";
import {VariantGridComponent} from "./views/variant-grid.view";
import {ProductFormLayout} from "./layout/product-form-layout";
import {ProductByIdService} from "./services/product.service";
import {ProductLookupResolver} from "../common";
import {TransactionView} from "./views/transaction.view";

const translatePath = 'modules.project.sub_module';
export const ProductByIdRoutes: Routes = [
    /*{
              path: 'form', component: ProductFormLayout, resolve: { lookups: ProductModuleAPIResolver },
              children:[
                { path: 'new', component: ProductFormView, data: { code:'', title: 'New Product/ Service', header: 'New Product/ Service' } },
                { path: ':id', component: ProductFormView, data: { code:'', title: 'Edit Product/ Service', header: 'Edit Product/ Service' } }
              ]
            },*/
    {
        path: '',
        component: ProductSideNavLayout,
        data: {code: '', title: 'modules.product.title', header: 'modules.product.header'},
        resolve: {item: ProductByIdService, lookup: ProductLookupResolver},
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
            {
                path: 'transactions',
                component: TransactionView,
                data: { code:'', title: 'Transaction', icon: 'fa fa-dashboard', header: 'Transaction History' }
            },
            {
                path: 'tokens',
                component: ProductTokenView,
                data: {code: '', title: 'Token', icon: 'fa fa-dashboard', header: 'Token'}
            }
        ]
    }
];

export const PROJECT_BY_ID_VIEWS = [
    ProductSideNavLayout, ProductPriceVariantManageView,
    ProductFormLayout, VariantGridComponent,
    ProductDashboardView, ProductTokenView, //ProductCategoryView,
    TransactionView
];
