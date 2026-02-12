import {Routes} from "@angular/router";
import {AccountingAPIResolver} from "./services";
import {AccountingLayout} from "./layout/layout";
import {LedgerView} from "./views/ledger.view";
import {AccountingDashboardView} from "./views/dashboard/dashboard.view";

import {BookLayout} from "./layout/book-layout";
import {
    DayBookView, CashBookView, LedgerBookView, BankLedgerView,
    TrialBalanceView, TrialBalanceByLedgerView, LedgerReportMonthlyView
} from "./views/book";

import {ReportLayout} from "./layout/report-layout";
import { BalanceSheetReportView, ProfitLossReportView } from "./views/reports";

import {InvoiceTrxnView} from "./views/trxn/views/trxn.view";
import {TrxnLayout} from "./layout/trxn-layout";

export const AccountingRoutes: Routes = [
    {
        path: '', component: AccountingLayout, resolve: { items: AccountingAPIResolver },
        data: {code: 'FIN'},
        children: [
            { path: '', pathMatch: 'full', redirectTo:'dashboard' },
            { path: 'dashboard', component: AccountingDashboardView, data: {code: "FIN", title: 'Dashboard', header:'Accounting Dashboard'}},
            { path: 'ledger', component: LedgerView, data: {code: "FIN", title: 'Ledger', header:'Ledger'}},
            {
                path: 'book', component: BookLayout, data: {code: 'FIN', title: 'Ledger Book', header: 'Ledger Book'}, //resolve: { items: FinanceAPIResolver },
                children: [
                    { path: '', pathMatch: 'full', redirectTo:'day-book' },
                    { path: 'day-book', component: DayBookView, data: {code: "FIN_DAY_BOOK", title: 'Day Book', header: 'Day Book'} },
                    { path: 'cash-book', component: CashBookView, data: {code: "FIN_CASH_BOOK", title: 'Cash Book', header: 'Cash Book'} },
                    { path: 'account-book', component: LedgerBookView, data: {code: "FIN_ACC_BOOK", title: 'Ledger', header: 'Ledger'} },
                    { path: 'bank-ledger', component: BankLedgerView, data: {code: "FIN_BNK_LEDGER", title: 'Bank Ledger', header: 'Bank'} },
                    { path: 'trial-balance', component: TrialBalanceView, data: { code: "FIN_TB", title: 'Trial Balance', header:'Trial Balance'} },
                    { path: 'ledger-trial-balance', component: TrialBalanceByLedgerView, data: { code: "FIN_TB", title: 'Trial Balance-Ledger', header:'Trial Balance-Ledger'} },
                    { path: 'ledger-report-monthly', component: LedgerReportMonthlyView, data: { code: "FIN_PRL", title: 'Monthly Summary', header:'Monthly Summary'} },
                    { path: 'ledger-report-monthly/:ledgerId', component: LedgerReportMonthlyView, data: { code: "FIN_PRL", title: 'Monthly Summary', header:'Monthly Summary'} }
                ]
            },
            {
                path: 'report', component: ReportLayout, //data: { code: 'FIN_REPORT', title: 'Report', header: 'Manage Finance'},
                children:[
                    { path: '', pathMatch: 'full', redirectTo:'balance-sheet' },
                    { path: 'balance-sheet', component: BalanceSheetReportView, data: { code: "FIN_BS", title: 'Balance Sheet', header:'Balance Sheet'} },
                    { path: 'profit-loss', component: ProfitLossReportView, data: { code: "FIN_PRL", title: 'Profit Loss', header:'Profit Loss'} }
                ]
            }
        ]
    },
    {
        path: 'trxn', component: TrxnLayout,
        data: { code: 'FIN_REPORT', title: 'Invoice Report', header: 'Management Report'},
        children: [
            { path: '', pathMatch: 'full', redirectTo:'all' },
            { path: 'contra', component: InvoiceTrxnView, data: { key: 'CONTRA', code: "FIN_DAY_BOOK", icon: 'fa fa-dashboard' } },
            { path: 'journal', component: InvoiceTrxnView, data: { key: 'JOURNAL', code: "FIN_DAY_BOOK", icon: 'fa fa-dashboard' } },

            { path: 'receipt', component: InvoiceTrxnView, data: { key: 'RECEIPT', code: "FIN_DAY_BOOK", icon: 'fa fa-dashboard' } },
            { path: 'payment', component: InvoiceTrxnView, data: { key: 'PAYMENT', code: "FIN_DAY_BOOK", icon: 'fa fa-dashboard' } },

            { path: 'credit-note', component: InvoiceTrxnView, data: { key: 'CREDIT_NOTE', code: "FIN_DAY_BOOK", icon: 'fa fa-dashboard' } },
            { path: 'debit-note', component: InvoiceTrxnView, data: { key: 'DEBIT_NOTE', code: "FIN_DAY_BOOK", icon: 'fa fa-dashboard' } },

            { path: 'sale', component: InvoiceTrxnView, data: { key: 'SALE', code: "FIN_DAY_BOOK", icon: 'fa fa-dashboard' } },
            { path: 'sale-order', component: InvoiceTrxnView, data: { key: 'SALE_ORDER', code: "FIN_CASH_BOOK", icon: 'fa fa-dashboard' } },
            { path: 'sale-return', component: InvoiceTrxnView, data: { key: 'SALE_RETURN', code: "FIN_CASH_BOOK", icon: 'fa fa-dashboard' } },

            { path: 'quotation', component: InvoiceTrxnView, data: { key: 'QUOTATION', code: "FIN_ACC_BOOK", icon: 'fa fa-dashboard' } },

            { path: 'purchase', component: InvoiceTrxnView, data: { key: 'PURCHASE', code: "", icon: 'fa fa-dashboard' } },
            { path: 'purchase-order', component: InvoiceTrxnView, data: { key: 'PURCHASE_ORDER', code: "", icon: 'fa fa-dashboard' } },
            { path: 'purchase-return', component: InvoiceTrxnView, data: { key: 'PURCHASE_RETURN', code: "", icon: 'fa fa-dashboard' } },

            { path: 'expense', component: InvoiceTrxnView, data: { key: 'EXPENSE', code: "", icon: 'fa fa-dashboard' } },
            { path: 'all', component: InvoiceTrxnView, data: { code: "", icon: 'fa fa-dashboard' } }

        ]
    }
];

export const ACCOUNTING_VIEWS = [
    AccountingLayout,
    AccountingDashboardView,
    LedgerView, BookLayout, DayBookView, CashBookView, LedgerBookView, BankLedgerView,
    TrialBalanceView, TrialBalanceByLedgerView, LedgerReportMonthlyView,
    ReportLayout, BalanceSheetReportView, ProfitLossReportView,
    TrxnLayout, InvoiceTrxnView
];
