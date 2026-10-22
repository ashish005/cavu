import {CoreQueryOptions, CoreResource, CoreSerializer} from "@app-global";

// Expense claims (tenant API api/v1/expenses/*).

export type ClaimStatus = 'draft' | 'submitted' | 'awaiting_finance' | 'approved' | 'partially_paid' | 'paid' | 'returned' | 'cancelled';
export type CategoryKind = 'Standard' | 'Mileage' | 'PerDiem';
export type PaidBy = 'Employee' | 'CompanyCard' | 'PettyCash';
export type PaymentKind = 'Reimbursement' | 'Advance';
/** mine: my claims; team: claims I approve; finance: to post and reimburse; all: everything (EXP.View). */
export type ClaimScope = 'mine' | 'team' | 'finance' | 'all';

export const STATUS_LABEL: Record<ClaimStatus, string> = {
    draft: 'Draft', submitted: 'With manager', awaiting_finance: 'With finance', approved: 'Approved, to reimburse', partially_paid: 'Partly reimbursed',
    paid: 'Reimbursed', returned: 'Returned', cancelled: 'Cancelled'
};
export const STATUS_TONE: Record<ClaimStatus, string> = {
    draft: 'grey', submitted: 'info', awaiting_finance: 'info', approved: 'warn', partially_paid: 'warn', paid: 'success', returned: 'danger', cancelled: 'grey'
};
export const PAID_BY_LABEL: Record<PaidBy, string> = {Employee: 'Me (reimburse)', CompanyCard: 'Company card', PettyCash: 'Petty cash'};
export const FLAG_LABEL: Record<string, string> = {
    receipt_missing: 'No receipt', over_limit: 'Over the limit', late: 'Submitted late', duplicate: 'Possible duplicate', attendees_missing: 'Attendees missing'
};

export interface ExpenseCategory {
    id: string | null; name: string; code: string | null; description: string | null; kind: CategoryKind; accountId: string; accountName: string | null;
    defaultTaxCodeId: string | null; rate: number | null; unit: string | null; limitPerItem: number | null; receiptRequiredAbove: number | null;
    requiresAttendees: boolean; sortOrder: number; isActive: boolean;
}
export interface ExpensePolicy {
    claimPrefix: string; receiptRequiredAbove: number; submitWithinDays: number; requireManagerApproval: boolean; requireJustification: boolean;
    duplicateWindowDays: number; companyCardAccountId: string | null; pettyCashAccountId: string | null; reimbursementBankAccountId: string | null;
}
export interface TaxOption { id: string; code: string; name: string; rate: number; }
export interface AccountOption { id: string; name: string; code: string | null; group: string; isBank: boolean; isCash: boolean; }
export interface ExpenseMe { partyId: string; name: string; number: string; accountId: string; managerPartyId: string | null; managerName: string | null; balance: number; }
export interface ExpenseLookups {
    functionalCurrency: string; branchCurrency: string; me: ExpenseMe | null; policy: ExpensePolicy; categories: ExpenseCategory[]; taxCodes: TaxOption[];
    paymentAccounts: AccountOption[]; expenseAccounts: AccountOption[]; canViewAll: boolean; canCreateForOthers: boolean; canFinance: boolean; isManager: boolean;
}
export interface ExpenseSummary {
    currencyCode: string; myDrafts: number; myInProgress: number; myOwed: number; awaitingMyApproval: number; awaitingFinance: number; toReimburseCount: number;
    toReimburseAmount: number; spendThisMonth: number; spendLastMonth: number; openViolations: number; advancesOutstanding: number;
}

export class ClaimRow extends CoreResource {
    declare number: string;
    declare title: string;
    declare employeePartyId: string;
    declare employeeName: string;
    declare approverName: string | null;
    declare periodFrom: string | null;
    declare periodTo: string | null;
    declare status: ClaimStatus;
    declare currencyCode: string;
    declare total: number;
    declare reimbursableTotal: number;
    declare reimbursedAmount: number;
    declare outstanding: number;
    declare lineCount: number;
    declare receiptCount: number;
    declare violationCount: number;
    declare submittedAt: string | null;
    declare statusChangedAt: string;
    declare costCenter: string | null;
}
export const CLAIM_SERIALIZER: CoreSerializer = {fromJson: (json: any) => Object.assign(new ClaimRow(), json), toJson: () => { throw new Error('Read-only.'); }};

export class ClaimQueryOptions extends CoreQueryOptions {
    scope: ClaimScope = 'mine';
    status: string | null = null;
    search: string | null = null;
    withViolations = false;
    override toQueryString() {
        return super.getParamByObject({scope: this.scope, status: this.status, search: this.search, withViolations: this.withViolations || null});
    }
}

