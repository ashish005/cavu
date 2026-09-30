import {Routes} from "@angular/router";
import {CardTypeView} from "./views/card-type.view";
import {BankTransactionTypeView} from "./views/bank-transaction-type.view";
import {BankAccountTypeView} from "./views/bank-account-type.view";

const getTranslationString = (key)=> `master_type.modules.banking.${key}`;
export const TrxnConfigRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'card' },
    { path: 'card', component: CardTypeView, data: {title: getTranslationString('transaction.card.title'), header: getTranslationString('transaction.card.header')} },
    { path: 'bank-transaction-type', component: BankTransactionTypeView, data: {title: getTranslationString('transaction.card.title'), header: getTranslationString('transaction.card.header')} },
    { path: 'bank-account-type', component: BankAccountTypeView, data: {title: getTranslationString('transaction.card.title'), header: getTranslationString('transaction.card.header')} }
];
export const TRXN_CONFIG_VIEWS = [ CardTypeView, BankTransactionTypeView, BankAccountTypeView ];