/**
 * Shapes of the tenant API `api/v1/parties/*`. Customers, vendors and employees share one party core; each role has
 * its own section, number and ledger account. Money is in the organisation's functional currency.
 */
export type PartyRole = 'customer' | 'vendor' | 'employee';
export type PartyKind = 'Person' | 'Organization';
export type PartyStatus = 'Active' | 'Inactive' | 'Blocked';
export type AddressType = 'Billing' | 'Shipping' | 'RemitTo' | 'Home' | 'Work';
export type BankAccountKind = 'Checking' | 'Savings' | 'Other';
export type PaymentMethod = 'Ach' | 'Check' | 'Wire' | 'Card' | 'Other';
export type Form1099 = 'Nec' | 'Misc';
export type EmploymentStatus = 'Active' | 'OnLeave' | 'Terminated';
export type EmploymentType = 'FullTime' | 'PartTime' | 'Contract' | 'Intern' | 'Seasonal';

export interface Page<T> { items: T[]; total: number; }
export interface NamedRef { id: string; name: string; }

export interface PartyAddress { id?: string | null; type: AddressType; label?: string | null; line1: string; line2?: string | null; city: string; region?: string | null; postalCode?: string | null; countryCode?: string | null; isPrimary: boolean; }
export interface PartyContact { id?: string | null; name: string; jobTitle?: string | null; email?: string | null; phone?: string | null; isPrimary: boolean; }
/** `value` is write-only: send to add/change, leave empty to keep the stored id. */
export interface PartyTaxId { id?: string | null; type: string; countryCode?: string | null; value?: string | null; masked?: string | null; isPrimary: boolean; verifiedAt?: string | null; }
export interface PartyBankAccount { id?: string | null; accountHolderName: string; bankName?: string | null; routingCode?: string | null; accountNumber?: string | null; masked?: string | null; accountKind: BankAccountKind; countryCode?: string | null; currencyCode?: string | null; isPrimary: boolean; }
export interface PartyRelationship { id?: string | null; relatedPartyId: string; type: string; note?: string | null; relatedName?: string | null; }

export interface CustomerSection {
    number?: string | null; accountId?: string | null; paymentTermId?: string | null; creditLimit?: number | null; onHold: boolean; holdReason?: string | null;
    taxExempt: boolean; exemptionCertificateNo?: string | null; exemptionRegion?: string | null; exemptionExpiresOn?: string | null;
    priceListCode?: string | null; salesRepUserId?: string | null; customerSince?: string | null;
}
export interface VendorSection {
    number?: string | null; accountId?: string | null; paymentTermId?: string | null; dbaName?: string | null; paymentMethod: PaymentMethod;
    defaultExpenseAccountId?: string | null; is1099: boolean; form1099?: Form1099 | null; w9ReceivedOn?: string | null; backupWithholding: boolean; vendorSince?: string | null;
}
export interface EmployeeSection {
    number?: string | null; accountId?: string | null; hireDate: string; terminationDate?: string | null; employmentStatus: EmploymentStatus;
    employmentType: EmploymentType; flsaStatus: 'Exempt' | 'NonExempt'; payType: 'Salary' | 'Hourly'; payFrequency: 'Weekly' | 'Biweekly' | 'Semimonthly' | 'Monthly';
    payRate?: number | null; departmentId?: string | null; designationId?: string | null; managerPartyId?: string | null; workBranchId?: string | null;
    workRegion?: string | null; birthDate?: string | null;
}

export interface Party {
    id?: string | null;
    kind: PartyKind;
    displayName: string;
    legalName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    website?: string | null;
    countryCode: string;
    currencyCode?: string | null;
    status: PartyStatus;
    notes?: string | null;
    addresses: PartyAddress[];
    contacts: PartyContact[];
    taxIds: PartyTaxId[];
    bankAccounts: PartyBankAccount[];
    relationships: PartyRelationship[];
    branchIds: string[];
    customer?: CustomerSection | null;
    vendor?: VendorSection | null;
    employee?: EmployeeSection | null;
    hasPortalAccess?: boolean;
    roles?: string[];
}

export interface PartyRow {
    id: string; number: string; displayName: string; kind: PartyKind; status: PartyStatus; email: string | null; phone: string | null;
    city: string | null; region: string | null; balance: number; creditLimit: number | null; onHold: boolean; is1099: boolean; missingW9: boolean;
    department: string | null; designation: string | null; employmentStatus: EmploymentStatus | null; hasPortalAccess: boolean;
}

export interface PaymentTerm { id?: string | null; code: string; name: string; dueDays: number; discountPercent?: number | null; discountDays?: number | null; isDefault: boolean; }
export interface OrgLookup { id?: string | null; code: string; name: string; sortOrder: number; }
export interface TaxIdType { code: string; name: string; forPersons: boolean; forOrganizations: boolean; example: string; }
export interface CountryRules { countryCode: string; taxIdTypes: TaxIdType[]; regions: {code: string; name: string}[]; routingCodeLabel: string; }

