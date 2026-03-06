import {FeePaymentService} from "./fee-payment.service";
import {FeeSaleInvoiceService} from "./fee-sale-invoice.service";
import {BatchFeeReceiptService} from "./fee-receipt-invoice.service";
import {FeePaymentAPIResolver} from "./api.resolver";

export const FEE_PAYMENT_SERVICE = [
    FeePaymentAPIResolver, FeePaymentService, FeeSaleInvoiceService, BatchFeeReceiptService
];