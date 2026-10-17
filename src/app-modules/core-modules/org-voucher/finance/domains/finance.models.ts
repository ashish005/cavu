import {CoreQueryOptions, CoreResource, CoreSerializer} from "@app-global";

// Contracts of the tenant API `api/v1/finance/*` (backend Enricher.BAL/Services/Finance).

export type FinanceKind = 'Invoice' | 'Bill' | 'CreditNote' | 'DebitNote' | 'Receipt' | 'Payment' | 'Journal' | 'Contra';
export type AccountNature = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Income' | 'Expense';
export type TaxScope = 'Sales' | 'Purchases' | 'Both';
export type TaxKind = 'Standard' | 'ZeroRated' | 'Exempt' | 'ReverseCharge' | 'Withholding' | 'OutOfScope';
export type TaxLocation = 'Any' | 'SameRegion' | 'OtherRegion' | 'SameCountry' | 'SameBloc' | 'Abroad';

export const TAX_KIND_LABEL: Record<TaxKind, string> = {
    Standard: 'Standard (charged)', ZeroRated: 'Zero-rated (0%, reported)', Exempt: 'Exempt (reported)', ReverseCharge: 'Reverse charge (buyer accounts for it)',
    Withholding: 'Withholding (deducted from payment)', OutOfScope: 'Out of scope (not reported)'
};
export const TAX_LOCATION_LABEL: Record<TaxLocation, string> = {
    Any: 'Anywhere', SameRegion: 'Same state / province', OtherRegion: 'Other state / province (same country)', SameCountry: 'Same country',
    SameBloc: 'Other EU country', Abroad: 'Abroad (outside the country / EU)'
};
export type ApprovalState = 'None' | 'Pending' | 'Approved' | 'Rejected';

/** How each document kind behaves in the UI. */
export interface KindInfo {
    kind: FinanceKind;
    label: string;
    plural: string;
    icon: string;
    party: 'customer' | 'vendor' | 'account' | null;
    /** Item lines (description, qty, price, tax). */
    items: boolean;
    /** Amount, payment mode, applied to documents. */
    settlement: boolean;
    /** Debit/credit lines. */
    journal: boolean;
    /** What it pays off. */
    settles: FinanceKind | null;
    /** Line accounts offered: income or expense. */
    lineAccounts: 'income' | 'expense' | null;
    lookupKey: 'invoice' | 'bill' | 'creditNote' | 'debitNote' | null;
}

export const KINDS: Record<FinanceKind, KindInfo> = {
    Invoice: {kind: 'Invoice', label: 'Invoice', plural: 'Invoices', icon: 'fa fa-file-text-o', party: 'customer', items: true, settlement: false, journal: false, settles: null, lineAccounts: 'income', lookupKey: 'invoice'},
    CreditNote: {kind: 'CreditNote', label: 'Credit note', plural: 'Credit notes', icon: 'fa fa-undo', party: 'customer', items: true, settlement: false, journal: false, settles: 'Invoice', lineAccounts: 'income', lookupKey: 'creditNote'},
    Receipt: {kind: 'Receipt', label: 'Receipt', plural: 'Money in', icon: 'fa fa-arrow-down', party: 'customer', items: false, settlement: true, journal: false, settles: 'Invoice', lineAccounts: null, lookupKey: null},
    Bill: {kind: 'Bill', label: 'Bill', plural: 'Bills', icon: 'fa fa-file-o', party: 'vendor', items: true, settlement: false, journal: false, settles: null, lineAccounts: 'expense', lookupKey: 'bill'},
    DebitNote: {kind: 'DebitNote', label: 'Debit note', plural: 'Debit notes', icon: 'fa fa-repeat', party: 'vendor', items: true, settlement: false, journal: false, settles: 'Bill', lineAccounts: 'expense', lookupKey: 'debitNote'},
    Payment: {kind: 'Payment', label: 'Payment', plural: 'Money out', icon: 'fa fa-arrow-up', party: 'vendor', items: false, settlement: true, journal: false, settles: 'Bill', lineAccounts: null, lookupKey: null},
    Journal: {kind: 'Journal', label: 'Journal', plural: 'Journals', icon: 'fa fa-book', party: null, items: false, settlement: false, journal: true, settles: null, lineAccounts: null, lookupKey: null},
    Contra: {kind: 'Contra', label: 'Transfer', plural: 'Transfers', icon: 'fa fa-exchange', party: 'account', items: false, settlement: false, journal: true, settles: null, lineAccounts: null, lookupKey: null}
};

