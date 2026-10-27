import {CoreQueryOptions, CoreResource, CoreSerializer} from "@app-global";

// Sales quotes (tenant API api/v1/sales/quotes/*).

export type QuoteStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'expired' | 'accepted' | 'declined' | 'invoiced' | 'cancelled';
export type QuoteLineType = 'Item' | 'Section' | 'Charge';

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
    declare pendingStep: string | null;
    declare chargesTotal: number;
    declare costTotal: number;
}
export const QUOTE_SERIALIZER: CoreSerializer = {fromJson: (json: any) => Object.assign(new QuoteRow(), json), toJson: () => { throw new Error('Read-only.'); }};

export class QuoteQueryOptions extends CoreQueryOptions {
    status: string | null = null;
    search: string | null = null;
    mine = false;
    /** Only quotes whose current approval step the caller can approve. */
    awaitingMe = false;
    override toQueryString() { return super.getParamByObject({status: this.status, search: this.search, mine: this.mine || null, awaitingMe: this.awaitingMe || null}); }
}

export interface QuoteSettings {
    quotePrefix: string; defaultValidityDays: number; approvalAmount: number | null; maxDiscountWithoutApproval: number | null; minMarginPercent: number | null;
    defaultTerms: string | null; defaultNotes: string | null; expiryWarningDays: number;
    approvalSteps: QuoteApprovalStepSetting[]; defaultMarkupPercent: number | null; standardCharges: QuoteChargeSetting[];
}
/** An approval step: applies when any condition holds; approved by the role (if any) or administrators. */
export interface QuoteApprovalStepSetting {
    name: string; totalAtLeast: number | null; marginBelow: number | null; discountAbove: number | null; always: boolean; approverRoleId: string | null;
}
export type QuoteChargeBasis = 'fixed' | 'percent_cost' | 'percent_sales';
export interface QuoteChargeSetting { type: string; label: string; basis: QuoteChargeBasis; rate: number; taxCodeId: string | null; }
export interface QuoteOption { code: string; label: string; }
export interface QuoteTaxOption { id: string; code: string; name: string; rate: number; scope: string; isDefault: boolean; }
export interface QuoteLookups {
    functionalCurrency: string; branchCurrency: string; pricesIncludeTax: boolean; defaultTaxCodeId: string | null; settings: QuoteSettings;
    taxCodes: QuoteTaxOption[]; incomeAccounts: {id: string; name: string}[]; owners: {userId: string; name: string; email: string | null}[];
    declineReasons: string[]; leadSources: string[]; canApprove: boolean; canManageSettings: boolean; canInvoice: boolean;
    roles: QuoteOption[]; chargeTypes: QuoteOption[]; chargeBases: QuoteOption[];
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
    vendorQuoteId: string | null; vendorQuoteLineId: string | null; vendorQuoteNumber: string | null; vendorName: string | null; markupPercent: number | null;
    chargeType: string | null; chargeBasis: QuoteChargeBasis | null; chargeRate: number | null;
}
export type QuoteApprovalState = 'pending' | 'approved' | 'rejected' | 'skipped';
export interface QuoteApprovalStep {
    round: number; step: number; name: string; reason: string; approverRole: string | null; status: QuoteApprovalState; decidedByName: string | null;
    decidedAt: string | null; note: string | null; isCurrent: boolean;
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
    chargesTotal: number; approvals: QuoteApprovalStep[]; currentStep: string | null; vendorQuotes: VendorQuoteRow[];
}

export interface QuoteLineInput {
    lineType: QuoteLineType; description: string; details: string | null; productId: string | null; unit: string | null; quantity: number; unitPrice: number;
    unitCost: number | null; discountRate: number; taxCodeId: string | null; accountId: string | null; isOptional: boolean; isSelected: boolean;
    vendorQuoteLineId: string | null; markupPercent: number | null; chargeType: string | null; chargeBasis: QuoteChargeBasis | null; chargeRate: number | null;
}
export interface QuoteInput {
    customerAccountId: string | null; customerName: string | null; contactName: string | null; contactEmail: string | null; contactPhone: string | null;
    address: string | null; title: string | null; issueDate: string; validUntil: string | null; expectedCloseDate: string | null; followUpDate: string | null;
    ownerUserId: string | null; probability: number | null; leadSource: string | null; reference: string | null; tags: string | null; currencyCode: string | null;
    currencyRate: number | null; pricesIncludeTax: boolean | null; autoTax: boolean; adjustment: number; notes: string | null; terms: string | null;
    internalNote: string | null; lines: QuoteLineInput[]; fileIds: string[];
}

