import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute} from "@angular/router";
import {Observable, finalize} from "rxjs";
import {
    PRIORITY_CLASS, PROCESS_STATUS_CLASS, PROCESS_STATUS_LABEL, ProcessDetail, ProcessLookups, TASK_STATUS_CLASS, TASK_STATUS_LABEL, TaskRow, entityLabel, isClosed
} from "../domains/process.models";
import {relative} from "../domains/zoned-time";
import {ProcessApiService, errorMessageOf} from "../services/process-api.service";

type Action = 'approve' | 'move' | 'hold' | 'resume' | 'cancel';

/** One process: where it is, what is left to do, and who did what. */
@Component({standalone: false, templateUrl: './templates/process-detail.html'})
export class ProcessDetailView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    readonly statusLabel = PROCESS_STATUS_LABEL;
    readonly statusClass = PROCESS_STATUS_CLASS;
    readonly taskStatusLabel = TASK_STATUS_LABEL;
    readonly taskStatusClass = TASK_STATUS_CLASS;
    readonly priorityClass = PRIORITY_CLASS;
    readonly relative = relative;
    readonly isClosed = isClosed;
    readonly entityLabel = entityLabel;

    id!: string;
    lookups: ProcessLookups | null = null;
    detail: ProcessDetail | null = null;
    loading = false;
    error: string | null = null;

    /** Pending confirmation of an action that needs a note or a target stage. */
    confirm: {action: Action; title: string; remark: string; stageId: string} | null = null;
    acting = false;

    panelTaskId: string | null | undefined = undefined;

    constructor(private api: ProcessApiService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id')!;
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(l => this.lookups = l);
        this.load();
    }

    get tz() { return this.lookups?.orgTimeZone ?? 'UTC'; }

    /** Tasks grouped by stage in workflow order; tasks of stages no longer in the workflow come last. */
    get tasksByStage(): {stage: string; tasks: TaskRow[]}[] {
        if (!this.detail) { return []; }
        const order = this.detail.stages.map(s => s.name);
        const groups = new Map<string, TaskRow[]>();
        for (const t of this.detail.tasks) {
            const key = t.stageName ?? 'Other';
            groups.set(key, [...(groups.get(key) ?? []), t]);
        }
        return [...groups.entries()]
            .sort(([a], [b]) => (order.indexOf(a) + 1 || 999) - (order.indexOf(b) + 1 || 999))
            .map(([stage, tasks]) => ({stage, tasks}));
    }

    load() {
        this.loading = true;
        this.api.process(this.id).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { this.detail = d; this.error = null; },
            error: e => this.error = errorMessageOf(e, 'Could not load the process.')
        });
    }

    ask(action: Action) {
        const titles: Record<Action, string> = {
            approve: 'Approve and move on', move: 'Move to another stage', hold: 'Put on hold', resume: 'Resume', cancel: 'Cancel this process'
        };
        if (action === 'resume') { this.run('resume', {}); return; }
        this.confirm = {action, title: titles[action], remark: '', stageId: ''};
    }

    submitConfirm() {
        const c = this.confirm!;
        if (c.action === 'move' && !c.stageId) { return; }
        this.run(c.action, {remark: c.remark.trim() || null, stageId: c.stageId || null});
    }

    onPanelClosed(changed: boolean) {
        this.panelTaskId = undefined;
        if (changed) { this.load(); }
    }

    private run(action: Action, body: {remark?: string | null; stageId?: string | null}) {
        this.acting = true;
        this.error = null;
        (this.api.processAction(this.id, action, body) as Observable<ProcessDetail>)
            .pipe(finalize(() => this.acting = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: d => { this.detail = d; this.confirm = null; },
                error: e => this.error = errorMessageOf(e, 'That did not work.')
            });
    }

    trackById(_: number, r: {id: string}) { return r.id; }
}