/** Display states (computed by the API). */
export const STATUS_LABEL: Record<string, {label: string; tone: string}> = {
    draft: {label: 'Draft', tone: 'grey'},
    awaiting_approval: {label: 'Awaiting approval', tone: 'warn'},
    rejected: {label: 'Rejected', tone: 'danger'},
    approved: {label: 'Approved', tone: 'info'},
    open: {label: 'Open', tone: 'primary'},
    overdue: {label: 'Overdue', tone: 'danger'},
    partially_paid: {label: 'Partly paid', tone: 'warning'},
    paid: {label: 'Paid', tone: 'success'},
    posted: {label: 'Posted', tone: 'success'},
    void: {label: 'Void', tone: 'dark'}
};

const readOnlySerializer = <T extends CoreResource>(Row: new (json: any) => T): CoreSerializer => ({
    fromJson: (json: any) => new Row(json),
    toJson: () => { throw new Error('Grid rows are read-only.'); }
});

// ---------- Documents ----------

export class FinanceDocRow extends CoreResource {
    declare kind: FinanceKind;
    declare number: string;
    declare isDraft: boolean;
    declare date: string;
    declare dueDate: string | null;
    declare partyAccountId: string;
    declare partyName: string;
    declare reference: string | null;
    declare currencyCode: string;
    declare total: number;
    declare settled: number;
    declare balance: number;
    declare status: string;
    declare daysOverdue: number | null;
    declare notes: string | null;
    constructor(json: any = {}) { super(); Object.assign(this, json); }
}
export const FINANCE_DOC_SERIALIZER = readOnlySerializer(FinanceDocRow);

export class FinanceDocQueryOptions extends CoreQueryOptions {
    kind: FinanceKind = 'Invoice';
    status: string | null = null;
    search: string | null = null;
    partyAccountId: string | null = null;
    from: string | null = null;
    to: string | null = null;
    override toQueryString() {
        return super.getParamByObject({kind: this.kind, status: this.status, search: this.search, partyAccountId: this.partyAccountId, from: this.from, to: this.to});
    }
}

export interface FinanceKindSummary {
    drafts: number; awaitingApproval: number; openTotal: number; openCount: number; overdueTotal: number; overdueCount: number;
    settledLast30Days: number; currencyCode: string;
}

export interface FinanceLine {
    id?: string; lineNo?: number; description: string; accountId: string | null; accountName?: string; quantity: number; unitPrice: number;
    discountRate: number; taxCodeId: string | null; taxCode?: string | null; taxRate?: number; netAmount?: number; taxAmount?: number; lineTotal?: number;
    withholdingTaxCodeId?: string | null; withholdingAmount?: number;
}
export interface LedgerLine { accountId: string; accountName: string; accountCode: string | null; debit: number; credit: number; description: string | null; }
export interface FinanceAllocation { id: string; voucherId: string; kind: FinanceKind; number: string; date: string; amount: number; isApplied: boolean; }
export interface FinanceTaxSummary { code: string; component: string; kind: TaxKind; rate: number; jurisdiction: string | null; taxable: number; tax: number; }

export interface FinanceDoc {
    id: string; kind: FinanceKind; number: string; isDraft: boolean; status: string; date: string; dueDate: string | null;
    partyAccountId: string; partyName: string; partyEmail: string | null; partyAddress: string | null; reference: string | null;
    notes: string | null; internalNote: string | null; currencyCode: string; currencyRate: number;
    subTotal: number; discount: number; tax: number; adjustment: number; total: number; settled: number; balance: number; unapplied: number;
    paymentModeId: number | null; paymentMode: string | null;
    approval: ApprovalState; approvalNote: string | null; approvedAt: string | null; postedAt: string | null; voidedAt: string | null; voidReason: string | null;
    recurringId: string | null;
    canEdit: boolean; canPost: boolean; needsApproval: boolean; canVoid: boolean;
    lines: FinanceLine[]; ledgerLines: LedgerLine[]; taxes: FinanceTaxSummary[]; allocations: FinanceAllocation[]; journal: LedgerLine[];
    footer: string | null; paymentInstructions: string | null;
}