export interface ExpenseLine {
    id: string; lineNo: number; date: string; categoryId: string; categoryName: string; categoryKind: CategoryKind; accountId: string; accountName: string;
    merchant: string | null; description: string; paidBy: PaidBy; quantity: number | null; rate: number | null; originalCurrency: string; originalAmount: number;
    exchangeRate: number; amount: number; taxCodeId: string | null; taxCode: string | null; taxAmount: number; netAmount: number; isBillable: boolean;
    billableCustomerAccountId: string | null; billableCustomerName: string | null; attendees: string | null; receiptFileId: string | null; receiptFileName: string | null;
    noReceiptReason: string | null; flags: string[]; justification: string | null; isRejected: boolean; rejectReason: string | null;
}
export interface ExpensePayment {
    id: string; kind: PaymentKind; date: string; amount: number; currencyCode: string; bankAccountName: string | null; reference: string | null; note: string | null;
    voucherId: string | null; voucherNumber: string | null; isVoided: boolean; claimId: string | null; claimNumber: string | null; employeeName: string;
}
export interface DocFile { id: string; fileName: string; contentType: string; sizeBytes: number; uploadedAt: string; }
export interface Activity { id: string; action: string; summary: string; note: string | null; actorName: string; at: string; }
export interface Claim {
    id: string; number: string; title: string; purpose: string | null; costCenter: string | null; status: ClaimStatus; employeePartyId: string; employeeName: string;
    employeeAccountId: string; approverPartyId: string | null; approverName: string | null; periodFrom: string | null; periodTo: string | null; currencyCode: string;
    currencyRate: number; total: number; taxTotal: number; reimbursableTotal: number; companyPaidTotal: number; billableTotal: number; rejectedTotal: number;
    reimbursedAmount: number; outstanding: number; violationCount: number; createdAt: string; submittedAt: string | null; managerApprovedByName: string | null;
    managerApprovedAt: string | null; postedByName: string | null; postedAt: string | null; postingDate: string | null; journalVoucherId: string | null;
    journalNumber: string | null; returnedAt: string | null; returnReason: string | null; cancelledAt: string | null; cancelReason: string | null;
    employeeBalance: number; isMine: boolean; canEdit: boolean; canSubmit: boolean; canManagerApprove: boolean; canPost: boolean; canReturn: boolean;
    canReimburse: boolean; canCancel: boolean; canVoid: boolean; canDelete: boolean; lines: ExpenseLine[]; byCategory: {category: string; amount: number; lines: number}[];
    payments: ExpensePayment[]; files: DocFile[]; activity: Activity[];
}

export interface LineInput {
    id: string | null; date: string; categoryId: string | null; merchant: string | null; description: string; paidBy: PaidBy; quantity: number | null; rate: number | null;
    currency: string | null; amount: number; exchangeRate: number | null; taxCodeId: string | null; isBillable: boolean; billableCustomerAccountId: string | null;
    attendees: string | null; receiptFileId: string | null; noReceiptReason: string | null; justification: string | null;
}
export interface ClaimInput {
    employeePartyId: string | null; title: string; purpose: string | null; costCenter: string | null; currencyCode: string | null; currencyRate: number | null;
    lines: LineInput[]; fileIds: string[];
}
export interface LineDecision { lineId: string; reject: boolean; reason: string | null; accountId: string | null; }

export class PaymentRow extends CoreResource {
    declare kind: PaymentKind;
    declare date: string;
    declare amount: number;
    declare currencyCode: string;
    declare bankAccountName: string | null;
    declare reference: string | null;
    declare note: string | null;
    declare voucherId: string | null;
    declare voucherNumber: string | null;
    declare isVoided: boolean;
    declare claimId: string | null;
    declare claimNumber: string | null;
    declare employeeName: string;
}
export const PAYMENT_SERIALIZER: CoreSerializer = {fromJson: (json: any) => Object.assign(new PaymentRow(), json), toJson: () => { throw new Error('Read-only.'); }};
export class PaymentQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    kind: PaymentKind | null = null;
    override toQueryString() { return super.getParamByObject({search: this.search, kind: this.kind}); }
}

export interface EmployeeOption { partyId: string; name: string; number: string; accountId: string; managerName: string | null; email: string | null; }
export interface SpendRow { key: string; label: string; claims: number; lines: number; amount: number; tax: number; billable: number; }
export interface SpendReport { from: string; to: string; groupBy: string; currencyCode: string; total: number; rows: SpendRow[]; }

export const todayIso = (): string => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
