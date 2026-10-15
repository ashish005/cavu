/**
 * Shapes of the tenant API `api/v1/process/*`. Instants are ISO strings in UTC and are shown in the organisation's
 * timezone; schedule dates and times are local to the schedule's own timezone.
 */

export type TaskStatus = 'Open' | 'InProgress' | 'Blocked' | 'Done' | 'Cancelled';
export type TaskPriority = 'Low' | 'Normal' | 'High' | 'Urgent';
export type TaskScope = 'Mine' | 'Queue' | 'All';
export type ProcessStatus = 'Active' | 'OnHold' | 'Completed' | 'Cancelled';
export type StageAdvanceMode = 'Automatic' | 'Approval';
export type AssigneeType = 'ProcessOwner' | 'User' | 'Role';
export type ScheduleKind = 'CreateTask' | 'StartProcess' | 'RunActions';
export type ScheduleStatus = 'Draft' | 'Active' | 'Paused' | 'Expired' | 'Disabled';
export type RecurrenceType = 'Once' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Fiscal' | 'Cron' | 'BusinessDay' | 'Minutely' | 'Hourly';
export type ReminderTrigger = 'BeforeOccurrence' | 'AfterOccurrence' | 'OnFailure';
export type RunStatus = 'Pending' | 'Claimed' | 'Running' | 'Completed' | 'Failed' | 'RetryPending' | 'Cancelled' | 'Skipped' | 'DeadLetter';

export type StageRuleKind = 'OnEvent' | 'AfterHours';
export type StageRuleTarget = 'NextStage' | 'Stage' | 'Complete' | 'Cancel';
export type TriggerOwnerSource = 'WorkflowDefault' | 'User' | 'PayloadField' | 'EventActor';
export type TriggerDedupe = 'OnePerRecord' | 'Always';
export type EventStatus = 'Pending' | 'Processed' | 'Ignored' | 'Failed';
export type TriggerAction = 'StartWorkflow' | 'Notify';
export type NotifyChannel = 'Email' | 'InApp' | 'Sms' | 'Push';
export type NotifyPriority = 'Low' | 'Normal' | 'High' | 'Critical';
export type RecipientKind = 'Users' | 'Role' | 'Team' | 'ProcessOwner' | 'TaskAssignee' | 'EventActor' | 'UserField' | 'ContactField' | 'Contacts';
export type ConditionOp = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startswith' | 'in' | 'exists' | 'notexists';

export interface Page<T> { items: T[]; total: number; }
/** The record a process, task or schedule is about: any entity type, built-in (member, document…) or the tenant's own. */
export interface EntityLink { type: string; id: string; name: string | null; }
export interface RetryPolicyRef { id: number; name: string; maxAttempts: number; }
export interface UserRef { id: string; name: string; }
export interface RoleRef { id: string; name: string; code: string; }
export interface WorkflowRef { id: string; code: string; name: string; stageCount: number; }

export interface ProcessLookups {
    orgTimeZone: string;
    currentUserId: string | null;
    isAdmin: boolean;
    users: UserRef[];
    roles: RoleRef[];
    workflows: WorkflowRef[];
    retryPolicies: RetryPolicyRef[];
    teams: TeamRef[];
}

export interface TeamRef { id: string; name: string; memberCount: number; }

// ---------- Tasks ----------
export interface TaskRow {
    id: string;
    code: string | null;
    name: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignee: UserRef | null;
    assigneeRoleId: string | null;
    assigneeRoleName: string | null;
    dueAt: string | null;
    isOverdue: boolean;
    isRequired: boolean;
    processId: string | null;
    processCode: string | null;
    processName: string | null;
    stageName: string | null;
    fromSchedule: boolean;
    createdAt: string;
    completedAt: string | null;
    entity: EntityLink | null;
}

export interface TaskDetail {
    task: TaskRow;
    description: string | null;
    remark: string | null;
    startedAt: string | null;
    completedBy: UserRef | null;
    canEdit: boolean;
    canWork: boolean;
}