export interface JournalLineInput { accountId: string | null; debit: number; credit: number; description: string | null; }
export interface AllocationInput { targetVoucherId: string; amount: number; }

export interface FinanceDocInput {
    kind: FinanceKind;
    partyAccountId: string | null;
    date: string;
    dueDate: string | null;
    reference: string | null;
    notes: string | null;
    internalNote: string | null;
    currencyCode: string | null;
    currencyRate: number | null;
    pricesIncludeTax: boolean | null;
    autoTax?: boolean;
    adjustment: number;
    lines: FinanceLine[];
    journalLines: JournalLineInput[];
    amount: number | null;
    paymentModeId: number | null;
    bankAccountId: string | null;
    allocations: AllocationInput[];
}

export interface FinanceActionRes { document: FinanceDoc; message: string; }

// ---------- Lookups ----------

export interface PartyOption { accountId: string; name: string; number: string; email: string | null; currencyCode: string | null; termDays: number | null; balance: number; }
export interface AccountOption { id: string; name: string; code: string | null; group: string; nature: AccountNature; isBank: boolean; isCash: boolean; }
export interface TaxOption { id: string; code: string; name: string; rate: number; scope: TaxScope; isDefault: boolean; kind: TaxKind; countryCode: string | null; region: string | null; }
export interface TaxSuggestion {
    taxCodeId: string | null; taxCode: string | null; kind: TaxKind | null; branchCountry: string | null; branchRegion: string | null;
    partyCountry: string | null; partyRegion: string | null; location: TaxLocation; partyHasTaxId: boolean; partyExempt: boolean;
}
export interface ModeOption { id: number; code: string; name: string; systemType: string | null; }
export interface OpenDoc { id: string; number: string; date: string; dueDate: string | null; total: number; balance: number; currencyCode: string; }

export interface FinanceLookups {
    functionalCurrency: string;
    pricesIncludeTax: boolean;
    defaultDueDays: number;
    defaultSalesTaxCodeId: string | null;
    defaultPurchaseTaxCodeId: string | null;
    taxCodes: TaxOption[];
    paymentModes: ModeOption[];
    bankAccounts: AccountOption[];
    defaultLineAccounts: Record<string, string | null>;
}

// ---------- Reports ----------

export interface TrialBalanceRow { accountId: string; code: string; name: string; group: string; nature: AccountNature; opening: number; debit: number; credit: number; closing: number; }
export interface TrialBalance { from: string; to: string; currency: string; rows: TrialBalanceRow[]; totalDebit: number; totalCredit: number; closingDebit: number; closingCredit: number; balanced: boolean; }
export interface ReportLine { accountId: string | null; name: string; code: string | null; amount: number; level: number; isTotal: boolean; }
export interface ReportSection { title: string; lines: ReportLine[]; total: number; }
export interface ProfitLoss { from: string; to: string; currency: string; sections: ReportSection[]; revenue: number; expenses: number; netProfit: number; }
export interface BalanceSheet { asOf: string; currency: string; sections: ReportSection[]; assets: number; liabilities: number; equity: number; balanced: boolean; }
export interface LedgerRowItem { transactionId: string; date: string; entryNumber: string; description: string | null; voucherId: string | null; documentType: string | null; debit: number; credit: number; balance: number; party: string | null; }
export interface LedgerReport {
    accountId: string; account: string; code: string | null; nature: AccountNature; currency: string; opening: number; periodDebit: number; periodCredit: number; closing: number;
    lines: {entities: LedgerRowItem[]; count: number; hasNext: boolean; hasPrevious: boolean};
}

export class JournalRow extends CoreResource {
    declare date: string;
    declare entryNumber: string;
    declare description: string | null;
    declare documentType: string | null;
    declare voucherId: string | null;
    declare currency: string;
    declare amount: number;
    declare type: string;
    declare lines: {account: string; code: string | null; debit: number; credit: number; description: string | null}[];
    constructor(json: any = {}) { super(); Object.assign(this, json); }
}
export const JOURNAL_SERIALIZER = readOnlySerializer(JournalRow);
export class JournalQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    from: string | null = null;
    to: string | null = null;
    override toQueryString() { return super.getParamByObject({search: this.search, from: this.from, to: this.to}); }
}

