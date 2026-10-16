import {CoreQueryOptions, CoreResource, CoreSerializer} from "@app-global";

// Contracts of the tenant API `api/v1/org-admin/*` (backend Enricher.BAL/Services/Org/Admin/OrgAdminContracts.cs).

export interface LookupItem { id: string; name: string; code?: string | null; }

// ---------- Profile, settings, branding, features ----------

export interface OrgProfile {
    name: string;
    legalName?: string | null;
    address?: string | null;
    city?: string | null;
    region?: string | null;
    postalCode?: string | null;
    contactNo?: string | null;
    contactEmail?: string | null;
    website?: string | null;
    taxRegistrationNo?: string | null;
    establishedDate?: string | null;
    contactPersonName?: string | null;
    contactPersonEmail?: string | null;
    contactPersonMobile?: string | null;
}

export interface OrgProfileRes {
    id: string;
    orgCode: string;
    profile: OrgProfile;
    countryName: string | null;
    businessType: string | null;
    licenseNo: string | null;
    modifiedAt: string | null;
}

export interface OrgSettings {
    languageId: number | null;
    currencyId: number | null;
    timeZone: string;
    dateFormat: string;
    dateSeparator: string | null;
    startWeekDay: number;
    fyStartDay: number;
    fyStartMonth: number;
    fyCloseDay: number;
    fyCloseMonth: number;
    officeStart: string;
    officeEnd: string;
}

export interface OrgSettingsRes {
    settings: OrgSettings;
    languages: LookupItem[];
    currencies: LookupItem[];
    timeZones: LookupItem[];
    dateFormats: string[];
}

export type BrandingSlot = 'logo' | 'favicon' | 'login-image';

export interface BrandingImage { id: string; fileName: string; contentType: string; sizeBytes: number; url: string; }

export interface Branding {
    colors: {primaryColor: string | null; accentColor: string | null};
    logo: BrandingImage | null;
    favicon: BrandingImage | null;
    loginImage: BrandingImage | null;
}

export interface Feature {
    code: string;
    name: string;
    description: string;
    group: string;
    moduleCode: string | null;
    enabled: boolean;
    available: boolean;
    unavailableReason: string | null;
}

export interface ModuleState { code: string; name: string; enabled: boolean; }

export interface FeaturesRes { features: Feature[]; modules: ModuleState[]; planName: string | null; }

// ---------- Roles, permissions, members ----------

export interface PermissionDef { code: string; name: string; group: string; moduleCode: string | null; description: string | null; }

export interface PermissionGroup { group: string; moduleCode: string | null; moduleEnabled: boolean; permissions: PermissionDef[]; }

export interface RoleLookups { userTypes: LookupItem[]; permissionGroups: PermissionGroup[]; roles: RoleRow[]; }

export interface RoleDto { name: string; description: string | null; userTypeId: string; isActive: boolean; permissions: string[]; }

export interface RoleRes { role: RoleRow; permissions: string[]; }

/** Grids are read from the API as is; computed getters feed simple columns. */
const readOnlySerializer = <T extends CoreResource>(Row: new (json: any) => T): CoreSerializer => ({
    fromJson: (json: any) => new Row(json),
    toJson: () => { throw new Error('Grid rows are read-only.'); }
});

/** Row of `GET v1/org-admin/roles`. */
export class RoleRow extends CoreResource {
    declare code: string;
    declare name: string;
    declare description: string | null;
    declare userTypeId: string;
    declare userTypeName: string;
    declare isSystemRole: boolean;
    declare isActive: boolean;
    declare allPermissions: boolean;
    declare permissionCount: number;
    declare memberCount: number;
    declare modifiedAt: string | null;

    constructor(json: any = {}) { super(); Object.assign(this, json); }

    get permissionLabel(): string { return this.allPermissions ? 'All (administrator)' : `${this.permissionCount}`; }
}
export const ROLE_SERIALIZER = readOnlySerializer(RoleRow);