export interface TaskQuery {
    scope?: TaskScope;
    includeClosed?: boolean;
    status?: TaskStatus | null;
    processId?: string | null;
    search?: string | null;
    dueFrom?: string | null;
    dueTo?: string | null;
    entityType?: string | null;
    entityId?: string | null;
    skip?: number;
    take?: number;
}

export interface TaskSave {
    name: string;
    description: string | null;
    priority: TaskPriority;
    assigneeId: string | null;
    assigneeRoleId: string | null;
    dueAt: string | null;
    processId?: string | null;
    isRequired: boolean;
    entityType?: string | null;
    entityId?: string | null;
    entityName?: string | null;
}

// ---------- Processes ----------
export interface ProcessRow {
    id: string;
    code: string;
    name: string;
    workflowName: string;
    status: ProcessStatus;
    stageName: string | null;
    stageColor: string | null;
    stageNumber: number;
    stageCount: number;
    awaitingApproval: boolean;
    owner: UserRef | null;
    startedAt: string;
    stageDueAt: string | null;
    isOverdue: boolean;
    openTasks: number;
    doneTasks: number;
    entity: EntityLink | null;
    /** Set when a trigger started it. */
    triggerName: string | null;
}

export interface ProcessStage { id: string; name: string; color: string | null; slaHours: number | null; advanceMode: StageAdvanceMode; state: 'done' | 'current' | 'upcoming'; }
export interface ProcessHistory { stageName: string; enteredAt: string; exitedAt: string | null; exitReason: string | null; exitedBy: UserRef | null; remark: string | null; slaBreached: boolean; }

export interface ProcessDetail {
    process: ProcessRow;
    description: string | null;
    remark: string | null;
    completedAt: string | null;
    stages: ProcessStage[];
    tasks: TaskRow[];
    history: ProcessHistory[];
    canApprove: boolean;
    canManage: boolean;
}

export interface ProcessQuery { status?: ProcessStatus | null; workflowId?: string | null; mine?: boolean; search?: string | null; entityType?: string | null; entityId?: string | null; skip?: number; take?: number; }

export interface StartProcess { workflowId: string; name?: string | null; description?: string | null; ownerId?: string | null; entityType?: string | null; entityId?: string | null; entityName?: string | null; }

// ---------- Workflows ----------
export interface WorkflowSummary { id: string; code: string; name: string; description: string | null; isActive: boolean; stageCount: number; taskCount: number; activeProcesses: number; }

export interface WorkflowTask {
    id?: string | null;
    name: string;
    description?: string | null;
    priority: TaskPriority;
    isRequired: boolean;
    assigneeType: AssigneeType;
    assigneeUserId?: string | null;
    assigneeRoleId?: string | null;
    dueAfterHours?: number | null;
}

export interface WorkflowStage {
    id?: string | null;
    name: string;
    color?: string | null;
    slaHours?: number | null;
    advanceMode: StageAdvanceMode;
    approverRoleId?: string | null;
    tasks: WorkflowTask[];
    /** Automatic stage switches. */
    rules?: StageRule[];
}

/** "When the record's {eventName} arrives (and the condition holds)" or "after N hours in the stage" → go to target. */
export interface StageRule {
    id?: string | null;
    kind: StageRuleKind;
    eventName?: string | null;
    condition?: ConditionSet | null;
    afterHours?: number | null;
    target: StageRuleTarget;
    /** For target 'Stage': position of the target stage in the workflow. */
    targetStageIndex?: number | null;
}

// ---------- Conditions, triggers and events ----------
export interface ConditionRule { field: string; op: ConditionOp; value?: any; }
export interface ConditionSet { match: 'all' | 'any'; rules: ConditionRule[]; }

export interface EntityField { name: string; label: string; type: 'text' | 'number' | 'date' | 'choice'; values: string[] | null; }
export interface EntityType { code: string; name: string; events: string[]; fields: EntityField[]; builtIn: boolean; }