export interface PartyLookups {
    canManage: boolean; canSeeSensitive: boolean; countryCode: string; currencyCode: string;
    paymentTerms: PaymentTerm[]; departments: NamedRef[]; designations: NamedRef[]; branches: NamedRef[];
    users: NamedRef[]; expenseAccounts: NamedRef[]; country: CountryRules;
    /** What this organisation calls each role, e.g. customer → Patient (from its user types). */
    roleLabels: Record<string, string>;
}

export interface Aging { current: number; days1To30: number; days31To60: number; days61To90: number; over90: number; total: number; pastDue: number; }
export interface PartySummary {
    role: string; number: string; accountId: string; currencyCode: string; balance: number; creditLimit: number | null; availableCredit: number | null;
    overCreditLimit: boolean; chargedThisYear: number; settledThisYear: number; lastActivity: string | null; aging: Aging; paymentTerm: string | null; netPosition: number;
}
export interface StatementLine { date: string; entryNumber: string | null; documentType: string | null; reference: string | null; description: string | null; charge: number; settlement: number; balance: number; }
export interface Statement { partyName: string; number: string; currencyCode: string; from: string; to: string; opening: number; lines: StatementLine[]; closing: number; totalCharges: number; totalSettlements: number; }
export interface AgingRow { partyId: string; number: string; name: string; paymentTerm: string | null; buckets: Aging; oldestDue: string | null; }
export interface AgingReport { asOf: string; role: string; currencyCode: string; rows: AgingRow[]; totals: Aging; parties: number; }
export interface Form1099Row { partyId: string; number: string; name: string; tinMasked: string | null; hasTin: boolean; w9OnFile: boolean; form: Form1099 | null; paid: number; reportable: boolean; issue: string | null; }
export interface Form1099Report { year: number; threshold: number; rows: Form1099Row[]; reportable: number; withIssues: number; }
export interface Duplicate { partyId: string; displayName: string; reason: string; roles: string[]; }
export interface PartyPick { id: string; displayName: string; email: string | null; roles: string[]; }

/** Labels per role: what the screens call each thing. */
export const ROLE_META: Record<PartyRole, {title: string; singular: string; balanceLabel: string; module: string; icon: string}> = {
    customer: {title: 'Customers', singular: 'customer', balanceLabel: 'Receivable', module: 'FIN', icon: 'fa fa-users'},
    vendor: {title: 'Vendors', singular: 'vendor', balanceLabel: 'Payable', module: 'VEN', icon: 'fa fa-truck'},
    employee: {title: 'Employees', singular: 'employee', balanceLabel: 'Advances due', module: 'EMP', icon: 'fa fa-id-badge'}
};

/** The role a screen manages: route data `role`, looked up the route tree (set by the admin module or a portal route). */
export const roleFrom = (route: {pathFromRoot: {snapshot: {data: any}}[]}): PartyRole =>
    ([...route.pathFromRoot].reverse().map(r => r.snapshot.data?.['role']).find(Boolean) ?? 'customer') as PartyRole;

/** True inside a portal (no admin sidebar, no report links). */
export const embeddedFrom = (route: {pathFromRoot: {snapshot: {data: any}}[]}): boolean =>
    route.pathFromRoot.some(r => r.snapshot.data?.['embedded'] === true);

/** Singular and plural label for a role, using the organisation's own name for it (Patient, Student, Supplier…). */
export const roleLabel = (role: PartyRole, lookups: PartyLookups | null): {singular: string; plural: string} => {
    const own = lookups?.roleLabels?.[role === 'vendor' ? 'vendor' : role];
    const singular = (own || ROLE_META[role].singular).trim();
    const lower = singular.charAt(0).toUpperCase() + singular.slice(1);
    return {singular: lower, plural: /s$/i.test(lower) ? lower : `${lower}s`};
};

export const RELATION_TYPES = [
    {value: 'guardian', label: 'Guardian'}, {value: 'parent_company', label: 'Parent company'}, {value: 'subsidiary', label: 'Subsidiary'},
    {value: 'emergency_contact', label: 'Emergency contact'}, {value: 'spouse', label: 'Spouse'}, {value: 'other', label: 'Other'}
];

export const newParty = (role: PartyRole, countryCode: string): Party => ({
    kind: role === 'employee' ? 'Person' : 'Organization',
    displayName: '', countryCode, status: 'Active',
    addresses: [{type: role === 'employee' ? 'Home' : 'Billing', line1: '', city: '', region: '', postalCode: '', countryCode, isPrimary: true}],
    contacts: [], taxIds: [], bankAccounts: [], relationships: [], branchIds: [],
    customer: role === 'customer' ? {onHold: false, taxExempt: false} : null,
    vendor: role === 'vendor' ? {paymentMethod: 'Ach', is1099: false, backupWithholding: false} : null,
    employee: role === 'employee' ? {hireDate: new Date().toISOString().slice(0, 10), employmentStatus: 'Active', employmentType: 'FullTime', flsaStatus: 'NonExempt', payType: 'Hourly', payFrequency: 'Biweekly'} : null
});

export const money = (value: number | null | undefined, currency: string): string =>
    value === null || value === undefined ? '—' : new Intl.NumberFormat(undefined, {style: 'currency', currency: currency || 'USD', maximumFractionDigits: 2}).format(value);
