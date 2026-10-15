import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject, debounceTime, finalize, switchMap, tap} from "rxjs";
import {EntityLink, PROCESS_STATUS_CLASS, PROCESS_STATUS_LABEL, ProcessLookups, ProcessRow, ProcessStatus, entityLabel} from "../domains/process.models";
import {relative} from "../domains/zoned-time";
import {ProcessApiService, errorMessageOf} from "../services/process-api.service";

/** Running and finished processes with their stage progress; start a new one from a workflow. */
@Component({standalone: false, templateUrl: './templates/processes.html'})
export class ProcessesView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    private readonly reload$ = new Subject<void>();
    readonly statusLabel = PROCESS_STATUS_LABEL;
    readonly statusClass = PROCESS_STATUS_CLASS;
    readonly relative = relative;
    readonly entityLabel = entityLabel;
    readonly pageSize = 25;
    /** Set from ?entityType=&entityId= (e.g. the event log): only processes about that record. */
    entity: EntityLink | null = null;

    lookups: ProcessLookups | null = null;
    rows: ProcessRow[] = [];
    total = 0;
    skip = 0;
    status: ProcessStatus | '' = 'Active';
    workflowId = '';
    mine = false;
    search = '';
    loading = false;
    error: string | null = null;

    starting = false;
    startForm = {workflowId: '', name: '', description: '', ownerId: ''};
    startError: string | null = null;
    startBusy = false;

    constructor(private api: ProcessApiService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        const query = this.route.snapshot.queryParamMap;
        if (query.get('entityType') && query.get('entityId')) {
            this.entity = {type: query.get('entityType')!, id: query.get('entityId')!, name: null};
            this.status = '';
        }

        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: l => this.lookups = l,
            error: e => this.error = errorMessageOf(e, 'Could not load.')
        });

        this.reload$.pipe(
            debounceTime(150),
            tap(() => { this.loading = true; this.error = null; }),
            switchMap(() => this.api.processes({
                status: this.status || null, workflowId: this.workflowId || null, mine: this.mine, search: this.search || null,
                entityType: this.entity?.type ?? null, entityId: this.entity?.id ?? null, skip: this.skip, take: this.pageSize
            }).pipe(finalize(() => this.loading = false))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: page => { this.rows = page.items; this.total = page.total; },
            error: e => this.error = errorMessageOf(e, 'Could not load processes.')
        });
        this.reload$.next();
    }

    clearEntity() {
        this.entity = null;
        this.router.navigate([], {relativeTo: this.route, queryParams: {}, replaceUrl: true});
        this.reload();
    }

    reload(resetPage = true) {
        if (resetPage) { this.skip = 0; }
        this.reload$.next();
    }

    page(delta: number) {
        this.skip = Math.max(0, this.skip + delta * this.pageSize);
        this.reload(false);
    }

    progress(row: ProcessRow): number {
        if (row.status === 'Completed') { return 100; }
        return row.stageCount ? Math.round((row.stageNumber - 1) / row.stageCount * 100) : 0;
    }

    openStart() {
        this.startForm = {workflowId: this.lookups?.workflows[0]?.id ?? '', name: '', description: '', ownerId: this.lookups?.currentUserId ?? ''};
        this.startError = null;
        this.starting = true;
    }

    start() {
        if (!this.startForm.workflowId || this.startBusy) { return; }
        this.startBusy = true;
        this.startError = null;
        this.api.startProcess({
            workflowId: this.startForm.workflowId,
            name: this.startForm.name.trim() || null,
            description: this.startForm.description.trim() || null,
            ownerId: this.startForm.ownerId || null
        }).pipe(finalize(() => this.startBusy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => this.router.navigate(['/app', 'admin', 'process', 'processes', d.process.id]),
            error: e => this.startError = errorMessageOf(e, 'The process could not be started.')
        });
    }

    trackById(_: number, r: {id: string}) { return r.id; }
}
