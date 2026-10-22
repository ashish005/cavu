import {CoreQueryOptions, CoreResource, CoreSerializer} from "@app-global";

// Sales quotes (tenant API api/v1/sales/quotes/*).

export type QuoteStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'expired' | 'accepted' | 'declined' | 'invoiced' | 'cancelled';
export type QuoteLineType = 'Item' | 'Section';

export const QUOTE_STATUS_LABEL: Record<QuoteStatus, string> = {
    draft: 'Draft', pending_approval: 'Awaiting approval', approved: 'Approved', sent: 'Sent', expired: 'Expired', accepted: 'Accepted',
    declined: 'Declined', invoiced: 'Invoiced', cancelled: 'Cancelled'
};
export const QUOTE_STATUS_TONE: Record<QuoteStatus, string> = {
    draft: 'grey', pending_approval: 'warn', approved: 'info', sent: 'info', expired: 'danger', accepted: 'success', declined: 'danger', invoiced: 'success', cancelled: 'grey'
};
export const DECLINE_LABEL: Record<string, string> = {
    price: 'Price too high', competitor: 'Went with a competitor', timing: 'Bad timing', budget: 'No budget', scope: 'Scope did not fit',
    no_response: 'No response', other: 'Other'
};

export class QuoteRow extends CoreResource {
    declare number: string;
    declare revision: number;
    declare title: string | null;
    declare customerAccountId: string | null;
    declare customerName: string;
    declare issueDate: string;
    declare validUntil: string;
    declare status: QuoteStatus;
    declare currencyCode: string;
    declare total: number;
    declare baseTotal: number;
    declare marginPercent: number | null;
    declare ownerName: string | null;
    declare probability: number;
    declare followUpDate: string | null;
    declare daysToExpiry: number | null;
    declare lastSentAt: string | null;
    declare invoiceId: string | null;
}
export const QUOTE_SERIALIZER: CoreSerializer = {fromJson: (json: any) => Object.assign(new QuoteRow(), json), toJson: () => { throw new Error('Read-only.'); }};

export class QuoteQueryOptions extends CoreQueryOptions {
    status: string | null = null;
    search: string | null = null;
    mine = false;
    override toQueryString() { return super.getParamByObject({status: this.status, search: this.search, mine: this.mine || null}); }
}

export interface QuoteSettings {
    quotePrefix: string; defaultValidityDays: number; approvalAmount: number | null; maxDiscountWithoutApproval: number | null; minMarginPercent: number | null;
    defaultTerms: string | null; defaultNotes: string | null; expiryWarningDays: number;
}
export interface QuoteTaxOption { id: string; code: string; name: string; rate: number; scope: string; isDefault: boolean; }
export interface QuoteLookups {
    functionalCurrency: string; branchCurrency: string; pricesIncludeTax: boolean; defaultTaxCodeId: string | null; settings: QuoteSettings;
    taxCodes: QuoteTaxOption[]; incomeAccounts: {id: string; name: string}[]; owners: {userId: string; name: string; email: string | null}[];
    declineReasons: string[]; leadSources: string[]; canApprove: boolean; canManageSettings: boolean; canInvoice: boolean;
}
export interface QuoteCustomer {
    accountId: string; name: string; number: string; email: string | null; phone: string | null; currencyCode: string | null; address: string | null; contactName: string | null;
}
export interface QuoteSummary {
    currencyCode: string; drafts: number; pendingApproval: number; openCount: number; openValue: number; weightedValue: number; expiringSoon: number;
    expired: number; followUpsDue: number; wonThisMonth: number; wonValueThisMonth: number; winRate: number | null; averageDaysToDecision: number | null;
    averageDiscount: number | null;
}

export interface QuoteLine {
    id: string; lineNo: number; lineType: QuoteLineType; description: string; details: string | null; productId: string | null; unit: string | null; quantity: number;
    unitPrice: number; unitCost: number | null; discountRate: number; taxCodeId: string | null; taxCode: string | null; taxRate: number; accountId: string | null;
    accountName: string | null; isOptional: boolean; isSelected: boolean; discountAmount: number; netAmount: number; taxAmount: number; lineTotal: number;
    costAmount: number; marginPercent: number | null;
}
export interface QuoteTax { code: string; component: string; kind: string; rate: number; jurisdiction: string | null; taxable: number; tax: number; }
export interface QuoteActivity { id: string; action: string; summary: string; note: string | null; actorName: string; at: string; }
export interface Quote {
    id: string; number: string; revision: number; title: string | null; status: QuoteStatus; customerAccountId: string | null; customerName: string; isProspect: boolean;
    contactName: string | null; contactEmail: string | null; contactPhone: string | null; address: string | null; issueDate: string; validUntil: string; daysToExpiry: number;
    expectedCloseDate: string | null; followUpDate: string | null; ownerUserId: string | null; ownerName: string | null; probability: number; leadSource: string | null;
    reference: string | null; tags: string | null; currencyCode: string; currencyRate: number; pricesIncludeTax: boolean; subTotal: number; discountTotal: number;
    taxTotal: number; adjustment: number; total: number; baseTotal: number; optionalTotal: number; costTotal: number; marginTotal: number; marginPercent: number | null;
    maxDiscountRate: number; notes: string | null; terms: string | null; internalNote: string | null; approvalReason: string | null; approvedByName: string | null;
    approvedAt: string | null; approvalNote: string | null; changesRequested: boolean; firstSentAt: string | null; lastSentAt: string | null; lastSentTo: string | null;
    sentCount: number; acceptedAt: string | null; acceptedByName: string | null; customerPoNumber: string | null; declinedAt: string | null; declineReason: string | null;
    declineNote: string | null; lostToCompetitor: string | null; invoiceId: string | null; invoiceNumber: string | null; invoiceStatus: string | null;
    invoicedAt: string | null; cancelledAt: string | null; cancelReason: string | null; createdAt: string; statusChangedAt: string; approvalReasons: string[];
    canEdit: boolean; canSubmit: boolean; canApprove: boolean; canSend: boolean; canRevise: boolean; canDecide: boolean; canConvert: boolean; canCancel: boolean;
    canDelete: boolean; lines: QuoteLine[]; taxes: QuoteTax[]; files: {id: string; fileName: string}[]; activity: QuoteActivity[];
    revisions: {revision: number; total: number; reason: string | null; createdAt: string}[]; companyName: string | null;
}

export interface QuoteLineInput {
    lineType: QuoteLineType; description: string; details: string | null; productId: string | null; unit: string | null; quantity: number; unitPrice: number;
    unitCost: number | null; discountRate: number; taxCodeId: string | null; accountId: string | null; isOptional: boolean; isSelected: boolean;
}
export interface QuoteInput {
    customerAccountId: string | null; customerName: string | null; contactName: string | null; contactEmail: string | null; contactPhone: string | null;
    address: string | null; title: string | null; issueDate: string; validUntil: string | null; expectedCloseDate: string | null; followUpDate: string | null;
    ownerUserId: string | null; probability: number | null; leadSource: string | null; reference: string | null; tags: string | null; currencyCode: string | null;
    currencyRate: number | null; pricesIncludeTax: boolean | null; autoTax: boolean; adjustment: number; notes: string | null; terms: string | null;
    internalNote: string | null; lines: QuoteLineInput[]; fileIds: string[];
}
