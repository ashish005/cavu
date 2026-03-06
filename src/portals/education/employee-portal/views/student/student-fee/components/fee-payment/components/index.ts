import {FeeMonthWiseSummaryComponent, FeePeriodWiseSummaryComponent} from "./fee-period-wise-summary.component";
import {BatchReceiptComponent} from "./batch-receipt.component";
import {SundryDetailDirective} from "./sundry-detail";
import {MonthlyInvoiceFormComponent} from "./monthly-invoice-form.component";
import {PaymentFormComponent} from "./payment-form.component";

export const FEE_PAYMENT_COMPONENT = [
    FeePeriodWiseSummaryComponent, FeeMonthWiseSummaryComponent,
    MonthlyInvoiceFormComponent, PaymentFormComponent, SundryDetailDirective, BatchReceiptComponent
];