import {Routes} from "@angular/router";
import {TrxnConfigLayout} from "./layout/layout";
import {VoucherTypeView} from "./views/voucher-type.view";
import {PurchaseTypeView} from "./views/purchase-type.view";
import {SaleTypeView} from "./views/sale-type.view";
import {QuoteTypeView} from "./views/quote-type.view";
import {StockTransferTypeView} from "./views/stock-transfer-type.view";
import {SaleChannelView} from "./views/sale-channel.view";
import {SundryTypeView} from "./views/sundry-type.view";
import {CalcTypeView} from "./views/calc-type.view";

const getTranslationString = (key)=> `master_type.modules.banking.${key}`;
export const VoucherSetupRoutes: Routes = [
    {
        path: '', component: TrxnConfigLayout,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'voucher' },
            { path: 'voucher', component: VoucherTypeView, data: {title: getTranslationString('voucher.type.title'), header: getTranslationString('voucher.type.header')} },
            { path: 'purchase-type', component: PurchaseTypeView, data: {title: getTranslationString('voucher.type.title'), header: getTranslationString('voucher.type.header')} },
            { path: 'sale-type', component: SaleTypeView, data: {title: getTranslationString('voucher.type.title'), header: getTranslationString('voucher.type.header')} },
            { path: 'quote-type', component: QuoteTypeView, data: {title: getTranslationString('voucher.type.title'), header: getTranslationString('voucher.type.header')} },
            { path: 'stock-transfer-type', component: StockTransferTypeView, data: {title: getTranslationString('voucher.type.title'), header: getTranslationString('voucher.type.header')} },
            { path: 'sale-channel', component: SaleChannelView, data: {title: getTranslationString('voucher.type.title'), header: getTranslationString('voucher.type.header')} },
            { path: 'sundry-type', component: SundryTypeView, data: {title: getTranslationString('voucher.type.title'), header: getTranslationString('voucher.type.header')} },
            { path: 'calc-type', component: CalcTypeView, data: {title: getTranslationString('voucher.type.title'), header: getTranslationString('voucher.type.header')} }
        ]
    }
];
export const VOUCHER_SETUP_VIEWS = [
    TrxnConfigLayout,
    VoucherTypeView,
    PurchaseTypeView, SaleTypeView, QuoteTypeView,
    StockTransferTypeView, SaleChannelView, SundryTypeView, CalcTypeView
];