/** Who receives a rule's notification; `condition` makes the rule apply only when it holds. */
export interface RecipientRule {
    kind: RecipientKind;
    userIds?: string[];
    roleId?: string | null;
    teamId?: string | null;
    field?: string | null;
    contacts?: string[];
    condition?: ConditionSet | null;
}

export interface NotifyConfig {
    channels: NotifyChannel[];
    subject: string;
    body: string;
    shortText?: string | null;
    priority: NotifyPriority;
    recipients: RecipientRule[];
    attachmentIds: string[];
    attachRecordDocument: boolean;
    attachmentField?: string | null;
}

export interface Attachment { id: string; fileName: string; contentType: string; sizeBytes: number; }
export interface ResolvedRecipient { userId: string | null; name: string; email: string | null; phone: string | null; source: string; }
export interface NotifyPreview { recipients: ResolvedRecipient[]; subject: string; body: string; attachments: string[]; notes: string[]; }

export interface TeamMember { id?: string | null; userId?: string | null; name?: string | null; email?: string | null; phone?: string | null; }
export interface Team { id?: string | null; code: string; name: string; description?: string | null; members: TeamMember[]; }
export interface TeamSummary { id: string; code: string; name: string; description: string | null; memberCount: number; externalCount: number; }

export interface Trigger {
    id?: string | null;
    action: TriggerAction;
    notify?: NotifyConfig | null;
    workflowId: string | null;
    name: string;
    entityType: string;
    eventName: string;
    condition?: ConditionSet | null;
    nameTemplate?: string | null;
    ownerSource: TriggerOwnerSource;
    ownerUserId?: string | null;
    ownerField?: string | null;
    dedupe: TriggerDedupe;
    isActive: boolean;
    workflowName?: string | null;
    isSystem?: boolean;
    processesStarted?: number;
}

export interface TriggerTestResult {
    conditionMatches: boolean;
    renderedName: string | null;
    triggers: {id: string; name: string; workflowName: string; matches: boolean; processName: string | null}[];
    notification: NotifyPreview | null;
}

export interface WorkflowEvent {
    id: string;
    entityType: string;
    entityId: string;
    entityName: string | null;
    eventName: string;
    occurredAt: string;
    status: EventStatus;
    attempts: number;
    processedAt: string | null;
    outcome: string | null;
    error: string | null;
    actor: UserRef | null;
    payload: any;
}

export interface EventQuery { entityType?: string | null; entityId?: string | null; eventName?: string | null; status?: EventStatus | null; skip?: number; take?: number; }

export interface Workflow {
    id?: string | null;
    code: string;
    name: string;
    description?: string | null;
    defaultOwnerId?: string | null;
    isActive: boolean;
    stages: WorkflowStage[];
}

// ---------- Schedules ----------
export interface Recurrence {
    type: RecurrenceType;
    interval: number;
    weekDays: number[];
    monthDays: number[];
    weekNumbers: number[];
    months: number[];
    cronExpression?: string | null;
    skipWeekends: boolean;
    skipHolidays: boolean;
}

export interface ScheduleReminder { triggerType: ReminderTrigger; offsetMinutes: number; }

export interface ScheduleDefinition {
    name: string;
    description?: string | null;
    kind: ScheduleKind;
    workflowId?: string | null;
    taskName?: string | null;
    taskDescription?: string | null;
    taskPriority: TaskPriority;
    assigneeId?: string | null;
    assigneeRoleId?: string | null;
    dueAfterMinutes?: number | null;
    timeZoneId?: string | null;
    /** yyyy-MM-dd */
    startDate: string;
    /** HH:mm[:ss] */
    startTime: string;
    endDate?: string | null;
    recurrence: Recurrence;
    reminders: ScheduleReminder[];
    active: boolean;
    retryPolicyId?: number | null;
    entityType?: string | null;
    entityId?: string | null;
    entityName?: string | null;
}

