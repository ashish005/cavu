import {GlobalModule} from "@app-global";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ACCOUNTING_SERVICES} from "./services";
import {ACCOUNTING_REPORT_VIEWS, AccountingReportRoutes} from "./accounting.routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ACCOUNTING_REPORT_COMPONENTS} from "./components";

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(AccountingReportRoutes),
    GlobalModule
  ],
  providers: [ACCOUNTING_SERVICES],
  declarations: [ACCOUNTING_REPORT_VIEWS, ACCOUNTING_REPORT_COMPONENTS]
})

export class AccountingReportModule {
    static forRoot(): ModuleWithProviders<AccountingReportModule> {
        return { ngModule: AccountingReportModule };
    }
    static forChild(): ModuleWithProviders<AccountingReportModule> {
        return { ngModule:  AccountingReportModule };
    }
}
