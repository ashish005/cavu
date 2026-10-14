import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject, debounceTime, finalize, switchMap, tap} from "rxjs";
import {PRIORITY_CLASS, ProcessLookups, TASK_STATUS_CLASS, TASK_STATUS_LABEL, TaskRow, TaskScope, TaskStatus, isClosed} from "../domains/process.models";
import {relative, zonedDay} from "../domains/zoned-time";
import {ProcessApiService, errorMessageOf} from "../services/process-api.service";

interface TaskGroup { key: string; label: string; tasks: TaskRow[]; }

/** My work: tasks assigned to me, my teams' queues, or everything (admins). Grouped by when they are due. */
@Component({standalone: false, templateUrl: './templates/tasks.html'})
export class TasksView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    private readonly reload$ = new Subject<void>();
    readonly statusLabel = TASK_STATUS_LABEL;
    readonly statusClass = TASK_STATUS_CLASS;
    readonly priorityClass = PRIORITY_CLASS;
    readonly relative = relative;

    lookups: ProcessLookups | null = null;
    scope: TaskScope = 'Mine';
    showClosed = false;
    search = '';
    groups: TaskGroup[] = [];
    total = 0;
    loading = false;
    error: string | null = null;
    busyId: string | null = null;

    /** Task panel: undefined = closed, null = new task, id = existing task. */
    panelTaskId: string | null | undefined = undefined;

    constructor(private api: ProcessApiService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.scope = (this.route.snapshot.queryParamMap.get('scope') as TaskScope) || 'Mine';
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: l => { this.lookups = l; this.reload$.next(); },
            error: e => this.error = errorMessageOf(e, 'Could not load.')
        });

        this.reload$.pipe(
            debounceTime(150),
            tap(() => { this.loading = true; this.error = null; }),
            switchMap(() => this.api.tasks({scope: this.scope, includeClosed: this.showClosed, search: this.search || null, take: 200})
                .pipe(finalize(() => this.loading = false))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: page => { this.total = page.total; this.groups = this.group(page.items); },
            error: e => this.error = errorMessageOf(e, 'Could not load tasks.')
        });
    }

    setScope(scope: TaskScope) {
        this.scope = scope;
        this.router.navigate([], {relativeTo: this.route, queryParams: {scope}, replaceUrl: true});
        this.reload$.next();
    }

    reload() { this.reload$.next(); }

    open(task: TaskRow) { this.panelTaskId = task.id; }

    onPanelClosed(changed: boolean) {
        this.panelTaskId = undefined;
        if (changed) { this.reload(); }
    }

    quick(task: TaskRow, status: TaskStatus, event: Event) {
        event.stopPropagation();
        this.act(task, this.api.setTaskStatus(task.id, status));
    }

    take(task: TaskRow, event: Event) {
        event.stopPropagation();
        this.act(task, this.api.takeTask(task.id));
    }

    isClosed(task: TaskRow) { return isClosed(task.status); }

    trackById(_: number, t: {id: string}) { return t.id; }
    trackByKey(_: number, g: TaskGroup) { return g.key; }

    private act(task: TaskRow, request: ReturnType<ProcessApiService['task']>) {
        this.busyId = task.id;
        request.pipe(finalize(() => this.busyId = null), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.reload(),
            error: e => this.error = errorMessageOf(e, 'The task could not be updated.')
        });
    }

    /** Buckets by calendar day in the organisation's timezone. */
    private group(tasks: TaskRow[]): TaskGroup[] {
        const tz = this.lookups?.orgTimeZone ?? 'UTC';
        const today = zonedDay(new Date().toISOString(), tz);
        const weekEnd = zonedDay(new Date(Date.now() + 7 * 86400000).toISOString(), tz);
        const buckets: TaskGroup[] = [
            {key: 'overdue', label: 'Overdue', tasks: []},
            {key: 'today', label: 'Today', tasks: []},
            {key: 'week', label: 'Next 7 days', tasks: []},
            {key: 'later', label: 'Later', tasks: []},
            {key: 'none', label: 'No due date', tasks: []},
            {key: 'closed', label: 'Closed', tasks: []}
        ];
        const by = (key: string) => buckets.find(b => b.key === key)!.tasks;

        for (const t of tasks) {
            if (isClosed(t.status)) { by('closed').push(t); continue; }
            if (!t.dueAt) { by('none').push(t); continue; }
            if (t.isOverdue) { by('overdue').push(t); continue; }
            const day = zonedDay(t.dueAt, tz);
            by(day === today ? 'today' : day <= weekEnd ? 'week' : 'later').push(t);
        }
        return buckets.filter(b => b.tasks.length > 0);
    }
}
