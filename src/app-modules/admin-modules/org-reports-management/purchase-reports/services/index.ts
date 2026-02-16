import {
    InvoiceByDayService,
    InvoiceByExecutiveService,
    InvoiceByPaymentService,
    InvoiceByProductService,
    InvoiceByVendorService
} from "./invoice.service";

export const SALE_REPORT_SERVICES = [
    InvoiceByVendorService, InvoiceByProductService, InvoiceByPaymentService, InvoiceByExecutiveService, InvoiceByDayService
];