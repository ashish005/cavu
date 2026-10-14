/**
 * Shapes returned by the tenant API (`{tenant}/api/v1/subscription`). Amounts are calculated by the server;
 * the UI only displays them and never sends prices back.
 */

/** Only used when a response predates currencies; plans, quotes and invoices carry their own `currencyCode`. */
export const DEFAULT_BILLING_CURRENCY = 'USD';

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
    Cash: 'Cash', BankTransfer: 'Bank Transfer', CreditCard: 'Credit Card', DebitCard: 'Debit Card', Upi: 'UPI', Cheque: 'Cheque', Online: 'Online', Other: 'Other'
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

export type BillingInterval = 'Day' | 'Month' | 'Year';

type PlanTerm = Pick<PlanOffer, 'billingInterval' | 'intervalCount' | 'validityInDays'>;

/** One term in words: "month", "3 months", "year", "30 days". */
export const termLabel = (plan: PlanTerm): string => {
    const n = plan.intervalCount || 1;
    switch (plan.billingInterval) {
        case 'Month': return n === 1 ? 'month' : `${n} months`;
        case 'Year': return n === 1 ? 'year' : `${n} years`;
        default: return `${plan.validityInDays} days`;
    }
};

/** How often the plan is billed: "Monthly", "Yearly", or "Every 3 months". */
export const billingLabel = (plan: PlanTerm): string => {
    if ((plan.intervalCount || 1) === 1 && plan.billingInterval === 'Month') { return 'Monthly'; }
    if ((plan.intervalCount || 1) === 1 && plan.billingInterval === 'Year') { return 'Yearly'; }
    return `Every ${termLabel(plan)}`;
};

/** What choosing a plan does now (decided by the API): pay for it, or schedule a cheaper plan for the period end. */
export type PlanOfferAction = 'Purchase' | 'Renew' | 'Upgrade' | 'Downgrade' | 'Unavailable';

/** Actions paid for on the payment page. */
export const PAYABLE_ACTIONS: ReadonlyArray<PlanOfferAction> = ['Purchase', 'Renew', 'Upgrade'];

export interface PlanOffer {
    id: number;
    name: string;
    code: string;
    sortOrder: number;
    isRecommended: boolean;
    /** The plan the subscription is on now, paid up or not. */
    isCurrent: boolean;
    isPurchasable: boolean;
    /** Approximate term length; month and year plans follow the calendar. Use `termLabel` for display. */
    validityInDays: number;
    billingInterval: BillingInterval;
    intervalCount: number;
    currencyCode: string;
    action: PlanOfferAction;
    unavailableReason: string | null;
    rate: number;
    discountPercent: number;
    discountAmount: number;
    taxableAmount: number;
    taxPercent: number;
    taxAmount: number;
    netAmount: number;
}

/** Mirrors the backend `LicenseFeatureKind`. */
export type PlanFeatureKind = 'Module' | 'Seat' | 'Limit' | 'Flag';

export interface PlanFeatureValue {
    planId: number;
    /** Catalog text; display uses `isEnabled` and `limitValue`. */
    value: string;
    isEnabled: boolean;
    /** Null on an enabled value means unlimited. */
    limitValue: number | null;
}

export interface PlanFeature {
    id: number;
    name: string;
    /** For modules, the application module code (FIN, EMP…) used by `moduleGuard`. */
    code: string;
    description: string | null;
    sortOrder: number;
    kind: PlanFeatureKind;
    /** For seats: the org user type code it limits, or '*' for all members. */
    userTypeCode: string | null;
    values: PlanFeatureValue[];
}

export interface BillingContact {
    name: string;
    email: string;
    contactNo: string;
}

export type SubscriptionStatus = 'Active' | 'PastDue' | 'Paused' | 'Canceled' | 'Expired' | 'Suspended';
export type SubscriptionChangeType = 'ChangePlan' | 'Pause' | 'Resume' | 'Cancel';

export interface PendingChange {
    id: string;
    type: SubscriptionChangeType;
    effectiveOn: string;
    targetPlanId: number | null;
    targetPlanName: string | null;
    resumeOn: string | null;
    reason: string | null;
    requestedAt: string;
}

export interface SubscriptionSummary {
    /** Null for an older license whose subscription record is created by the next background run. */
    id: string | null;
    planId: number;
    planName: string | null;
    status: SubscriptionStatus;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    /** Negative once the paid period has passed. */
    daysRemaining: number;
    pausedOn: string | null;
    currencyCode: string;
    pendingChange: PendingChange | null;
    canPause: boolean;
    canCancel: boolean;
    canChangePlan: boolean;
    canResume: boolean;
    pausesUsedThisYear: number;
    maxPausesPerYear: number;
    maxPauseDays: number;
}

export interface SubscriptionOverview {
    software: SoftwareSummary;
    license: LicenseSummary | null;
    plans: PlanOffer[];
    features: PlanFeature[];
    billingContact: BillingContact;
    subscription: SubscriptionSummary | null;
    payment: PaymentSetup | null;
}

/** How this tenant pays: the routed online gateway (null when unavailable) and whether paying by reference is allowed. */
export interface PaymentSetup {
    gatewayCode: string | null;
    gatewayName: string | null;
    manualEnabled: boolean;
}