export interface AgingBuckets { current: number; days1To30: number; days31To60: number; days61To90: number; over90: number; total: number; }
export interface FinanceDashboard {
    currency: string; cash: number; receivable: number; receivableOverdue: number; payable: number; payableOverdue: number;
    incomeThisMonth: number; expensesThisMonth: number; profitThisMonth: number; awaitingApproval: number; drafts: number; postingQueue: number; postingFailed: number;
    receivableAging: AgingBuckets; payableAging: AgingBuckets; trend: {month: string; income: number; expenses: number}[]; overdue: FinanceDocRow[];
}

// ---------- Chart of accounts ----------

export interface CoaGroup { id: string; name: string; code: string | null; parentId: string | null; nature: AccountNature; allowPosting: boolean; isSystem: boolean; sortOrder: number | null; }
export interface CoaAccount {
    id: string; name: string; code: string | null; groupId: string; description: string | null; balance: number; isSystem: boolean; isActive: boolean;
    allowPosting: boolean; isBank: boolean; isCash: boolean; currencyCode: string | null; isDefault: boolean;
}
export interface Chart { currency: string; groups: CoaGroup[]; accounts: CoaAccount[]; partyGroups: {groupId: string; name: string; accounts: number; balance: number}[]; }
export interface CoaAccountInput { name: string; code: string | null; groupId: string; description: string | null; isBank: boolean; isCash: boolean; currencyCode: string | null; isActive: boolean; }

// ---------- Settings ----------

export interface TaxComponent { id?: string | null; name: string; rate: number; salesAccountId: string | null; purchaseAccountId: string | null; validFrom: string | null; validTo: string | null; jurisdiction: string | null; }

export class TaxCodeRow extends CoreResource {
    declare code: string;
    declare name: string;
    declare rate: number;
    declare scope: TaxScope;
    declare kind: TaxKind;
    declare region: string | null;
    declare reportingCode: string | null;
    declare packCode: string | null;
    declare components: TaxComponent[];
    declare salesAccountId: string | null;
    declare salesAccount: string | null;
    declare purchaseAccountId: string | null;
    declare purchaseAccount: string | null;
    declare isDefault: boolean;
    declare isActive: boolean;
    declare description: string | null;
    declare countryCode: string | null;
    declare usedOnLines: number;
    constructor(json: any = {}) { super(); Object.assign(this, json); }
}
export const TAX_CODE_SERIALIZER = readOnlySerializer(TaxCodeRow);
export interface TaxCodeInput {
    code: string; name: string; rate: number; scope: TaxScope; kind: TaxKind; salesAccountId: string | null; purchaseAccountId: string | null; isDefault: boolean;
    isActive: boolean; description: string | null; countryCode: string | null; region: string | null; reportingCode: string | null; components: TaxComponent[];
}
export interface TaxRule {
    id: string; priority: number; scope: TaxScope; location: TaxLocation; partyCountry: string | null; partyRegion: string | null; partyHasTaxId: boolean | null;
    partyExempt: boolean | null; originCountry: string | null; taxCodeId: string; taxCode: string; description: string | null; packCode: string | null; isActive: boolean;
}
export type TaxRuleInput = Omit<TaxRule, 'id' | 'taxCode' | 'packCode'>;
export interface TaxRegion { code: string; name: string; rate: number; }
export interface TaxPackInfo { countryCode: string; name: string; system: string; regionsLabel: string | null; regions: TaxRegion[]; regionsRequired: boolean; notes: string; }
export interface TaxPacks { branchCountry: string | null; branchRegion: string | null; packs: TaxPackInfo[]; installed: string[]; }
export interface TaxReportRow { countryCode: string | null; jurisdiction: string | null; code: string; component: string; kind: TaxKind; isSales: boolean; rate: number; reportingCode: string | null; taxable: number; tax: number; documents: number; }
export interface TaxReport { from: string; to: string; currency: string; rows: TaxReportRow[]; outputTax: number; inputTax: number; reverseCharge: number; withheldFromVendors: number; withheldByCustomers: number; netPayable: number; }
export interface BulkResult { created: number; failed: number; queuedForPosting: number; items: {index: number; id: string | null; errorCode: string | null; error: string | null}[]; }

