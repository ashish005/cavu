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

export interface Page<T> { items: T[]; total: number; }
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
}

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

export interface ProcessQuery { status?: ProcessStatus | null; workflowId?: string | null; mine?: boolean; search?: string | null; skip?: number; take?: number; }

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
}

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
