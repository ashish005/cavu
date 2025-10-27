import {GlobalModule} from "@app-global";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import { QUOTATION_VIEWS, QuotationRoutes } from "./quotation.routing";
import {QUOTE_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(QuotationRoutes),
        GlobalModule
    ],
    declarations: [QUOTATION_VIEWS, QUOTE_GRID_COLUMN_CELL_COMPONENTS]
})
export class QuotationManageModule {}
