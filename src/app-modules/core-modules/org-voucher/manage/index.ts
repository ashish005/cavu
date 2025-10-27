import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NgModule } from "@angular/core";
import {FINANCE_COMPONENT, FINANCE_ENTRY_COMPONENT} from "./components";
import {FINANCE_SERVICES} from "./services";
import { F_LEDGER_GRID_CELL_COMPONENTS } from "./grid-cell-component";
import { FINANCE_INVOICE_TEMPLATE } from "./invoices";
import { FINANCE_ACCOUNT_COMPONENT } from "./account-components";
import { FinancePluginResolver } from "./services/lookup.resolver";
import {FINANCE_POPOVER_COMPONENT} from "./popovers";
import {AccountBookLedgerInfoView} from "./views/account-book-ledger.view";
import {FinanceAccountGroupLedgerView} from "./views/account-group-ledger.view";
import {AccountWiseGridReportView} from "./views/account-wise-grid-report.view";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {InvoiceLayout} from "../create-voucher/layout/invoice.layout";

const FIN_MODULES = [
    AccountBookLedgerInfoView, AccountWiseGridReportView, FinanceAccountGroupLedgerView
];

@NgModule({
    declarations: [
        InvoiceLayout,
        F_LEDGER_GRID_CELL_COMPONENTS, FINANCE_INVOICE_TEMPLATE,
        FINANCE_COMPONENT, FINANCE_ENTRY_COMPONENT, FINANCE_POPOVER_COMPONENT,
        FIN_MODULES, FINANCE_ACCOUNT_COMPONENT
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        //SchedulerPluginModule.forChild()
        RouterModule.forChild([
            /*{
                path: '', component: InvoiceLayout, data: { hasVoucherId: false },
                children: [
                    { path: '', component: ReportVoucherView }
                ]
            },*/
            {
                path: 'create/:voucherMasterType', component: InvoiceLayout, resolve: [FinancePluginResolver], data: { hasVoucherId: false },
            }
        ]),
        GlobalModule
    ],
    providers: [FinancePluginResolver, FINANCE_SERVICES],
    exports: [FINANCE_ACCOUNT_COMPONENT]
})
export class InvoiceCEModule{}
