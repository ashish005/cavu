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