import {Component, DestroyRef, EventEmitter, Input, OnInit, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize, forkJoin} from "rxjs";
import {
    EntityProcessRow, EntityRef, EntityScheduleRow, EntityTaskRow, EntityWorkflowRef, EntityWorkflowService, workflowErrorOf
} from "./entity-workflow.service";

/**
 * Work attached to one record of any module: its processes, open tasks and schedules, with quick ways to start a
 * workflow, add a task or set up a repeating schedule for it. Use inline (`<entity-workflow-panel [entity]="…">`)
 * or as a popup through `CoreProcessFactory.showEntityWorkflow(entity, header)`.
 */
@Component({
    selector: 'entity-workflow-panel',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
        <div class="p-3 text-sm" style="position: relative">
            <div *ngIf="error" class="alert alert-danger py-1 px-2">{{ error }}</div>
            <div *ngIf="loading" class="text-muted mb-2"><i class="fa fa-spinner fa-spin mr-1"></i>Loading…</div>

            <div class="d-flex flex-wrap align-items-end mb-3 p-2 light lt rounded">
                <div class="mr-2 mb-1" style="flex: 1 1 200px">
                    <label class="text-xs mb-0">Start a workflow for this {{ typeLabel }}</label>
                    <select class="form-control form-control-sm" [(ngModel)]="workflowId">
                        <option *ngFor="let w of workflows" [value]="w.id">{{ w.name }}</option>
                    </select>
                </div>
                <button class="btn btn-sm theme mr-1 mb-1" [disabled]="!workflowId || busy" (click)="start()"><i class="fa fa-play mr-1"></i>Start</button>
                <button class="btn btn-sm white mb-1" *ngIf="isAdmin" (click)="addSchedule()" title="Create a task or start a workflow on a repeat pattern"><i class="fa fa-clock-o mr-1"></i>Repeat…</button>
            </div>

            <h6 class="_600 text-xs text-muted text-uppercase">Processes</h6>
            <div *ngIf="!processes.length" class="text-muted mb-3">None yet.</div>
            <div *ngFor="let p of processes" class="d-flex align-items-center mb-1">
                <a role="button" class="flex _500" (click)="go(['/app', 'admin', 'process', 'processes', p.id])">{{ p.name }}</a>
                <span *ngIf="p.triggerName" class="text-muted mr-2" [title]="'Started by ' + p.triggerName"><i class="fa fa-bolt"></i></span>
                <span class="badge mr-1" [style.background]="p.stageColor" style="color: #fff" *ngIf="p.status === 'Active' && p.stageName">{{ p.stageName }}</span>
                <span class="badge grey" *ngIf="p.status !== 'Active'">{{ p.status }}</span>
                <span class="badge danger ml-1" *ngIf="p.isOverdue">Overdue</span>
            </div>

            <h6 class="_600 text-xs text-muted text-uppercase mt-3">Open tasks</h6>
            <div *ngIf="!tasks.length" class="text-muted">None.</div>
            <div *ngFor="let t of tasks" class="d-flex align-items-center mb-1">
                <span class="flex">{{ t.name }} <span class="text-xs text-muted" *ngIf="t.processName">· {{ t.processName }}</span></span>
                <span class="text-xs mr-2" [class.text-danger]="t.isOverdue" *ngIf="t.dueAt">due {{ t.dueAt | date:'mediumDate' }}</span>
                <span class="text-xs text-muted">{{ t.assignee?.name || 'Team queue' }}</span>
            </div>
            <div class="d-flex mt-1 mb-3">
                <input class="form-control form-control-sm mr-1" [(ngModel)]="taskName" placeholder="Add a task for me…" maxlength="250" (keyup.enter)="addTask()">
                <button class="btn btn-sm white" [disabled]="!taskName.trim() || busy" (click)="addTask()">Add</button>
            </div>

            <ng-container *ngIf="schedules.length">
                <h6 class="_600 text-xs text-muted text-uppercase">Schedules</h6>
                <div *ngFor="let s of schedules" class="d-flex align-items-center mb-1">
                    <a role="button" class="flex" (click)="go(['/app', 'admin', 'process', 'schedules', s.id])">{{ s.name }}</a>
                    <span class="text-xs text-muted mr-2">{{ s.summary }}</span>
                    <span class="badge" [ngClass]="s.status === 'Active' ? 'success' : 'grey'">{{ s.status }}</span>
                </div>
            </ng-container>
        </div>`
})
export class EntityWorkflowPanelComponent implements OnInit {
    @Input({required: true}) entity!: EntityRef;
    /** Set by the popup host; emitted when the user navigates away. */
    onCancel?: EventEmitter<any>;
    onOk?: EventEmitter<any>;

    private readonly destroyRef = inject(DestroyRef);

    processes: EntityProcessRow[] = [];
    tasks: EntityTaskRow[] = [];
    schedules: EntityScheduleRow[] = [];
    workflows: EntityWorkflowRef[] = [];
    isAdmin = false;
    workflowId = '';
    taskName = '';
    loading = false;
    busy = false;
    error: string | null = null;

    constructor(private api: EntityWorkflowService, private router: Router) {}

    get typeLabel() { return this.entity?.type?.replace(/_/g, ' ') ?? 'record'; }

    ngOnInit() {
        this.api.workflows().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: l => { this.workflows = l.workflows; this.isAdmin = l.isAdmin; this.workflowId = l.workflows[0]?.id ?? ''; },
            error: e => this.error = workflowErrorOf(e, 'Processes are not available.')
        });
        this.load();
    }

    load() {
        this.loading = true;
        forkJoin({p: this.api.processes(this.entity), t: this.api.tasks(this.entity), s: this.api.schedules(this.entity)})
            .pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: r => { this.processes = r.p.items; this.tasks = r.t.items.filter(t => t.status !== 'Done' && t.status !== 'Cancelled'); this.schedules = r.s.items; },
                error: e => this.error = workflowErrorOf(e, 'Could not load the work for this record.')
            });
    }

    start() {
        this.busy = true;
        this.error = null;
        const name = this.entity.name ? `${this.workflows.find(w => w.id === this.workflowId)?.name}: ${this.entity.name}` : null;
        this.api.startProcess(this.entity, this.workflowId, name).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.load(),
            error: e => this.error = workflowErrorOf(e, 'The workflow could not be started.')
        });
    }

    addTask() {
        const name = this.taskName.trim();
        if (!name) { return; }
        this.busy = true;
        this.error = null;
        this.api.addTask(this.entity, name, null).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.taskName = ''; this.load(); },
            error: e => this.error = workflowErrorOf(e, 'The task could not be added.')
        });
    }

    addSchedule() {
        this.go(['/app', 'admin', 'process', 'schedules', 'new'], {entityType: this.entity.type, entityId: this.entity.id, entityName: this.entity.name ?? ''});
    }

    go(commands: any[], queryParams?: Record<string, string>) {
        this.onCancel?.emit(null);
        this.router.navigate(commands, {queryParams});
    }
}
