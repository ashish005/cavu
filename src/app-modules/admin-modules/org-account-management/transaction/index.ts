import {GlobalModule} from "@app-global";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ACCOUNTING_SERVICES} from "./services";
import {ACCOUNTING_VIEWS, AccountingRoutes} from "./accounting.routing";
import {ACCOUNTING_GRID_CELL_COMPONENTS} from "./grid-action-cell";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(AccountingRoutes),
    GlobalModule
  ],
  providers: [ACCOUNTING_SERVICES],
  declarations: [ACCOUNTING_VIEWS, ACCOUNTING_GRID_CELL_COMPONENTS]
})

export class AccountingTrxnModule {
    static forRoot(): ModuleWithProviders<AccountingTrxnModule> {
        return { ngModule: AccountingTrxnModule };
    }
    static forChild(): ModuleWithProviders<AccountingTrxnModule> {
        return { ngModule:  AccountingTrxnModule };
    }
}
