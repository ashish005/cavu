/**
 * Shapes returned by the tenant API (`{tenant}/api/v1/subscription`). Amounts are calculated by the server;
 * the UI only displays them and never sends prices back.
 */

/** Plans are not priced in a currency on the backend yet, so the portal bills in one fixed currency. */
export const SUBSCRIPTION_BILLING_CURRENCY = 'USD';

export type LicenseStatus = 'Pending' | 'Active' | 'Suspended' | 'Expired' | 'Revoked';

/** Mirrors the backend `PaymentMethod` enum; values are sent as numbers. */
export enum PaymentMode {
    BankTransfer = 2,
    CreditCard = 3,
    DebitCard = 4,
    Upi = 5
}

export interface PaymentModeOption {
    id: PaymentMode;
    name: string;
    referenceLabel: string;
    referenceHint: string;
}

/** The modes the API accepts for self-service purchases. */
export const PAYMENT_MODE_OPTIONS: ReadonlyArray<PaymentModeOption> = [
    {id: PaymentMode.BankTransfer, name: 'Bank Transfer', referenceLabel: 'Transfer reference (UTR)', referenceHint: 'The reference shown on your bank statement'},
    {id: PaymentMode.Upi, name: 'UPI', referenceLabel: 'UPI transaction ID', referenceHint: 'The 12-digit ID from your UPI app'},
    {id: PaymentMode.CreditCard, name: 'Credit Card', referenceLabel: 'Card payment reference', referenceHint: 'The transaction ID from the payment receipt'},
    {id: PaymentMode.DebitCard, name: 'Debit Card', referenceLabel: 'Card payment reference', referenceHint: 'The transaction ID from the payment receipt'}
];

/** The backend serialises `PaymentMethod` by name in read models. */
const PAYMENT_MODE_NAMES: Record<string, string> = {
    Cash: 'Cash', BankTransfer: 'Bank Transfer', CreditCard: 'Credit Card', DebitCard: 'Debit Card', Upi: 'UPI', Cheque: 'Cheque', Other: 'Other'
};
export const paymentModeName = (mode: string | null | undefined): string => (mode && PAYMENT_MODE_NAMES[mode]) || mode || '--';

export interface LicenseSetting {
    apiFailureThreshold: number;
    apiKeyGenerationAllowed: boolean;
    licenseValidityWarningDay: number;
    licenseGraceDay: number;
    allowAutoRenewal: boolean;
}

export interface SoftwareSummary {
    id: number;
    name: string;
    code: string;
    description: string | null;
    setting: LicenseSetting | null;
}

export interface LicenseSummary {
    id: number;
    licenseNo: string;
    status: LicenseStatus;
    planId: number;
    planName: string | null;
    validFrom: string;
    validTo: string;
    /** Negative once the term has ended. */
    daysRemaining: number;
    isValid: boolean;
    isExpired: boolean;
    inGracePeriod: boolean;
    showExpiryWarning: boolean;
    lastRenewedAt: string | null;
    remark: string | null;
}

export interface PlanOffer {
    id: number;
    name: string;
    code: string;
    sortOrder: number;
    isRecommended: boolean;
    isCurrent: boolean;
    isPurchasable: boolean;
    validityInDays: number;
    rate: number;
    discountPercent: number;
    discountAmount: number;
    taxableAmount: number;
    taxPercent: number;
    taxAmount: number;
    netAmount: number;
}

export interface PlanFeature {
    id: number;
    name: string;
    description: string | null;
    sortOrder: number;
    values: Array<{planId: number; value: string}>;
}

export interface BillingContact {
    name: string;
    email: string;
    contactNo: string;
}

export interface SubscriptionOverview {
    software: SoftwareSummary;
    license: LicenseSummary | null;
    plans: PlanOffer[];
    features: PlanFeature[];
    billingContact: BillingContact;
}

/** Statuses the tenant cannot fix by paying; the API rejects purchases for them. */
const BLOCKED_STATUSES: ReadonlyArray<LicenseStatus> = ['Pending', 'Suspended', 'Revoked'];
export const isPurchaseBlocked = (license: LicenseSummary | null): boolean => !!license && BLOCKED_STATUSES.includes(license.status);

/** Feature value of a plan, or null when the plan does not list the feature. */
export const featureValue = (feature: PlanFeature, planId: number): string | null =>
    feature.values.find(v => v.planId === planId)?.value ?? null;

export interface SubscriptionPurchaseRequest {
    idempotencyKey: string;
    planId: number;
    paymentMode: PaymentMode;
    paymentReferenceNumber: string;
    billingName: string;
    billingEmail: string;
    billingContactNo: string | null;
    billingAddress: string | null;
    taxNumber: string | null;
    remark: string | null;
}

export interface SubscriptionPurchaseResult {
    licenseId: number;
    licenseNo: string;
    validFrom: string;
    validTo: string;
    invoiceId: number;
    voucherNo: string;
    netAmount: number;
    /** The same idempotency key was already processed; this is the original outcome. */
    isReplay: boolean;
}

export interface SoftwareReceipt {
    id: number;
    voucherNo: string;
    paymentDate: string;
    amount: number;
    paymentMode: string;
    paymentReferenceNumber: string | null;
}

export interface SoftwareInvoiceDetail {
    id: number;
    voucherNo: string;
    voucherDate: string;
    customerName: string | null;
    customerEmailId: string | null;
    customerContactNo: string | null;
    customerAddress: string | null;
    customerTaxNumber: string | null;
    softwareName: string | null;
    planName: string | null;
    licenseNo: string | null;
    validFrom: string | null;
    validTo: string | null;
    description: string | null;
    grossAmount: number;
    discountAmount: number;
    taxableAmount: number;
    taxAmount: number;
    netAmount: number;
    paidAmount: number;
    terms: string | null;
    receipts: SoftwareReceipt[];
}
