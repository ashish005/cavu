export type TicketType = 'Bug' | 'Question' | 'FeatureRequest' | 'Billing' | 'Access' | 'Data' | 'Other';
export type TicketSeverity = 'Low' | 'Normal' | 'High' | 'Critical';
export type TicketStatus = 'Open' | 'InProgress' | 'WaitingOnReporter' | 'Resolved' | 'Closed';
export type CommentKind = 'Reply' | 'Internal' | 'System';
export type FeedbackKind = 'General' | 'Praise' | 'Suggestion' | 'Problem';
export type FeedbackStatus = 'New' | 'Reviewed' | 'Planned' | 'Done' | 'Dismissed';

export interface LookupItem { id: string; name: string; code?: string | null; }

export interface TicketRow {
    id: string; number: string; type: TicketType; severity: TicketSeverity; status: TicketStatus; subject: string; module: string | null;
    reporterId: string; reporterName: string; assigneeId: string | null; assigneeName: string | null; createdAt: string; dueAt: string;
    isOverdue: boolean; lastActivityAt: string | null; replies: number; fingerprint: string | null; rating: number | null;
}
export interface TicketAttachment { id: string; fileName: string; contentType: string; sizeBytes: number; isScreenshot: boolean; commentId: string | null; }
export interface TicketComment { id: string; kind: CommentKind; authorId: string; authorName: string; body: string; createdAt: string; attachments: TicketAttachment[]; }
export interface TicketDetail {
    ticket: TicketRow; description: string; stepsToReproduce: string | null; pageUrl: string | null; rootCause: string | null; resolution: string | null;
    ratingComment: string | null; firstResponseAt: string | null; resolvedAt: string | null; contextJson: string | null; correlationIds: string | null;
    clientIp: string | null; userAgent: string | null; appVersion: string | null; similar: TicketRow[]; comments: TicketComment[];
    attachments: TicketAttachment[]; canManage: boolean; canReopen: boolean; canRate: boolean;
}
export interface SupportLookups { types: LookupItem[]; severities: LookupItem[]; statuses: LookupItem[]; assignees: LookupItem[]; canManage: boolean; }

export interface InboxRow { id: string; title: string; body: string; isRead: boolean; createdAt: string; actionUrl: string | null; icon: string | null; priority: string; }
export interface Reminder { kind: string; title: string; subtitle: string | null; dueAt: string | null; isOverdue: boolean; link: string | null; }
export interface SetupCheck { code: string; severity: 'critical' | 'warning' | 'info'; title: string; body: string; link: string | null; linkLabel: string | null; }
export interface BellSummary { unread: number; latest: InboxRow[]; reminders: Reminder[]; setupChecks: SetupCheck[]; badgeCount: number; }

export const TYPE_LABELS: Record<TicketType, string> = {
    Bug: 'Something is broken', Question: 'How do I…?', FeatureRequest: 'Idea or request', Billing: 'Billing', Access: 'Access or sign-in', Data: 'Wrong data', Other: 'Something else'
};
export const STATUS_LABELS: Record<TicketStatus, string> = {
    Open: 'Open', InProgress: 'In progress', WaitingOnReporter: 'Waiting for you', Resolved: 'Resolved', Closed: 'Closed'
};
export const STATUS_TONES: Record<TicketStatus, string> = {
    Open: 'info', InProgress: 'primary', WaitingOnReporter: 'warn', Resolved: 'success', Closed: 'grey'
};
export const SEVERITY_TONES: Record<TicketSeverity, string> = { Low: 'grey', Normal: 'info', High: 'warn', Critical: 'danger' };
