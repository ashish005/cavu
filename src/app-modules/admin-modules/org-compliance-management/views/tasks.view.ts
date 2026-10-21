import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Subject, debounceTime, finalize, switchMap, tap} from "rxjs";
import {
    CATEGORIES, CATEGORY_LABEL, ComplianceCategory, ComplianceLookups, DisplayStatus, ManualTaskInput, ObligationRow, STATUS_BADGE, TaskRow, dueText
} from "../domains/compliance.models";
import {ComplianceApiService, errorMessageOf} from "../services/compliance-api.service";

/** The compliance work queue: filters by state, area and person; a list or a board by state. Deep link `?task=<id>`. */
@Component({standalone: false, templateUrl: './templates/tasks.html'})
export class ComplianceTasksView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    private readonly reload$ = new Subject<void>();
    readonly badge = STATUS_BADGE;
    readonly categories = CATEGORIES;
    readonly categoryLabel = CATEGORY_LABEL;
    readonly dueText = dueText;
    readonly tabs = [
        {status: 'open', label: 'Open'}, {status: 'overdue', label: 'Overdue'}, {status: 'due_soon', label: 'Due in 7 days'}, {status: 'submitted', label: 'In review'},
        {status: 'completed', label: 'Done'}, {status: 'waived', label: 'Not needed'}, {status: 'all', label: 'All'}
    ];
    readonly boardColumns: DisplayStatus[] = ['overdue', 'due_soon', 'open', 'in_progress', 'submitted'];
    readonly pageSize = 50;

    lookups: ComplianceLookups | null = null;
    status = 'open';
    mine = false;
    category: ComplianceCategory | null = null;
    search = '';
    obligationId: string | null = null;
    board = false;
    rows: TaskRow[] = [];
    count = 0;
    skip = 0;
    loading = false;
    error: string | null = null;
    openTaskId: string | null = null;
    adding: ManualTaskInput | null = null;
    obligations: ObligationRow[] = [];

    constructor(private api: ComplianceApiService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.lookups = l, error: e => this.error = errorMessageOf(e, 'Could not load compliance.')});
        const q = this.route.snapshot.queryParamMap;
        this.status = q.get('status') ?? 'open';
        this.obligationId = q.get('obligation');
        this.mine = q.get('mine') === '1';
        this.openTaskId = q.get('task');
        this.reload$.pipe(
            debounceTime(150), tap(() => { this.loading = true; this.error = null; }),
            switchMap(() => this.api.tasks({
                status: this.board ? 'open' : this.status, assignee: this.mine ? 'me' : null, category: this.category, search: this.search || null,
                obligationId: this.obligationId, skip: this.board ? 0 : this.skip, take: this.board ? 100 : this.pageSize
            }).pipe(finalize(() => this.loading = false))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: p => { this.rows = p.entities; this.count = p.count; },
            error: e => { this.loading = false; this.error = errorMessageOf(e, 'Could not load tasks.'); }
        });
        this.load();
    }

    load(resetPage = true) { if (resetPage) { this.skip = 0; } this.reload$.next(); }
    setStatus(s: string) { this.status = s; this.load(); }
    page(delta: number) { this.skip = Math.max(0, this.skip + delta * this.pageSize); this.load(false); }
    column(s: DisplayStatus) { return this.rows.filter(r => r.displayStatus === s); }

    open(t: TaskRow) {
        this.openTaskId = t.id;
        this.router.navigate([], {relativeTo: this.route, queryParams: {task: t.id}, queryParamsHandling: 'merge', replaceUrl: true});
    }
    close() {
        this.openTaskId = null;
        this.router.navigate([], {relativeTo: this.route, queryParams: {task: null}, queryParamsHandling: 'merge', replaceUrl: true});
    }

    /** A one-off task (event-driven obligations, an amended return). */
    startAdd() {
        this.error = null;
        this.api.obligations({status: 'Active', take: 100}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: p => this.obligations = p.entities, error: () => {}});
        this.adding = {obligationId: this.obligationId ?? '', periodLabel: '', dueDate: this.lookups?.today ?? '', assigneeId: null, notes: null};
    }
    saveAdd() {
        const a = this.adding;
        if (!a?.obligationId || !a.periodLabel.trim() || !a.dueDate) { this.error = 'Choose the obligation, a label and the due date.'; return; }
        this.api.addTask(a).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: t => { this.adding = null; this.load(); this.open(t.row); },
            error: e => this.error = errorMessageOf(e, 'The task could not be added.')
        });
    }

    trackById(_: number, r: TaskRow) { return r.id; }
}
