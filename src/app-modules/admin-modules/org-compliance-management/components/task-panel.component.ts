import {Component, DestroyRef, EventEmitter, Input, OnChanges, Output, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize, forkJoin, of, switchMap} from "rxjs";
import {
    ACTION_LABEL, CATEGORY_LABEL, ComplianceFile, ComplianceLookups, STATUS_BADGE, TaskAction, TaskDetail, dueText
} from "../domains/compliance.models";
import {ComplianceApiService, errorMessageOf} from "../services/compliance-api.service";

/**
 * One compliance task: what is due and why, who is on it, the filing details (date filed, acknowledgement number,
 * amount paid) and evidence, the actions the caller may take (from the API) and the history.
 */
@Component({selector: 'compliance-task-panel', standalone: false, templateUrl: './task-panel.component.html'})
export class ComplianceTaskPanelComponent implements OnChanges {
    @Input({required: true}) taskId!: string;
    @Input({required: true}) lookups!: ComplianceLookups;
    /** The task changed (status, assignee…): lists refresh. */
    @Output() changed = new EventEmitter<TaskDetail>();

    private readonly destroyRef = inject(DestroyRef);
    readonly badge = STATUS_BADGE;
    readonly categoryLabel = CATEGORY_LABEL;
    readonly actionLabel = ACTION_LABEL;
    readonly dueText = dueText;
    task: TaskDetail | null = null;
    loading = false;
    busy = false;
    error: string | null = null;

    /** The action being completed (its form is open). */
    pending: TaskAction | null = null;
    form = {note: '', filedOn: '', referenceNo: '', amountPaid: null as number | null, currencyCode: ''};
    files: File[] = [];
    edit: {assigneeId: string | null; reviewerId: string | null; dueDate: string; notes: string} | null = null;

    constructor(private api: ComplianceApiService) {}

    ngOnChanges() { this.load(); }

    load() {
        this.loading = true;
        this.error = null;
        this.api.task(this.taskId).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: t => { this.task = t; this.pending = null; this.edit = null; },
            error: e => this.error = errorMessageOf(e, 'The task could not be loaded.')
        });
    }

    /** Actions that need details (filing, a reason) open a form; start runs at once. */
    choose(action: TaskAction) {
        this.error = null;
        if (action === 'start') { this.run(action); return; }
        this.pending = action;
        this.files = [];
        this.form = {
            note: '', filedOn: action === 'submit' ? this.lookups.today : '', referenceNo: this.task?.row.referenceNo ?? '',
            amountPaid: this.task?.amountPaid ?? null, currencyCode: this.task?.currencyCode ?? this.lookups.currencyCode
        };
    }

    get needsReason() { return this.pending === 'waive' || this.pending === 'reject' || this.pending === 'reopen'; }
    get recordsFiling() { return this.pending === 'submit' || this.pending === 'approve'; }

    pickFiles(event: Event) {
        const input = event.target as HTMLInputElement;
        this.files = [...this.files, ...Array.from(input.files ?? [])].slice(0, 10);
        input.value = '';
    }
    removeFile(i: number) { this.files.splice(i, 1); }

    run(action: TaskAction) {
        if (!this.task) { return; }
        if (this.needsReason && !this.form.note.trim()) { this.error = 'Give a reason.'; return; }
        if (action === 'note' && !this.form.note.trim() && !this.files.length) { this.error = 'Write a note or attach a file.'; return; }
        this.busy = true;
        this.error = null;
        const uploads = this.files.length ? forkJoin(this.files.map(f => this.api.upload(f))) : of([] as ComplianceFile[]);
        uploads.pipe(
            switchMap(uploaded => this.api.taskAction(this.task!.row.id, {
                action, note: this.form.note.trim() || null, fileIds: uploaded.map(u => u.id),
                filedOn: this.recordsFiling ? this.form.filedOn || null : null, referenceNo: this.recordsFiling ? this.form.referenceNo.trim() || null : null,
                amountPaid: this.recordsFiling && this.form.amountPaid !== null && (this.form.amountPaid as any) !== '' ? +this.form.amountPaid : null,
                currencyCode: this.recordsFiling && this.form.amountPaid !== null ? (this.form.currencyCode || null) : null
            })),
            finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: t => { this.task = t; this.pending = null; this.files = []; this.changed.emit(t); },
            error: e => this.error = errorMessageOf(e, 'The task could not be updated.')
        });
    }

    startEdit() {
        const t = this.task!;
        this.edit = {assigneeId: t.row.assigneeId, reviewerId: t.reviewerId, dueDate: t.row.dueDate, notes: t.notes ?? ''};
    }

    saveEdit() {
        if (!this.task || !this.edit) { return; }
        this.busy = true;
        const e = this.edit;
        this.api.updateTask(this.task.row.id, {
            assigneeId: e.assigneeId, reviewerId: e.reviewerId, dueDate: e.dueDate !== this.task.row.dueDate ? e.dueDate : null, notes: e.notes.trim() || null
        }).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: t => { this.task = t; this.edit = null; this.changed.emit(t); },
            error: err => this.error = errorMessageOf(err, 'The task could not be saved.')
        });
    }

    download(f: ComplianceFile) {
        this.api.download('tasks', this.task!.row.id, f).pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({error: e => this.error = errorMessageOf(e, 'The file could not be downloaded.')});
    }

    size(bytes: number) { return bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`; }
}