export interface InvoiceSettings {
    billApprovalThreshold: number | null; invoiceApprovalThreshold: number | null; defaultSalesTaxCodeId: string | null; defaultPurchaseTaxCodeId: string | null;
    defaultDueDays: number; invoiceFooter: string | null; paymentInstructions: string | null; pricesIncludeTax: boolean;
}

export class DocumentTypeRow extends CoreResource {
    declare name: string;
    declare masterType: string;
    declare kind: FinanceKind | null;
    declare prefix: string | null;
    declare suffix: string | null;
    declare numberLength: number;
    declare startingNumber: number;
    declare manual: boolean;
    declare numberLabel: string;
    declare dateLabel: string;
    declare showOnMenu: boolean;
    declare isActive: boolean;
    declare defaultAccountId: string | null;
    declare defaultAccount: string | null;
    declare nextNumber: string;
    declare issued: number;
    constructor(json: any = {}) { super(); Object.assign(this, json); }
}
export const DOCUMENT_TYPE_SERIALIZER = readOnlySerializer(DocumentTypeRow);
export interface DocumentTypeInput {
    name: string; prefix: string | null; suffix: string | null; numberLength: number; startingNumber: number; manual: boolean;
    numberLabel: string; dateLabel: string; showOnMenu: boolean; isActive: boolean; defaultAccountId: string | null;
}

export interface AccountingSlot { key: string; label: string; accountId: string | null; accountCode: string | null; accountName: string | null; }
export interface AccountingSettings { functionalCurrency: string; currencyLocked: boolean; accounts: AccountingSlot[]; }

export class PostingJobRow extends CoreResource {
    declare voucherId: string;
    declare voucherNo: string | null;
    declare voucherType: string | null;
    declare voucherDate: string | null;
    declare amount: number | null;
    declare status: 'Pending' | 'Processing' | 'Posted' | 'Dead';
    declare attempts: number;
    declare nextAttemptAt: string;
    declare postedAt: string | null;
    declare errorCode: string | null;
    declare lastError: string | null;
    declare createdDate: string;
    constructor(json: any = {}) { super(); Object.assign(this, json); }
}
export const POSTING_JOB_SERIALIZER = readOnlySerializer(PostingJobRow);
export class PostingJobQueryOptions extends CoreQueryOptions {
    status: string | null = 'Dead';
    search: string | null = null;
    override toQueryString() { return super.getParamByObject({status: this.status, search: this.search}); }
}
export interface PostingSummary { pending: number; processing: number; posted: number; dead: number; oldestPendingSince: string | null; postedLastHour: number; }

export type Frequency = 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
export class RecurringRow extends CoreResource {
    declare name: string;
    declare templateVoucherId: string;
    declare templateNumber: string;
    declare kind: FinanceKind;
    declare partyName: string;
    declare amount: number;
    declare currencyCode: string;
    declare frequency: Frequency;
    declare interval: number;
    declare nextRunDate: string;
    declare endDate: string | null;
    declare remainingCount: number | null;
    declare autoPost: boolean;
    declare isPaused: boolean;
    declare generated: number;
    declare lastRunAt: string | null;
    declare lastVoucherId: string | null;
    declare lastError: string | null;
    constructor(json: any = {}) { super(); Object.assign(this, json); }
}
export const RECURRING_SERIALIZER = readOnlySerializer(RecurringRow);
export interface RecurringInput {
    templateVoucherId: string; name: string; frequency: Frequency; interval: number; nextRunDate: string; endDate: string | null;
    remainingCount: number | null; autoPost: boolean; isPaused: boolean;
}

export class SimpleQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    override toQueryString() { return super.getParamByObject({search: this.search}); }
}

/** Today as yyyy-MM-dd (local). */
export const todayIso = (): string => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const addDaysIso = (iso: string, days: number): string => {
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(y, m - 1, d + days);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
