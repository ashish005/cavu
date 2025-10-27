import {AccountingAPIResolver} from "./api.resolver";
import { LedgerService, AccountGroupService } from "./ledger.service";
import {
    BankLedgerService,
    CashBookService,
    DayBookService,
    LedgerBookService, LedgerGroupSummaryService, LedgerReportMonthlyService, TrialBalanceByGroupService,
    TrialBalanceByLedgerService
} from "./account-book.service";
import {BalanceSheetReportService, ProfitLossReportService } from "./report.service";

export {AccountingAPIResolver} from "./api.resolver";

export const ACCOUNTING_SERVICES = [
    AccountingAPIResolver,
    LedgerService, AccountGroupService,
    DayBookService, CashBookService, LedgerBookService, BankLedgerService, TrialBalanceByGroupService, TrialBalanceByLedgerService, LedgerGroupSummaryService, LedgerReportMonthlyService,

    BalanceSheetReportService, ProfitLossReportService
];