import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {GlobalModule} from "@app-global";
import {SUPPLIER_COMPONENTS} from "./components";
import {GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {RouterModule} from "@angular/router";
import {Supplier_Routes, VENDOR_VIEWS} from "./manage-supplier.routing";
import {VENDOR_SERVICES} from "./services";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(Supplier_Routes),
      GlobalModule
    ],
    providers: [VENDOR_SERVICES],
    declarations: [VENDOR_VIEWS, GRID_COLUMN_CELL_COMPONENTS, SUPPLIER_COMPONENTS]
})
export class SupplierManagementModule {}
