import {Routes} from "@angular/router";
import {
    DayBookView, CashBookView, LedgerBookView, BankLedgerView,
    TrialBalanceView, TrialBalanceByLedgerView, LedgerReportMonthlyView
} from "./views";
import {BookLayout} from "./layouts/book-layout";

export const AccountingBookRoutes: Routes = [
    {
        path: '', component: BookLayout,// data: {code: 'FIN', title: 'Ledger Book', header: 'Ledger Book'},
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
    }
];

export const ACCOUNTING_BOOK_VIEWS = [
    BookLayout, DayBookView, CashBookView, LedgerBookView, BankLedgerView,
    TrialBalanceView, TrialBalanceByLedgerView, LedgerReportMonthlyView
];
