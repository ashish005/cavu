import {Routes} from "@angular/router";
import {InvoiceTrxnView} from "./views/trxn.view";
import {TrxnLayout} from "./layout/layout";
import {VOUCHER_TYPES} from "@app-global";

export const AccountingRoutes: Routes = [
    {
        path: '', component: TrxnLayout,
        data: { code: 'FIN_REPORT', title: 'Invoice Report', header: 'Management Report'},
        children: [
            { path: '', pathMatch: 'full', redirectTo:'all' },
            { path: VOUCHER_TYPES.CONTRA, component: InvoiceTrxnView, data: { key: 'CONTRA', code: "FIN_DAY_BOOK", icon: 'fa fa-dashboard' } },
            { path: VOUCHER_TYPES.JOURNAL, component: InvoiceTrxnView, data: { key: 'JOURNAL', code: "FIN_DAY_BOOK", icon: 'fa fa-dashboard' } },
            { path: VOUCHER_TYPES.RECEIPT, component: InvoiceTrxnView, data: { key: 'RECEIPT', code: "FIN_DAY_BOOK", icon: 'fa fa-dashboard' } },
            { path: VOUCHER_TYPES.PAYMENT, component: InvoiceTrxnView, data: { key: 'PAYMENT', code: "FIN_DAY_BOOK", icon: 'fa fa-dashboard' } },
            { path: VOUCHER_TYPES.CREDIT_NOTE, component: InvoiceTrxnView, data: { key: 'CREDIT_NOTE', code: "FIN_DAY_BOOK", icon: 'fa fa-dashboard' } },
            { path: VOUCHER_TYPES.DEBIT_NOTE, component: InvoiceTrxnView, data: { key: 'DEBIT_NOTE', code: "FIN_DAY_BOOK", icon: 'fa fa-dashboard' } },
            { path: VOUCHER_TYPES.SALE, component: InvoiceTrxnView, data: { key: 'SALE', code: "FIN_DAY_BOOK", icon: 'fa fa-dashboard' } },
            { path: VOUCHER_TYPES.SALE_ORDER, component: InvoiceTrxnView, data: { key: 'SALE_ORDER', code: "FIN_CASH_BOOK", icon: 'fa fa-dashboard' } },
            { path: VOUCHER_TYPES.SALE_RETURN, component: InvoiceTrxnView, data: { key: 'SALE_RETURN', code: "FIN_CASH_BOOK", icon: 'fa fa-dashboard' } },
            { path: VOUCHER_TYPES.QUOTATION, component: InvoiceTrxnView, data: { key: 'QUOTATION', code: "FIN_ACC_BOOK", icon: 'fa fa-dashboard' } },
            { path: VOUCHER_TYPES.PURCHASE, component: InvoiceTrxnView, data: { key: 'PURCHASE', code: "", icon: 'fa fa-dashboard' } },
            { path: VOUCHER_TYPES.PURCHASE_ORDER, component: InvoiceTrxnView, data: { key: 'PURCHASE_ORDER', code: "", icon: 'fa fa-dashboard' } },
            { path: VOUCHER_TYPES.PURCHASE_RETURN, component: InvoiceTrxnView, data: { key: 'PURCHASE_RETURN', code: "", icon: 'fa fa-dashboard' } },
            { path: VOUCHER_TYPES.EXPENSE, component: InvoiceTrxnView, data: { key: 'EXPENSE', code: "", icon: 'fa fa-dashboard' } },
            { path: 'all', component: InvoiceTrxnView, data: { code: "", icon: 'fa fa-dashboard' } }
        ]
    }
];

export const ACCOUNTING_VIEWS = [
    TrxnLayout, InvoiceTrxnView
];
