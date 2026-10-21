// Contracts of the compliance API (tenant `api/v1/compliance/*`). Dates are ISO yyyy-MM-dd; times are UTC ISO strings.

export type ComplianceCategory = 'Tax' | 'Payroll' | 'Corporate' | 'Licence' | 'DataProtection' | 'HealthSafety' | 'Environment' | 'Industry' | 'Financial' | 'Other';
export type ScheduleKind = 'Periodic' | 'Anniversary' | 'OneTime' | 'OnEvent';
export type LegalForm = 'Unspecified' | 'SoleProprietor' | 'Partnership' | 'Company' | 'NonProfit' | 'PublicBody';
export type ObligationStatus = 'Suggested' | 'Active' | 'Paused' | 'Retired';
export type TaskStatus = 'Open' | 'InProgress' | 'Submitted' | 'Completed' | 'Waived';
export type DisplayStatus = 'open' | 'due_soon' | 'overdue' | 'in_progress' | 'submitted' | 'completed' | 'waived';
export type RegistrationKind = 'Registration' | 'Licence' | 'Permit' | 'Certificate' | 'Membership';
export type TaskAction = 'start' | 'submit' | 'approve' | 'reject' | 'waive' | 'reopen' | 'note';

export const CATEGORY_LABEL: Record<ComplianceCategory, string> = {
    Tax: 'Tax', Payroll: 'Payroll', Corporate: 'Corporate', Licence: 'Licences', DataProtection: 'Data protection', HealthSafety: 'Health & safety',
    Environment: 'Environment', Industry: 'Industry', Financial: 'Financial', Other: 'Other'
};
export const CATEGORY_ICON: Record<ComplianceCategory, string> = {
    Tax: 'fa-percent', Payroll: 'fa-users', Corporate: 'fa-building-o', Licence: 'fa-id-card-o', DataProtection: 'fa-lock', HealthSafety: 'fa-medkit',
    Environment: 'fa-leaf', Industry: 'fa-industry', Financial: 'fa-credit-card', Other: 'fa-circle-o'
};
export const CATEGORIES = Object.keys(CATEGORY_LABEL) as ComplianceCategory[];
export const LEGAL_FORM_LABEL: Record<LegalForm, string> = {
    Unspecified: 'Not set', SoleProprietor: 'Sole proprietor', Partnership: 'Partnership', Company: 'Company / LLC / corporation', NonProfit: 'Non-profit / trust', PublicBody: 'Public body'
};
export const SCHEDULE_LABEL: Record<ScheduleKind, string> = {Periodic: 'Repeats every period', Anniversary: 'Repeats from a date', OneTime: 'Once', OnEvent: 'When something happens'};
export const STATUS_BADGE: Record<DisplayStatus, {label: string; css: string}> = {
    open: {label: 'Open', css: 'info'}, due_soon: {label: 'Due soon', css: 'warning'}, overdue: {label: 'Overdue', css: 'danger'},
    in_progress: {label: 'In progress', css: 'primary'}, submitted: {label: 'In review', css: 'warn'}, completed: {label: 'Done', css: 'success'}, waived: {label: 'Waived', css: 'grey'}
};
export const OBLIGATION_BADGE: Record<ObligationStatus, string> = {Suggested: 'warn', Active: 'success', Paused: 'grey', Retired: 'dark'};
export const ACTION_LABEL: Record<TaskAction, string> = {
    start: 'Start', submit: 'Mark as filed', approve: 'Approve', reject: 'Send back', waive: 'Not needed', reopen: 'Reopen', note: 'Add note'
};
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export interface Page<T> { entities: T[]; count: number; hasNext: boolean; hasPrevious: boolean; }
export interface UserRef { id: string; name: string; }
export interface NamedRef { id: string; name: string; }
export interface ConditionRef { code: string; label: string; question: string; }

export interface ComplianceLookups {
    today: string; currentUserId: string; canWork: boolean; canManage: boolean; canDelete: boolean; currencyCode: string;
    users: UserRef[]; branches: NamedRef[]; conditions: ConditionRef[]; countries: string[];
}

export interface TaskRow {
    id: string; obligationId: string; name: string; periodLabel: string; dueDate: string; status: TaskStatus; displayStatus: DisplayStatus; category: ComplianceCategory;
    countryCode: string | null; formName: string | null; authorityName: string | null; assigneeId: string | null; assignee: string | null; daysLeft: number;
    filedOn: string | null; referenceNo: string | null; isManual: boolean;
}
export interface ComplianceFile { id: string; fileName: string; contentType: string; sizeBytes: number; uploadedAt: string; }
export interface Activity { action: string; fromStatus: string | null; toStatus: string | null; note: string | null; at: string; user: string | null; }
export interface TaskDetail {
    row: TaskRow; periodStart: string; periodEnd: string; reviewerId: string | null; reviewer: string | null; amountPaid: number | null; currencyCode: string | null;
    notes: string | null; waiveReason: string | null; startedAt: string | null; submittedAt: string | null; completedAt: string | null; completedBy: string | null;
    description: string | null; referenceUrl: string | null; penaltyNote: string | null; registration: string | null; files: ComplianceFile[]; activity: Activity[];
    actions: TaskAction[]; canEdit: boolean;
}
export interface TaskQuery {
    status?: string | null; category?: ComplianceCategory | null; assignee?: string | null; obligationId?: string | null; branchId?: string | null;
    from?: string | null; to?: string | null; search?: string | null; skip?: number; take?: number;
}
export interface TaskActionInput {
    action: TaskAction; note?: string | null; filedOn?: string | null; referenceNo?: string | null; amountPaid?: number | null; currencyCode?: string | null; fileIds?: string[];
}
export interface TaskUpdateInput { assigneeId: string | null; reviewerId: string | null; dueDate: string | null; notes: string | null; }
export interface ManualTaskInput { obligationId: string; periodLabel: string; dueDate: string; assigneeId: string | null; notes: string | null; }
export interface CalendarDay { date: string; tasks: TaskRow[]; }