export interface ScheduleRow {
    id: string;
    name: string;
    kind: ScheduleKind;
    status: ScheduleStatus;
    summary: string;
    timeZoneId: string;
    nextDueAt: string | null;
    lastDueAt: string | null;
    workflowName: string | null;
    assignee: UserRef | null;
    failedRuns: number;
    entity: EntityLink | null;
}

export interface ScheduleDetail { schedule: ScheduleRow; definition: ScheduleDefinition; upcomingRuns: string[]; }
export interface SchedulePreview { runs: string[]; summary: string; timeZoneId: string; }
export interface ScheduleRun { id: string; scheduledAt: string; status: RunStatus; attempts: number; completedAt: string | null; error: string | null; taskId: string | null; taskCode: string | null; processId: string | null; processCode: string | null; }

// ---------- Labels and helpers ----------
export const TASK_STATUS_LABEL: Record<TaskStatus, string> = { Open: 'Open', InProgress: 'In progress', Blocked: 'Blocked', Done: 'Done', Cancelled: 'Cancelled' };
export const TASK_STATUS_CLASS: Record<TaskStatus, string> = { Open: 'info', InProgress: 'primary', Blocked: 'danger', Done: 'success', Cancelled: 'grey' };
export const PRIORITY_CLASS: Record<TaskPriority, string> = { Low: 'grey', Normal: 'info', High: 'warn', Urgent: 'danger' };
export const PRIORITIES: TaskPriority[] = ['Low', 'Normal', 'High', 'Urgent'];
export const PROCESS_STATUS_LABEL: Record<ProcessStatus, string> = { Active: 'Active', OnHold: 'On hold', Completed: 'Completed', Cancelled: 'Cancelled' };
export const PROCESS_STATUS_CLASS: Record<ProcessStatus, string> = { Active: 'primary', OnHold: 'warn', Completed: 'success', Cancelled: 'grey' };
export const SCHEDULE_STATUS_CLASS: Record<ScheduleStatus, string> = { Draft: 'grey', Active: 'success', Paused: 'warn', Expired: 'grey', Disabled: 'grey' };
export const RUN_STATUS_CLASS: Record<RunStatus, string> = {
    Pending: 'info', Claimed: 'info', Running: 'primary', Completed: 'success', Failed: 'danger', RetryPending: 'warn', Cancelled: 'grey', Skipped: 'grey', DeadLetter: 'danger'
};
export const WEEKDAYS = [
    {value: 1, label: 'Mon'}, {value: 2, label: 'Tue'}, {value: 3, label: 'Wed'}, {value: 4, label: 'Thu'},
    {value: 5, label: 'Fri'}, {value: 6, label: 'Sat'}, {value: 0, label: 'Sun'}
];
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((label, i) => ({value: i + 1, label}));
export const STAGE_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#14b8a6', '#64748b'];

export const EVENT_STATUS_CLASS: Record<EventStatus, string> = { Pending: 'info', Processed: 'success', Ignored: 'grey', Failed: 'danger' };

export const CONDITION_OPS: {value: ConditionOp; label: string; needsValue: boolean}[] = [
    {value: 'eq', label: 'is', needsValue: true},
    {value: 'neq', label: 'is not', needsValue: true},
    {value: 'in', label: 'is one of', needsValue: true},
    {value: 'contains', label: 'contains', needsValue: true},
    {value: 'startswith', label: 'starts with', needsValue: true},
    {value: 'gt', label: '>', needsValue: true},
    {value: 'gte', label: '≥', needsValue: true},
    {value: 'lt', label: '<', needsValue: true},
    {value: 'lte', label: '≤', needsValue: true},
    {value: 'exists', label: 'is set', needsValue: false},
    {value: 'notexists', label: 'is empty', needsValue: false}
];

export const STAGE_RULE_TARGET_LABEL: Record<StageRuleTarget, string> = { NextStage: 'Move to the next stage', Stage: 'Move to stage…', Complete: 'Complete the process', Cancel: 'Cancel the process' };

