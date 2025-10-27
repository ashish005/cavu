import {FinanceVoucherService, ReportService} from "./report.service";
import {AccountBookService} from "./account-book.service";
import {FinanceLedgerGroupService} from "./finance-ledger-group.service";
import {
    InvoiceNotificationService,
    NotificationRecipientService
} from "./notification.service";
import {InvoiceHistoryService} from "./invoice-history.service";

export const FINANCE_SERVICES = [
    FinanceVoucherService, ReportService,
    FinanceLedgerGroupService, AccountBookService,
    InvoiceNotificationService, NotificationRecipientService, InvoiceHistoryService
];