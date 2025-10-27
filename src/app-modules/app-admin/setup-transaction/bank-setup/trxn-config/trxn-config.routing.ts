import {Routes} from "@angular/router";
import {CardTypeView} from "./views/card-type.view";
import {PaymentSystemTypeView} from "./views/payment-type.view";

const getTranslationString = (key)=> `master_type.modules.banking.${key}`;
export const TrxnConfigRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'card' },
    { path: 'card', component: CardTypeView, data: {title: getTranslationString('transaction.card.title'), header: getTranslationString('transaction.card.header')} },
    { path: 'payment-Type', component: PaymentSystemTypeView, data: {title: getTranslationString('transaction.card.title'), header: getTranslationString('transaction.card.header')} }
];
export const TRXN_CONFIG_VIEWS = [ CardTypeView, PaymentSystemTypeView ];