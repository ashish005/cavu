import {
    VariantBarcodeCell,
    VariantBrandCell, VariantItemOtherPriceActionCell, VariantItemPriceActionCell,
    VariantNameActionCell,
    VariantProductTypeCell
} from "./variant-grid-cell.component";

import {VoucherPurchasePaymentActionCell, VoucherSaleReceiptActionCell} from "./voucher-grid-cell.component";

export const GRID_COLUMN_CELL_COMPONENTS = [
    VariantBarcodeCell, VariantNameActionCell, VariantItemPriceActionCell, VariantBrandCell, VariantItemOtherPriceActionCell, VariantProductTypeCell,

    VoucherPurchasePaymentActionCell, VoucherSaleReceiptActionCell
];