export interface MemberRoleRef { id: string; name: string; code: string; }

/** Row of `GET v1/org-admin/members`. */
export class MemberRow extends CoreResource {
    declare membershipId: string;
    declare userId: string;
    declare name: string;
    declare email: string;
    declare userTypeId: string;
    declare userTypeName: string;
    declare roles: MemberRoleRef[];
    declare branchCount: number;
    declare allBranches: boolean;
    declare isActive: boolean;
    declare validUntil: string | null;

    constructor(json: any = {}) { super(); Object.assign(this, json); this.id = json?.membershipId; }

    get branchLabel(): string { return this.allBranches ? 'All branches' : `${this.branchCount}`; }
}
export const MEMBER_SERIALIZER = readOnlySerializer(MemberRow);

export class RoleQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    userTypeId: string | null = null;
    override toQueryString() { return super.getParamByObject({search: this.search, userTypeId: this.userTypeId}); }
}

export class MemberQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    userTypeId: string | null = null;
    roleId: string | null = null;
    active: '' | 'true' | 'false' = '';
    override toQueryString() {
        return super.getParamByObject({search: this.search, userTypeId: this.userTypeId, roleId: this.roleId, active: this.active});
    }
}

// ---------- Integrations ----------

export type IntegrationCategory = 'Email' | 'Sms' | 'WhatsApp' | 'Slack' | 'Teams' | 'Push' | 'Payment' | 'Webhook';
export type IntegrationHealth = 'Unknown' | 'Healthy' | 'Failing';

export interface IntegrationField {
    key: string;
    label: string;
    type: 'text' | 'email' | 'url' | 'number' | 'password' | 'select' | 'bool' | 'textarea';
    required: boolean;
    secret: boolean;
    placeholder: string | null;
    help: string | null;
    options: string[] | null;
}

export interface IntegrationProvider {
    code: string;
    category: IntegrationCategory;
    name: string;
    description: string;
    fields: IntegrationField[];
    supportsTestMessage: boolean;
    hasInboundWebhook: boolean;
    docsUrl: string | null;
}

export interface IntegrationCategoryDef { category: IntegrationCategory; name: string; description: string; usedForNotifications: boolean; }

export interface IntegrationCatalog { categories: IntegrationCategoryDef[]; providers: IntegrationProvider[]; webhookEvents: string[]; }

/** Row of `GET v1/org-admin/integrations`. */
export class IntegrationRow extends CoreResource {
    declare category: IntegrationCategory;
    declare provider: string;
    declare providerName: string;
    declare name: string;
    declare isEnabled: boolean;
    declare isDefault: boolean;
    declare health: IntegrationHealth;
    declare lastError: string | null;
    declare lastTestedAt: string | null;
    declare lastUsedAt: string | null;
    declare eventCount: number;
    declare createdAt: string;

    constructor(json: any = {}) { super(); Object.assign(this, json); }
}
export const INTEGRATION_SERIALIZER = readOnlySerializer(IntegrationRow);

export interface IntegrationDto {
    category: IntegrationCategory;
    provider: string;
    name: string;
    isEnabled: boolean;
    isDefault: boolean;
    settings: Record<string, string | null>;
    secrets: Record<string, string | null>;
    events: string[];
}

export interface IntegrationRes {
    integration: IntegrationRow;
    settings: Record<string, string | null>;
    secretHints: Record<string, string>;
    events: string[];
    inboundUrl: string | null;
}

export interface IntegrationSavedRes { integration: IntegrationRes; generatedSecret: string | null; }

export interface IntegrationTestRes { success: boolean; message: string; responseCode: number | null; durationMs: number; }

export class IntegrationQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    category: IntegrationCategory | null = null;
    /** The page's categories, used when no single category is chosen. */
    categories: IntegrationCategory[] = [];
    override toQueryString() {
        return super.getParamByObject({search: this.search, category: this.category, categories: this.category ? null : this.categories.join(',')});
    }
}

