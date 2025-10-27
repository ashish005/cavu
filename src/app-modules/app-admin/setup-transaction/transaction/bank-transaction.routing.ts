import {Routes} from "@angular/router";
import {TrxnLayout, TrxnSubLayout} from "./layout/layout";
import {BankView} from "./views/bank.view";
import {BankingAPIResolver} from "./services/api.resolver";
import {TrxnTypeAllocationView} from "./views/trxn-type-allocation.view";
import {BankTrxnView} from "./views/bank-trxn.view";

const getTranslationString = (key)=> `master_type.modules.banking.${key}`;
export const BankTransactionRoutes: Routes = [
    {
        path: '', component: TrxnLayout,
        children: [
            {
                path: '', component: TrxnSubLayout, resolve: { items: BankingAPIResolver },
                children: [
                    { path: '', pathMatch: 'full', redirectTo:'pending' },
                    { path: 'verified', component: BankTrxnView, data: { key: 'verified', title: getTranslationString('trxn-verified.title'), header: getTranslationString('trxn-verified.header') } },
                    { path: 'pending', component: BankTrxnView, data: { key: 'pending', title: getTranslationString('trxn-pending.title'), header: getTranslationString('trxn-pending.header') } },
                ]
            },
            { path: 'bank', component: BankView, data: { title: getTranslationString('type-allocation.title'), header: getTranslationString('type-allocation.header') } },
            { path: 'allocation', component: TrxnTypeAllocationView, data: { title: getTranslationString('type-allocation.title'), header: getTranslationString('type-allocation.header') } },
        ]
    }
];
export const BANK_TRANSACTION_VIEWS = [ TrxnLayout, TrxnSubLayout, BankView, TrxnTypeAllocationView, BankTrxnView ];