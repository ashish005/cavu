// Banking (api/v1/finance/banking/*): money accounts, statement lines, reconciliation, bank rules and payment modes.

export type MoneyAccountKind = 'Bank' | 'Cash' | 'CreditCard' | 'Wallet' | 'Clearing';
export type BankFeedStatus = 'Unmatched' | 'Matched' | 'Excluded';
export type BankRuleAction = 'Receipt' | 'Payment' | 'Expense' | 'Income' | 'Transfer';

export const MONEY_KIND_LABEL: Record<MoneyAccountKind, string> = {
    Bank: 'Bank account', Cash: 'Cash', CreditCard: 'Credit card', Wallet: 'Wallet', Clearing: 'Payment gateway'
};
export const MONEY_KIND_ICON: Record<MoneyAccountKind, string> = {
    Bank: 'fa-university', Cash: 'fa-money', CreditCard: 'fa-credit-card', Wallet: 'fa-mobile', Clearing: 'fa-exchange'
};
export const BANK_ACTION_LABEL: Record<BankRuleAction, string> = {
    Receipt: 'Payment from a customer', Payment: 'Payment to a vendor', Expense: 'Expense', Income: 'Other income', Transfer: 'Transfer between accounts'
};
/** Which actions fit money in (true) and money out (false). */
export const BANK_ACTION_IN: Record<BankRuleAction, boolean | null> = {Receipt: true, Payment: false, Expense: false, Income: true, Transfer: null};

export interface MoneyAccountRow {
    id: string; accountId: string; name: string; accountCode: string | null; kind: MoneyAccountKind; bankName: string | null; numberLast4: string | null;
    currencyCode: string; ledgerBalance: number; statementBalance: number | null; statementDate: string | null; unmatched: number;
    lastReconciledOn: string | null; isDefaultForReceipts: boolean; isDefaultForPayments: boolean; branchId: string | null;
}
export interface MoneyAccount {
    row: MoneyAccountRow; accountNumberMasked: string | null; routingMasked: string | null; routingLabel: string | null; bic: string | null; notes: string | null;
}
export interface MoneyAccountInput {
    name: string; kind: MoneyAccountKind; accountId: string | null; bankName: string | null;
    /** Null keeps the stored number; empty clears it. */
    accountNumber: string | null; routing: string | null; routingLabel: string | null; bic: string | null; currencyCode: string | null; branchId: string | null;
    isDefaultForReceipts: boolean; isDefaultForPayments: boolean; notes: string | null; openingBalance: number | null; openingDate: string | null;
}

/** Column positions (0-based) when the statement's columns are not recognised. */
export interface StatementColumns {
    date: number | null; description: number | null; amount: number | null; debit: number | null; credit: number | null; reference: number | null;
    balance: number | null; dateFormat: string | null; outflowsPositive: boolean;
}
export interface StatementImport {
    imported: number; duplicates: number; skipped: number; problems: string[]; from: string | null; to: string | null; columns: string[]; detected: StatementColumns;
}

export interface LedgerCandidate { valueId: string; date: string; amount: number; description: string | null; entryNumber: string; voucherId: string | null; score: number; }
export interface RuleSuggestion {
    ruleId: string; ruleName: string; action: BankRuleAction; partyAccountId: string | null; party: string | null; accountId: string | null; account: string | null;
}
export interface BankFeedLine {
    id: string; date: string; description: string; reference: string | null; amount: number; balance: number | null; status: BankFeedStatus;
    suggestions: LedgerCandidate[]; rule: RuleSuggestion | null; matchedEntries: string[]; voucherId: string | null; note: string | null;
}
export interface GridPage<T> { entities: T[]; count: number; hasNext: boolean; hasPrevious: boolean; }

export interface BankCreateInput {
    action: BankRuleAction; partyAccountId: string | null; accountId: string | null; paymentModeId: number | null; description: string | null;
    applyToOpen: boolean; rememberAs: string | null;
}

export interface UnreconciledEntry { valueId: string; date: string; amount: number; description: string | null; entryNumber: string; voucherId: string | null; }
export interface Reconciliation {
    bankAccountId: string; currencyCode: string; asOf: string; statementBalance: number | null; ledgerBalance: number; difference: number | null;
    unmatchedLines: number; unmatchedTotal: number; unreconciled: UnreconciledEntry[]; lastReconciledOn: string | null;
}

export interface BankRule {
    id: string; name: string; contains: string; moneyIn: boolean | null; bankAccountId: string | null; action: BankRuleAction;
    partyAccountId: string | null; party: string | null; accountId: string | null; account: string | null; priority: number;
}
export interface BankRuleInput {
    name: string; contains: string; moneyIn: boolean | null; bankAccountId: string | null; action: BankRuleAction;
    partyAccountId: string | null; accountId: string | null; priority: number;
}

export interface PaymentModeSetting {
    id: number; code: string; name: string; systemType: string | null; isEnabled: boolean; accountId: string | null; account: string | null; sortOrder: number;
}
export interface PaymentModeInput { paymentModeId: number; isEnabled: boolean; accountId: string | null; sortOrder: number; }