export type IntegrationLogKind = 'Test' | 'Outbound' | 'Inbound' | 'Notification';
export type IntegrationLogStatus = 'Pending' | 'Succeeded' | 'Failed';

/** Row of `GET v1/org-admin/integrations/activity`. */
export class IntegrationLogRow extends CoreResource {
    declare integrationId: string;
    declare integrationName: string;
    declare provider: string;
    declare kind: IntegrationLogKind;
    declare status: IntegrationLogStatus;
    declare eventName: string | null;
    declare entityType: string | null;
    declare entityId: string | null;
    declare responseCode: number | null;
    declare error: string | null;
    declare attempts: number;
    declare nextAttemptAt: string | null;
    declare durationMs: number | null;
    declare createdAt: string;
    declare completedAt: string | null;

    constructor(json: any = {}) { super(); Object.assign(this, json); }

    get kindLabel(): string {
        return ({Test: 'Test', Outbound: 'Webhook sent', Inbound: 'Received', Notification: 'Notification'} as Record<string, string>)[this.kind] ?? this.kind;
    }
    get recordLabel(): string { return this.entityType ? `${this.entityType} ${this.entityId ?? ''}`.trim() : '--'; }
}
export const INTEGRATION_LOG_SERIALIZER = readOnlySerializer(IntegrationLogRow);

export interface IntegrationLogRes { log: IntegrationLogRow; requestJson: string | null; responseBody: string | null; }

export class IntegrationLogQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    integrationId: string | null = null;
    status: IntegrationLogStatus | null = null;
    kind: IntegrationLogKind | null = null;
    override toQueryString() {
        return super.getParamByObject({search: this.search, integrationId: this.integrationId, status: this.status, kind: this.kind});
    }
}

/** Integration pages: which categories each one lists (route data `categories`). */
export const INTEGRATION_PAGES: Record<string, {title: string; categories: IntegrationCategory[]; description: string}> = {
    messaging: {
        title: 'Messaging',
        categories: ['Email', 'Sms', 'WhatsApp', 'Slack', 'Teams'],
        description: 'Send notifications from your own email, SMS, WhatsApp, Slack and Teams accounts. The default connection of each kind is used; without one, the application\'s own sender is used.'
    },
    payments: {
        title: 'Payment gateways',
        categories: ['Payment'],
        description: 'Connect your Stripe or Razorpay account. Payments they report become payment events your automation rules can act on.'
    },
    webhooks: {
        title: 'Webhooks',
        categories: ['Webhook'],
        description: 'Send events from your records to other systems. Each delivery is signed and retried for 24 hours.'
    }
};

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ---------- Branches, hosts, member types, requirements, theme ----------

export type BranchSeedStatus = 'Pending' | 'Queued' | 'Processing' | 'Completed' | 'Failed';

/** Row of `GET v1/org-admin/branches`. */
export class BranchRow extends CoreResource {
    declare name: string;
    declare address: string | null;
    declare websiteUrl: string | null;
    declare contactName: string | null;
    declare contactNo: string | null;
    declare emailId: string | null;
    declare isHeadBranch: boolean;
    declare isSelfAdministration: boolean;
    declare isActive: boolean;
    declare seedStatus: BranchSeedStatus;
    declare seedLastError: string | null;
    declare seedCompletedAt: string | null;
    declare memberCount: number;
    declare createdAt: string;

    constructor(json: any = {}) { super(); Object.assign(this, json); }

    get contactLabel(): string { return [this.contactName, this.contactNo, this.emailId].filter(Boolean).join(' · ') || '--'; }
}
export const BRANCH_SERIALIZER = readOnlySerializer(BranchRow);

export interface BranchDto {
    name: string;
    address: string | null;
    websiteUrl: string | null;
    contactName: string | null;
    contactNo: string | null;
    emailId: string | null;
    isSelfAdministration: boolean;
    isActive: boolean;
}

