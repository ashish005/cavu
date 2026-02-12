export enum VOUCHER_TYPES
{
    PURCHASE = "purchase",
    PURCHASE_RETURN = "purchase_return",
    PAYMENT = "payment",
    RECEIPT = "receipt",
    SALE = "sale",
    SALE_RETURN = "sale_return",
    JOURNAL = "journal",
    CONTRA = "contra",
    QUOTATION = "quotation",
    SALE_ORDER = "sale_order",
    PURCHASE_ORDER = "purchase_order",
    STOCK_TRANSFER = "stock_transfer",
    DEBIT_NOTE = "debit_note",
    CREDIT_NOTE = "credit_note",
    POST_DATED_CHEQUE = "post_dated_cheque",

    // Inventory Vouchers
    RECEIPT_NOTE = "receipt_note",
    REJECTION_IN = "rejection_in",
    REJECTION_OUT = "rejection_out",
    MATERIAL_IN = "material_in",
    MATERIAL_OUT = "material_out",
    STOCK_JOURNAL = "stock_journal",
    PHYSICAL_STOCK = "physical_stock",

    // Optional and Non-Accounting Vouchers
    MEMORANDUM = "memorandum",
    REVERSING_JOURNAL = "reversing_journal",
    OPTIONAL = "optional",
    POST_DATED = "post_dated",
    
    // Order Processing
    JOB_ORDER = "job_order",

    EXPENSE  = "expense" // Office expense
}

export enum INVOICE_UI_VIEW
{
    PURCHASE = "purchase",
    PURCHASE_RETURN = "purchase-return",
    PAYMENT = "payment",
    RECEIPT = "receipt",
    SALE = "sale",
    SALE_RETURN = "sale-return",
    JOURNAL = "journal",
    CONTRA = "contra",
    QUOTATION = "quotation",
    SALE_ORDER = "sale-order",
    PURCHASE_ORDER = "purchase-order",
    STOCK_TRANSFER = "stock-transfer",
    DEBIT_NOTE = "debit-note",
    CREDIT_NOTE = "credit-note",

    // Inventory Vouchers
    RECEIPT_NOTE = "receipt-note",
    REJECTION_IN = "rejection-in",
    REJECTION_OUT = "rejection-out",
    MATERIAL_IN = "material-in",
    MATERIAL_OUT = "material-out",
    STOCK_JOURNAL = "stock-journal",
    PHYSICAL_STOCK = "physical-stock",

    // Optional and Non-Accounting Vouchers
    MEMORANDUM = "memorandum",
    REVERSING_JOURNAL = "reversing-journal",

    // Order Processing
    JOB_ORDER = "job-order",

    EXPENSE  = "expense", // Office expense
    ALL_INVOICE = "all-invoice",
    ALL_USER_TYPE_INVOICE = "user-invoice"
}


export enum VOUCHER_VIEW_TYPE {
    ce = 'ce',
    review = 'review',
    notify = 'notify',
    history = 'history',
};

export enum VOUCHER_INVOICE_VIEW_TYPE {
    notify = 'notify',
    history = 'history',
};