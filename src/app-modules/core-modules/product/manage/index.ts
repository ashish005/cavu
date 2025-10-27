import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {PRODUCT_COMPONENTS} from "./components";
import {GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {PRODUCT_VIEWS, Product_Routes} from "./manage.routing";
import {RouterModule} from "@angular/router";
import {PRODUCT_SERVICES} from "./services";
import {GlobalModule} from "@app-global";
import {ProductLookupResolver} from "../common";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(Product_Routes),
        GlobalModule
    ],
    providers: [PRODUCT_SERVICES, ProductLookupResolver],
    declarations: [
        PRODUCT_VIEWS, PRODUCT_COMPONENTS, GRID_COLUMN_CELL_COMPONENTS
    ]
})
export class ProductManageModule {}
