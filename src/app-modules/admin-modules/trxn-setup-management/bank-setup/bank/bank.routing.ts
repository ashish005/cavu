import {Routes} from "@angular/router";
import {BankView} from "./views/bank.view";

const getTranslationString = (key)=> `master_type.modules.banking.${key}`;
export const BankRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'info' },
    { path: 'info', component: BankView, data: { title: getTranslationString('type-allocation.title'), header: getTranslationString('type-allocation.header') } }
];
export const BANK_VIEWS = [ BankView ];