// Vendor quotes (tenant API api/v1/sales/vendor-quotes/*): third parties' quotations, compared and costed into client quotes.

export type VendorQuoteStatus = 'received' | 'shortlisted' | 'selected' | 'rejected';
export const VENDOR_QUOTE_STATUS_LABEL: Record<VendorQuoteStatus, string> = {received: 'Received', shortlisted: 'Shortlisted', selected: 'Selected', rejected: 'Rejected'};
export const VENDOR_QUOTE_STATUS_TONE: Record<VendorQuoteStatus, string> = {received: 'grey', shortlisted: 'info', selected: 'success', rejected: 'danger'};

export class VendorQuoteRow extends CoreResource {
    declare number: string;
    declare status: VendorQuoteStatus;
    declare vendorName: string;
    declare vendorAccountId: string | null;
    declare vendorReference: string | null;
    declare subject: string | null;
    declare quoteDate: string;
    declare validUntil: string | null;
    declare leadTimeDays: number | null;
    declare currencyCode: string;
    declare total: number;
    declare baseTotal: number;
    declare salesQuoteId: string | null;
    declare salesQuoteNumber: string | null;
    declare expired: boolean;
    declare lineCount: number;
    declare usedLines: number;
}
export const VENDOR_QUOTE_SERIALIZER: CoreSerializer = {fromJson: (json: any) => Object.assign(new VendorQuoteRow(), json), toJson: () => { throw new Error('Read-only.'); }};

export class VendorQuoteQueryOptions extends CoreQueryOptions {
    status: string | null = 'open';
    search: string | null = null;
    salesQuoteId: string | null = null;
    override toQueryString() { return super.getParamByObject({status: this.status, search: this.search, salesQuoteId: this.salesQuoteId}); }
}

export interface VendorQuoteLine {
    id: string; lineNo: number; description: string; code: string | null; unit: string | null; quantity: number; unitCost: number; taxRate: number;
    netAmount: number; taxAmount: number; usedOnQuotes: number;
}
export interface VendorQuote {
    row: VendorQuoteRow; paymentTerms: string | null; currencyRate: number; subTotal: number; taxTotal: number; notes: string | null; rejectReason: string | null;
    captureId: string | null; lines: VendorQuoteLine[]; files: {id: string; fileName: string}[];
}
export interface VendorQuoteLineInput { description: string; code: string | null; unit: string | null; quantity: number; unitCost: number; taxRate: number; }
export interface VendorQuoteInput {
    vendorAccountId: string | null; vendorName: string | null; vendorReference: string | null; subject: string | null; quoteDate: string; validUntil: string | null;
    leadTimeDays: number | null; paymentTerms: string | null; currencyCode: string | null; currencyRate: number | null; salesQuoteId: string | null;
    notes: string | null; lines: VendorQuoteLineInput[];
}
export interface VendorLinesToQuoteInput {
    salesQuoteId: string | null; customerAccountId: string | null; customerName: string | null; title: string | null; lineIds: string[];
    markupPercent: number | null; addStandardCharges: boolean;
}
export interface VendorComparisonCell { vendorQuoteId: string; lineId: string; quantity: number; unitCost: number; baseUnitCost: number; baseAmount: number; }
export interface VendorComparisonItem { description: string; quantity: number; cells: VendorComparisonCell[]; bestVendorQuoteId: string | null; }
export interface VendorQuoteComparison { quotes: VendorQuoteRow[]; items: VendorComparisonItem[]; currency: string; }
