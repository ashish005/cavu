import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {ProcessLookups, SCHEDULE_STATUS_CLASS, ScheduleRow} from "../domains/process.models";
import {relative} from "../domains/zoned-time";
import {ProcessApiService, errorMessageOf} from "../services/process-api.service";

/** Recurring work: each run creates a task or starts a process, in the schedule's own timezone. */
@Component({standalone: false, templateUrl: './templates/schedules.html'})
export class SchedulesView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    readonly statusClass = SCHEDULE_STATUS_CLASS;
    readonly relative = relative;

    lookups: ProcessLookups | null = null;
    rows: ScheduleRow[] = [];
    search = '';
    loading = false;
    error: string | null = null;
    busyId: string | null = null;

    constructor(private api: ProcessApiService) {}

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(l => this.lookups = l);
        this.load();
    }

    load() {
        this.loading = true;
        this.api.schedules({search: this.search || null, take: 100}).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: p => this.rows = p.items,
            error: e => this.error = errorMessageOf(e, 'Could not load schedules.')
        });
    }

    toggle(row: ScheduleRow, event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.busyId = row.id;
        this.api.scheduleAction(row.id, row.status === 'Active' ? 'pause' : 'resume')
            .pipe(finalize(() => this.busyId = null), takeUntilDestroyed(this.destroyRef))
            .subscribe({next: () => this.load(), error: e => this.error = errorMessageOf(e, 'The schedule could not be updated.')});
    }

    trackById(_: number, r: {id: string}) { return r.id; }
}