/** Lowercase entity and event codes, e.g. "Purchase Order" → purchase_order. */
export const toCode = (text: string | null | undefined): string =>
    (text ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60);

export const entityLabel = (entity: EntityLink | null | undefined): string =>
    entity ? `${entity.type.replace(/_/g, ' ')}: ${entity.name || entity.id}` : '';

export const newTrigger = (action: TriggerAction = 'StartWorkflow'): Trigger => ({
    action, workflowId: null, name: '', entityType: '', eventName: '', condition: {match: 'all', rules: []},
    nameTemplate: '', ownerSource: 'WorkflowDefault', dedupe: action === 'Notify' ? 'Always' : 'OnePerRecord', isActive: true,
    notify: action === 'Notify' ? newNotifyConfig() : null
});

export const newNotifyConfig = (): NotifyConfig => ({
    channels: ['Email', 'InApp'], subject: '', body: 'Hi {{recipientName}},\n\n', shortText: null, priority: 'Normal',
    recipients: [{kind: 'ProcessOwner'}], attachmentIds: [], attachRecordDocument: false, attachmentField: null
});

export const NOTIFY_CHANNELS: {value: NotifyChannel; label: string; icon: string}[] = [
    {value: 'Email', label: 'Email', icon: 'fa fa-envelope'},
    {value: 'InApp', label: 'In-app', icon: 'fa fa-bell'},
    {value: 'Sms', label: 'SMS', icon: 'fa fa-mobile'},
    {value: 'Push', label: 'Push', icon: 'fa fa-paper-plane'}
];

export const RECIPIENT_KINDS: {value: RecipientKind; label: string; hint: string}[] = [
    {value: 'Users', label: 'People', hint: 'Chosen members'},
    {value: 'Role', label: 'Everyone with a role', hint: 'Role holders at the time of sending'},
    {value: 'Team', label: 'A team', hint: 'Members and external contacts of a team'},
    {value: 'ProcessOwner', label: 'Process owner', hint: 'Owner of the process (or of open processes about the record)'},
    {value: 'TaskAssignee', label: 'Task assignee', hint: 'Assignee or role queue of the task (or of open tasks about the record)'},
    {value: 'EventActor', label: 'Whoever caused it', hint: 'The user who triggered the event'},
    {value: 'UserField', label: 'Member in the data', hint: 'A field holding member id(s), e.g. managerId'},
    {value: 'ContactField', label: 'Email/phone in the data', hint: 'A field holding email(s) or phone(s), e.g. email'},
    {value: 'Contacts', label: 'External contacts', hint: 'Fixed email addresses or +phone numbers'}
];

export const isClosed = (s: TaskStatus) => s === 'Done' || s === 'Cancelled';

/** A new, sensible schedule definition starting tomorrow at 09:00. */
export const newScheduleDefinition = (timeZoneId: string): ScheduleDefinition => {
    const tomorrow = new Date(Date.now() + 86400000);
    return {
        name: '',
        kind: 'CreateTask',
        taskPriority: 'Normal',
        timeZoneId,
        startDate: tomorrow.toISOString().slice(0, 10),
        startTime: '09:00',
        endDate: null,
        recurrence: {type: 'Weekly', interval: 1, weekDays: [1], monthDays: [1], weekNumbers: [], months: [1], cronExpression: null, skipWeekends: false, skipHolidays: false},
        reminders: [],
        active: true
    };
};

export const newWorkflow = (): Workflow => ({
    code: '',
    name: '',
    isActive: true,
    stages: [{name: 'To do', color: STAGE_COLORS[0], advanceMode: 'Automatic', slaHours: null, tasks: [newWorkflowTask()]}]
});

export const newWorkflowTask = (): WorkflowTask => ({name: '', priority: 'Normal', isRequired: true, assigneeType: 'ProcessOwner', dueAfterHours: 24});