export class BranchQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    active: '' | 'true' | 'false' = '';
    override toQueryString() { return super.getParamByObject({search: this.search, active: this.active}); }
}

/** Row of `GET v1/org-admin/hosts`. */
export class HostRow extends CoreResource {
    declare hostName: string;
    declare enable: boolean;
    declare isUnderConstruction: boolean;
    declare createdAt: string;
    constructor(json: any = {}) { super(); Object.assign(this, json); }
}
export const HOST_SERIALIZER = readOnlySerializer(HostRow);

export interface HostDto { hostName: string; enable: boolean; isUnderConstruction: boolean; }

export class SearchQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    override toQueryString() { return super.getParamByObject({search: this.search}); }
}

/** Row of `GET v1/org-admin/member-types`. */
export class MemberTypeRow extends CoreResource {
    declare code: string;
    declare name: string;
    declare registrationNoFormat: string | null;
    declare startNo: number;
    declare accountGroupName: string | null;
    declare memberCount: number;
    declare roleCount: number;
    declare relations: LookupItem[];
    constructor(json: any = {}) { super(); Object.assign(this, json); }

    get relationLabel(): string { return this.relations?.length ? this.relations.map(r => r.name).join(', ') : '--'; }
}
export const MEMBER_TYPE_SERIALIZER = readOnlySerializer(MemberTypeRow);

export type RequirementKind = 'Contact' | 'Address' | 'Document';

export interface RequirementRule { userTypeId: string; userTypeName?: string; isMandatory: boolean; verificationRequired: boolean; }

/** Row of `GET v1/org-admin/requirements`. */
export class RequirementRow extends CoreResource {
    declare kind: RequirementKind;
    declare code: string;
    declare name: string;
    declare description: string | null;
    declare maxSizeMb: number | null;
    declare allowedExtensions: string | null;
    declare isSystem: boolean;
    declare isActive: boolean;
    declare rules: RequirementRule[];
    constructor(json: any = {}) { super(); Object.assign(this, json); }
}
export const REQUIREMENT_SERIALIZER = readOnlySerializer(RequirementRow);

export interface RequirementDto {
    kind: RequirementKind;
    name: string;
    description: string | null;
    maxSizeMb: number | null;
    allowedExtensions: string | null;
    isActive: boolean;
    rules: RequirementRule[];
}

export class RequirementQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    kind: RequirementKind = 'Contact';
    override toQueryString() { return super.getParamByObject({search: this.search, kind: this.kind}); }
}

// ---------- Dashboard portlets ----------

export interface PortletRole { roleId: string; roleName: string; userTypeId: string; userTypeName: string; isVisible: boolean; isExplicit: boolean; hasPermission: boolean; }

/** Row of `GET v1/org-admin/portlets`. */
export class PortletRow extends CoreResource {
    declare code: string;
    declare name: string;
    declare description: string;
    declare moduleCode: string;
    declare moduleInPlan: boolean;
    declare permission: string | null;
    declare permissionName: string | null;
    declare userTypes: string[];
    declare isEnabled: boolean;
    declare sortOrder: number;
    declare width: number;
    declare visibleRoles: number;
    declare eligibleRoles: number;
    declare roles: PortletRole[];
    constructor(json: any = {}) { super(); Object.assign(this, json); this.id = json?.code; }

    get audienceLabel(): string { return (this.userTypes ?? []).join(', '); }
    get widthLabel(): string { return ({3: 'Quarter', 4: 'Third', 6: 'Half', 8: 'Two thirds', 12: 'Full'} as Record<number, string>)[this.width] ?? `${this.width}/12`; }
}
export const PORTLET_SERIALIZER = readOnlySerializer(PortletRow);

export interface PortletSettings { isEnabled: boolean; sortOrder: number; width: number; roles: {roleId: string; isVisible: boolean}[]; }