export interface ObligationRow {
    id: string; name: string; category: ComplianceCategory; countryCode: string | null; region: string | null; authorityName: string | null; formName: string | null;
    schedule: string; status: ObligationStatus; isMandatory: boolean; fromCatalog: boolean; ownerId: string | null; owner: string | null; branchId: string | null;
    branch: string | null; nextDue: string | null; openTasks: number; overdueTasks: number; updateAvailable: boolean;
}
export interface ObligationInput {
    name: string; description: string | null; category: ComplianceCategory; countryCode: string | null; region: string | null; authorityName: string | null;
    formName: string | null; referenceUrl: string | null; schedule: ScheduleKind; intervalMonths: number; yearStartMonth: number | null; useFinancialYear: boolean;
    dueMonthOffset: number; dueDay: number; rollForwardWeekend: boolean; leadDays: number; anchorDate: string | null; startDate: string | null; endDate: string | null;
    isMandatory: boolean; ownerId: string | null; reviewerId: string | null; registrationId: string | null; branchId: string | null; notes: string | null;
}
export interface Period { start: string; end: string; due: string; label: string; }
export interface ObligationDetail {
    id: string; values: ObligationInput; status: ObligationStatus; templateId: number | null; templateCode: string | null; penaltyNote: string | null;
    applicabilityNote: string | null; updateAvailable: boolean; scheduleSummary: string; nextPeriods: Period[]; recentTasks: TaskRow[]; registration: string | null;
}

export interface Profile {
    legalForm: LegalForm; conditions: string[]; jurisdictions: string[]; defaultOwnerId: string | null; escalateAfterDays: number; reviewedAt: string | null;
    countries: string[]; regions: string[]; sector: string | null; software: string | null; businessType: string | null; financialYearStartMonth: number;
}
export interface ProfileInput { legalForm: LegalForm; conditions: string[]; jurisdictions: string[]; defaultOwnerId: string | null; escalateAfterDays: number; suggest: boolean; }
export interface CatalogRow {
    id: number; code: string; name: string; description: string | null; category: ComplianceCategory; countryCode: string | null; region: string | null;
    authority: string | null; formName: string | null; schedule: string; isMandatory: boolean; applicabilityNote: string | null; penaltyNote: string | null;
    referenceUrl: string | null; applies: boolean; reasons: string[]; obligationId: string | null; obligationStatus: ObligationStatus | null;
}
export interface BulkResult { changed: number; message: string; }

export interface RegistrationRow {
    id: string; kind: RegistrationKind; name: string; authorityName: string | null; countryCode: string | null; region: string | null; number: string | null;
    issuedOn: string | null; expiresOn: string | null; daysToExpiry: number | null; state: 'active' | 'expiring' | 'expired' | 'closed'; ownerId: string | null;
    owner: string | null; branchId: string | null; branch: string | null; hasCredentials: boolean; files: number;
}
export interface RegistrationInput {
    kind: RegistrationKind; name: string; authorityName: string | null; countryCode: string | null; region: string | null; number: string | null; issuedOn: string | null;
    expiresOn: string | null; renewalLeadDays: number; portalUrl: string | null; portalUsername: string | null; portalSecret: string | null; ownerId: string | null;
    branchId: string | null; notes: string | null; isClosed: boolean; fileIds: string[]; trackRenewal: boolean;
}
export interface RegistrationDetail {
    row: RegistrationRow; portalUrl: string | null; portalUsername: string | null; secretHint: string | null; renewalLeadDays: number; notes: string | null;
    isClosed: boolean; files: ComplianceFile[]; obligations: ObligationRow[];
}
export const REGISTRATION_STATE: Record<RegistrationRow['state'], {label: string; css: string}> = {
    active: {label: 'Valid', css: 'success'}, expiring: {label: 'Renew soon', css: 'warning'}, expired: {label: 'Expired', css: 'danger'}, closed: {label: 'Closed', css: 'grey'}
};

export interface CategoryCount { category: ComplianceCategory; open: number; overdue: number; completedThisYear: number; }
export interface MonthStat { month: string; onTime: number; late: number; missed: number; }
export interface Dashboard {
    open: number; dueThisWeek: number; overdue: number; awaitingReview: number; completedThisMonth: number; onTimeRate: number | null; activeObligations: number;
    suggestedObligations: number; expiringRegistrations: number; profileReviewed: boolean; byCategory: CategoryCount[]; overdues: TaskRow[]; upcoming: TaskRow[];
    expiring: RegistrationRow[]; trend: MonthStat[];
}
export interface ReportRow {
    obligationId: string; name: string; category: ComplianceCategory; countryCode: string | null; due: number; onTime: number; late: number; waived: number;
    open: number; overdue: number; onTimeRate: number | null; amountPaid: number;
}
export interface Report { from: string; to: string; currencyCode: string; due: number; onTime: number; late: number; waived: number; open: number; overdue: number; onTimeRate: number | null; rows: ReportRow[]; }

/** "in 3 days", "today", "5 days overdue". */
export const dueText = (daysLeft: number): string =>
    daysLeft === 0 ? 'due today' : daysLeft === 1 ? 'due tomorrow' : daysLeft > 1 ? `in ${daysLeft} days` : daysLeft === -1 ? '1 day overdue' : `${-daysLeft} days overdue`;
