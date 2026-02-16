import {
    BankLedgerService,
    CashBookService,
    DayBookService,
    LedgerBookService, LedgerGroupSummaryService, LedgerReportMonthlyService, TrialBalanceByGroupService,
    TrialBalanceByLedgerService
} from "./account-book.service";


export const ACCOUNTING_BOOK_SERVICES = [
    DayBookService, CashBookService, LedgerBookService, BankLedgerService, TrialBalanceByGroupService, TrialBalanceByLedgerService, LedgerGroupSummaryService, LedgerReportMonthlyService,
];