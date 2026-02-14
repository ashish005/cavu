import {GlobalModule} from "@app-global";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ACCOUNTING_SERVICES} from "./services";
import {ACCOUNTING_VIEWS, AccountingRoutes} from "./accounting.routing";
import {ACCOUNTING_COMPONENTS} from "./components";
import {ACCOUNTING_GRID_CELL_COMPONENTS} from "./grid-action-cell";
import {INVOICE_GRID_COLUMN_CELL_COMPONENTS} from "./views/trxn/grid-cells";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(AccountingRoutes),
    GlobalModule
  ],
  providers: [ACCOUNTING_SERVICES],
  declarations: [ACCOUNTING_VIEWS, ACCOUNTING_COMPONENTS, ACCOUNTING_GRID_CELL_COMPONENTS, INVOICE_GRID_COLUMN_CELL_COMPONENTS]
})

export class AccountingModule {
    static forRoot(): ModuleWithProviders<AccountingModule> {
        return { ngModule: AccountingModule };
    }
    static forChild(): ModuleWithProviders<AccountingModule> {
        return { ngModule:  AccountingModule };
    }
}
