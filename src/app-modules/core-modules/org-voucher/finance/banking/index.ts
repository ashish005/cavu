// Bank & cash inside the finance workspace (api/v1/finance/banking/*): money accounts, statements, reconciliation,
// bank rules and payment modes.
import {BankingApiService} from './banking-api.service';

export * from './banking.models';
export * from './banking-api.service';
export {FinanceMoneyAccountsView} from './views/money-accounts.view';
export {FinanceBankStatementView} from './views/bank-statement.view';
export {FinanceBankRulesView, FinancePaymentModesView} from './views/banking-settings.view';

export const BANKING_SERVICES = [BankingApiService];
