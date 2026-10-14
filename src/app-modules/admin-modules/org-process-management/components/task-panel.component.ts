import {Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {
    PRIORITIES, PRIORITY_CLASS, ProcessLookups, TASK_STATUS_CLASS, TASK_STATUS_LABEL, TaskDetail, TaskPriority, TaskSave, TaskStatus, isClosed
} from "../domains/process.models";
import {isoToZonedLocal, relative, zonedLocalToIso} from "../domains/zoned-time";
import {ProcessApiService, errorMessageOf} from "../services/process-api.service";

/**
 * View, create or edit one task. Opened as a modal by every list; emits `closed(true)` when something changed so the
 * caller reloads. Due dates are entered and shown in the organisation's timezone.
 */
@Component({
    selector: 'process-task-panel',
    standalone: false,
    templateUrl: './task-panel.component.html'
})
export class TaskPanelComponent implements OnInit {
    /** Task to show; null to create one. */
    @Input() taskId: string | null = null;
    /** When creating: add the task to this process's current stage. */
    @Input() processId: string | null = null;
    @Input({required: true}) lookups!: ProcessLookups;
    @Output() closed = new EventEmitter<boolean>();

    private readonly destroyRef = inject(DestroyRef);
    readonly priorities = PRIORITIES;
    readonly statusLabel = TASK_STATUS_LABEL;
    readonly statusClass = TASK_STATUS_CLASS;
    readonly priorityClass = PRIORITY_CLASS;
    readonly relative = relative;
    readonly isClosed = isClosed;

    detail: TaskDetail | null = null;
    editing = false;
    busy = false;
    error: string | null = null;
    changed = false;
    remark = '';

    form = {name: '', description: '', priority: 'Normal' as TaskPriority, assignTo: 'me', assigneeId: '', assigneeRoleId: '', dueLocal: '', isRequired: false};

    constructor(private api: ProcessApiService) {}

    get tz(): string { return this.lookups.orgTimeZone; }
    get isNew(): boolean { return !this.taskId; }

    ngOnInit() {
        if (this.isNew) {
            this.editing = true;
            this.form.isRequired = !!this.processId;
        } else {
            this.load();
        }
    }

    load() {
        this.busy = true;
        this.api.task(this.taskId!)
            .pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({next: d => this.detail = d, error: e => this.error = errorMessageOf(e, 'Could not load the task.')});
    }

    edit() {
        const t = this.detail!.task;
        this.form = {
            name: t.name,
            description: this.detail!.description ?? '',
            priority: t.priority,
            assignTo: t.assignee ? (t.assignee.id === this.lookups.currentUserId ? 'me' : 'user') : t.assigneeRoleId ? 'role' : 'me',
            assigneeId: t.assignee?.id ?? '',
            assigneeRoleId: t.assigneeRoleId ?? '',
            dueLocal: isoToZonedLocal(t.dueAt, this.tz),
            isRequired: t.isRequired
        };
        this.editing = true;
    }

    save() {
        if (!this.form.name.trim() || this.busy) { return; }
        const f = this.form;
        const body: TaskSave = {
            name: f.name.trim(),
            description: f.description.trim() || null,
            priority: f.priority,
            assigneeId: f.assignTo === 'me' ? this.lookups.currentUserId : f.assignTo === 'user' ? (f.assigneeId || null) : null,
            assigneeRoleId: f.assignTo === 'role' ? (f.assigneeRoleId || null) : null,
            dueAt: f.dueLocal ? zonedLocalToIso(f.dueLocal, this.tz) : null,
            processId: this.processId,
            isRequired: f.isRequired
        };

        this.run(this.isNew ? this.api.createTask(body) : this.api.updateTask(this.taskId!, body), d => {
            this.taskId = d.task.id;
            this.editing = false;
        });
    }

    setStatus(status: TaskStatus) {
        if (status === 'Blocked' && !this.remark.trim()) {
            this.error = 'Say what is blocking the task.';
            return;
        }
        this.run(this.api.setTaskStatus(this.taskId!, status, this.remark.trim() || null), () => this.remark = '');
    }

    take() { this.run(this.api.takeTask(this.taskId!)); }

    close() { this.closed.emit(this.changed); }

    private run(request: ReturnType<ProcessApiService['task']>, after?: (d: TaskDetail) => void) {
        this.busy = true;
        this.error = null;
        request.pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => {
                this.detail = d;
                this.changed = true;
                after?.(d);
            },
            error: e => this.error = errorMessageOf(e, 'The task could not be updated.')
        });
    }
}
