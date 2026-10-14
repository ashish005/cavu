import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Subject, debounceTime, finalize, switchMap, tap} from "rxjs";
import {EVENT_STATUS_CLASS, EventStatus, ProcessLookups, WorkflowEvent} from "../domains/process.models";
import {relative} from "../domains/zoned-time";
import {ProcessApiService, errorMessageOf} from "../services/process-api.service";

/** What happened to records and what each event did: processes started, stages switched, or why nothing matched. */
@Component({standalone: false, templateUrl: './templates/events.html'})
export class EventsView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    private readonly reload$ = new Subject<void>();
    readonly statusClass = EVENT_STATUS_CLASS;
    readonly statuses: EventStatus[] = ['Pending', 'Processed', 'Ignored', 'Failed'];
    readonly relative = relative;
    readonly pageSize = 25;

    lookups: ProcessLookups | null = null;
    rows: WorkflowEvent[] = [];
    total = 0;
    skip = 0;
    filter = {entityType: '', entityId: '', eventName: '', status: '' as EventStatus | ''};
    expanded: string | null = null;
    loading = false;
    error: string | null = null;

    constructor(private api: ProcessApiService) {}

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(l => this.lookups = l);
        this.reload$.pipe(
            debounceTime(200),
            tap(() => { this.loading = true; this.error = null; }),
            switchMap(() => this.api.events({
                entityType: this.filter.entityType.trim() || null, entityId: this.filter.entityId.trim() || null,
                eventName: this.filter.eventName.trim() || null, status: this.filter.status || null, skip: this.skip, take: this.pageSize
            }).pipe(finalize(() => this.loading = false))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: page => { this.rows = page.items; this.total = page.total; },
            error: e => this.error = errorMessageOf(e, 'Could not load events.')
        });
        this.reload$.next();
    }

    reload(resetPage = true) {
        if (resetPage) { this.skip = 0; }
        this.reload$.next();
    }

    page(delta: number) {
        this.skip = Math.max(0, this.skip + delta * this.pageSize);
        this.reload(false);
    }

    retry(row: WorkflowEvent) {
        this.api.retryEvent(row.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: updated => Object.assign(row, updated),
            error: e => this.error = errorMessageOf(e, 'Could not run the event again.')
        });
    }

    json(value: any) { return JSON.stringify(value, null, 2); }
}
