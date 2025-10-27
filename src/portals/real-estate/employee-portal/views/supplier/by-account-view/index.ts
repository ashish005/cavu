import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {GlobalModule} from "@app-global";
import {SUPPLIER_COMPONENTS, SUPPLIER_ENTRY_COMPONENTS} from "./components";
import {GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {RouterModule} from "@angular/router";
import {VENDOR_SERVICES} from "./services";
import {SUPPLIER_BY_ACCOUNT_VIEWS, SupplierByAccountRoutes} from "./by-account.routing";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(SupplierByAccountRoutes),
        GlobalModule
    ],
    providers: [VENDOR_SERVICES],
    declarations: [SUPPLIER_BY_ACCOUNT_VIEWS, SUPPLIER_COMPONENTS, SUPPLIER_ENTRY_COMPONENTS, GRID_COLUMN_CELL_COMPONENTS]
})
export class SupplierByAccountModule {}
