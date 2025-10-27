import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {PRODUCT_COMPONENTS, PRODUCT_ENTRY_COMPONENTS} from "./components";
import {PRODUCT_DIRECTIVES} from "./directives";
import {GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {PRODUCT_VIEWS, Product_Routes} from "./manage-inventory.routing";
import {RouterModule} from "@angular/router";
import {PRODUCT_SERVICES} from "./services";
import {GlobalModule} from "@app-global";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(Product_Routes),
        GlobalModule
    ],
    providers: [PRODUCT_SERVICES],
    declarations: [
        PRODUCT_VIEWS, PRODUCT_COMPONENTS, GRID_COLUMN_CELL_COMPONENTS, PRODUCT_DIRECTIVES, PRODUCT_ENTRY_COMPONENTS
    ]
})
export class ManageInventoryModule {}