export class PortletQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    userType: string | null = null;
    override toQueryString() { return super.getParamByObject({search: this.search, userType: this.userType}); }
}

// ---------- Support console ----------

/** Row of `GET v1/support/tickets?scope=all`. */
export class SupportTicketRow extends CoreResource {
    declare number: string;
    declare type: string;
    declare severity: 'Low' | 'Normal' | 'High' | 'Critical';
    declare status: 'Open' | 'InProgress' | 'WaitingOnReporter' | 'Resolved' | 'Closed';
    declare subject: string;
    declare module: string | null;
    declare reporterName: string;
    declare assigneeName: string | null;
    declare createdAt: string;
    declare dueAt: string;
    declare isOverdue: boolean;
    declare lastActivityAt: string | null;
    declare replies: number;
    declare fingerprint: string | null;
    declare rating: number | null;
    constructor(json: any = {}) { super(); Object.assign(this, json); }
}
export const SUPPORT_TICKET_SERIALIZER = readOnlySerializer(SupportTicketRow);

export class SupportTicketQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    status: string | null = null;
    severity: string | null = null;
    type: string | null = null;
    openOnly = true;
    assignedToMe = false;
    overdue = false;
    fingerprint: string | null = null;
    override toQueryString() {
        return super.getParamByObject({
            scope: 'all', search: this.search, status: this.status, severity: this.severity, type: this.type,
            openOnly: this.openOnly && !this.status ? 'true' : null, assignedToMe: this.assignedToMe ? 'true' : null,
            overdue: this.overdue ? 'true' : null, fingerprint: this.fingerprint
        });
    }
}

/** Row of `GET v1/support/feedback`. */
export class FeedbackRow extends CoreResource {
    declare kind: string;
    declare rating: number | null;
    declare message: string | null;
    declare userName: string | null;
    declare module: string | null;
    declare pageUrl: string | null;
    declare status: 'New' | 'Reviewed' | 'Planned' | 'Done' | 'Dismissed';
    declare reviewNote: string | null;
    declare createdAt: string;
    constructor(json: any = {}) { super(); Object.assign(this, json); }
    get stars(): string { return this.rating ? '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating) : '—'; }
}
export const FEEDBACK_SERIALIZER = readOnlySerializer(FeedbackRow);

export class FeedbackQueryOptions extends CoreQueryOptions {
    search: string | null = null;
    status: string | null = null;
    kind: string | null = null;
    maxRating: number | null = null;
    module: string | null = null;
    override toQueryString() {
        return super.getParamByObject({search: this.search, status: this.status, kind: this.kind, maxRating: this.maxRating, module: this.module});
    }
}

export interface CountByKey { key: string; count: number; }
export interface SupportStats {
    open: number; overdue: number; unassigned: number; criticalOpen: number; createdLast7Days: number; resolvedLast7Days: number;
    avgFirstResponseHours: number | null; avgResolutionHours: number | null; avgRating: number | null;
    openBySeverity: CountByKey[]; openByModule: CountByKey[];
    recurring: {fingerprint: string; subject: string; module: string | null; reports: number; open: number; lastReportedAt: string}[];
    feedback: {last30Days: number; avgRating: number | null; unreviewed: number; byRating: CountByKey[]; lowestModules: {module: string; avgRating: number; count: number}[]};
}

// ---------- Appearance defaults ----------

/** Row of `GET v1/org-admin/appearance`: the organisation default, then each member type. */
export class AppearanceRow extends CoreResource {
    declare key: string;
    declare name: string;
    declare isDefault: boolean;
    declare isCustom: boolean;
    declare allowPersonal: boolean;
    declare theme: any;
    declare members: number;
    declare personalChoices: number;
    constructor(json: any = {}) { super(); Object.assign(this, json); this.id = json?.key; }
}
export const APPEARANCE_SERIALIZER = readOnlySerializer(AppearanceRow);