export interface CheckoutStartRequest {
    idempotencyKey: string;
    planId: number;
    billingName: string;
    billingEmail: string;
    billingContactNo: string | null;
    billingAddress: string | null;
    taxNumber: string | null;
}

export type CheckoutStatus = 'Created' | 'Pending' | 'Fulfilled' | 'Failed' | 'Expired' | 'Canceled' | 'RequiresAttention';

/** An online payment attempt. Send the browser to `checkoutUrl` while it is pending. */
export interface Checkout {
    id: string;
    status: CheckoutStatus;
    checkoutUrl: string | null;
    gatewayCode: string;
    gatewayName: string;
    planId: number;
    planName: string | null;
    kind: PlanPurchaseKind;
    currencyCode: string;
    netAmount: number;
    expiresAt: string;
    message: string | null;
    invoiceId: number | null;
    voucherNo: string | null;
    termFrom: string | null;
    termTo: string | null;
}

export type PlanPurchaseKind = 'New' | 'Extend' | 'Upgrade';

/** `GET v1/subscription/quote`: what paying for a plan now costs and covers. The purchase is charged from a fresh quote. */
export interface PurchaseQuote {
    kind: PlanPurchaseKind;
    planId: number;
    planName: string;
    currencyCode: string;
    termFrom: string;
    termTo: string;
    fromPlanId: number | null;
    fromPlanName: string | null;
    creditDays: number;
    rate: number;
    discountPercent: number;
    discountAmount: number;
    creditAmount: number;
    taxableAmount: number;
    taxPercent: number;
    taxAmount: number;
    netAmount: number;
}

export interface SubscriptionChangeRequest {
    idempotencyKey: string;
    type: SubscriptionChangeType;
    planId?: number | null;
    /** Pause: first paused day; Resume: the day to resume. Omitted means today. (yyyy-MM-dd) */
    effectiveOn?: string | null;
    /** Pause: the day it resumes on its own. (yyyy-MM-dd) */
    resumeOn?: string | null;
    reason?: string | null;
}

export interface SeatUsageLine {
    userTypeCode: string;
    name: string;
    limit: number | null;
    used: number;
}

export interface SubscriptionChangePreview {
    type: SubscriptionChangeType;
    allowed: boolean;
    blockedCode: string | null;
    blockedReason: string | null;
    /** An upgrade: paid on the payment page with `quote`, not scheduled. */
    requiresPayment: boolean;
    isImmediate: boolean;
    effectiveOn: string;
    currentPlanId: number;
    currentPlanName: string | null;
    targetPlanId: number | null;
    targetPlanName: string | null;
    currentPeriodEnd: string;
    newPeriodEnd: string | null;
    resumeOn: string | null;
    quote: PurchaseQuote | null;
    seatsOverLimit: SeatUsageLine[];
    modulesLost: string[];
    replacesChange: PendingChange | null;
}

export interface SubscriptionChangeResult {
    change: PendingChange;
    applied: boolean;
    isReplay: boolean;
    subscription: SubscriptionSummary;
}

/** User-facing wording for a scheduled change. */
export const describeChange = (change: PendingChange): string => {
    switch (change.type) {
        case 'ChangePlan': return `Switch to ${change.targetPlanName ?? 'another plan'}`;
        case 'Pause': return `Pause until ${change.resumeOn ?? '—'}`;
        case 'Resume': return 'Resume';
        case 'Cancel': return 'Cancel subscription';
    }
};

/** Local calendar date as yyyy-MM-dd, the format the API expects for DateOnly. */
export const toIsoDate = (date: Date): string => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const addDays = (isoDate: string, days: number): string => {
    const [y, m, d] = isoDate.split('-').map(Number);
    return toIsoDate(new Date(y, m - 1, d + days));
};

/** Statuses the tenant cannot fix by paying; the API rejects purchases for them. */
const BLOCKED_STATUSES: ReadonlyArray<LicenseStatus> = ['Pending', 'Suspended', 'Revoked'];
export const isPurchaseBlocked = (license: LicenseSummary | null): boolean => !!license && BLOCKED_STATUSES.includes(license.status);

export const isQuantityFeature = (feature: PlanFeature): boolean => feature.kind === 'Seat' || feature.kind === 'Limit';

/**
 * How a plan offers a feature, following the API's rules: a module or flag the plan does not list is not
 * included; a seat or limit the plan does not list is unlimited.
 */
export interface FeatureCell { included: boolean; text: string; }
export const featureCell = (feature: PlanFeature, planId: number): FeatureCell => {
    const value = feature.values.find(v => v.planId === planId);
    if (!isQuantityFeature(feature)) {
        return value?.isEnabled ? {included: true, text: 'Included'} : {included: false, text: 'Not included'};
    }
    if (!value || (value.isEnabled && value.limitValue === null)) {
        return {included: true, text: 'Unlimited'};
    }
    const limit = value.isEnabled ? value.limitValue ?? 0 : 0;
    return {included: limit > 0, text: limit.toLocaleString()};
};

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
    currencyCode: string;
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
    currencyCode: string;
    grossAmount: number;
    discountAmount: number;
    /** Credit for unused days of the previous plan on an upgrade. */
    creditAmount: number;
    taxableAmount: number;
    taxAmount: number;
    netAmount: number;
    paidAmount: number;
    terms: string | null;
    receipts: SoftwareReceipt[];
}
