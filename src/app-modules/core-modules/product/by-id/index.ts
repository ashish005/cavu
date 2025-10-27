import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GlobalModule} from "@app-global";
import {RouterModule, Routes} from "@angular/router";
import {ProductByIdRoutes, PROJECT_BY_ID_VIEWS} from "./by-id.routing";
import {PRODUCT_COMPONENTS, PRODUCT_ENTRY_COMPONENTS} from "./components";
import {PRODUCT_DIRECTIVES} from "./directives";
import {GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {PRODUCT_SERVICES} from "./services";
import {ProductLookupResolver} from "../common";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(ProductByIdRoutes),
        GlobalModule
    ],
    providers: [PRODUCT_SERVICES, ProductLookupResolver],
    declarations: [
        PROJECT_BY_ID_VIEWS, PRODUCT_COMPONENTS, GRID_COLUMN_CELL_COMPONENTS, PRODUCT_DIRECTIVES, PRODUCT_ENTRY_COMPONENTS
    ]
})
export class ProductByIdModule{}
