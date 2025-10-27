import {Routes} from "@angular/router";

import {ProductLayout} from "./layout/product.layout";

import {ProductManageView} from "./views/manage.view";
import {ProductLookupResolver} from "../common";

export const Product_Routes: Routes = [
    {
        path: '',
        component: ProductLayout,
        resolve: {lookup: ProductLookupResolver},
        data: {code: '', title: 'modules.product.title', header: 'modules.product.header'},
        children: [{path: '', component: ProductManageView}]
    }
];

export const PRODUCT_VIEWS =
    [ ProductLayout, ProductManageView ];