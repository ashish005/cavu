import {GlobalModule} from "@app-global";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ACCOUNTING_BOOK_SERVICES} from "./services";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ACCOUNTING_BOOK_VIEWS, AccountingBookRoutes} from "./accounting-book.routing";
import {ACCOUNTING_BOOK_COMPONENTS} from "./components";
import {ACCOUNTING_BOOK_GRID_CELL_COMPONENTS} from "./grid-action-cell";

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(AccountingBookRoutes),
    GlobalModule
  ],
  providers: [ACCOUNTING_BOOK_SERVICES],
  declarations: [ACCOUNTING_BOOK_VIEWS, ACCOUNTING_BOOK_COMPONENTS, ACCOUNTING_BOOK_GRID_CELL_COMPONENTS]
})

export class AccountingBookModule {
    static forRoot(): ModuleWithProviders<AccountingBookModule> {
        return { ngModule: AccountingBookModule };
    }
    static forChild(): ModuleWithProviders<AccountingBookModule> {
        return { ngModule:  AccountingBookModule };
    }
}
