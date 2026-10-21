import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Subject, debounceTime, finalize, switchMap, tap} from "rxjs";
import {
    CATEGORIES, CATEGORY_LABEL, ComplianceCategory, ComplianceLookups, OBLIGATION_BADGE, ObligationDetail, ObligationRow, ObligationStatus
} from "../domains/compliance.models";
import {ComplianceApiService, errorMessageOf} from "../services/compliance-api.service";

/**
 * What the organisation must do: active obligations (they schedule tasks), suggestions from the catalog waiting for
 * review (activate or dismiss, one by one or all), paused and retired ones. Deep link `?obligation=<id>|new`.
 */
@Component({standalone: false, templateUrl: './templates/obligations.html'})
export class ComplianceObligationsView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    private readonly reload$ = new Subject<void>();
    readonly badge = OBLIGATION_BADGE;
    readonly categories = CATEGORIES;
    readonly categoryLabel = CATEGORY_LABEL;
    readonly statuses: ObligationStatus[] = ['Active', 'Suggested', 'Paused', 'Retired'];

    lookups: ComplianceLookups | null = null;
    status: ObligationStatus | null = 'Active';
    category: ComplianceCategory | null = null;
    search = '';
    rows: ObligationRow[] = [];
    count = 0;
    loading = false;
    busy = false;
    error: string | null = null;
    message: string | null = null;
    selected = new Set<string>();
    bulkOwnerId: string | null = null;
    /** The obligation open in the editor ('' for a new one). */
    editing: string | null = null;

    constructor(private api: ComplianceApiService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.lookups = l, error: e => this.error = errorMessageOf(e, 'Could not load compliance.')});
        const q = this.route.snapshot.queryParamMap;
        const s = q.get('status') as ObligationStatus | null;
        if (s && this.statuses.includes(s)) { this.status = s; }
        const open = q.get('obligation');
        if (open) { this.editing = open === 'new' ? '' : open; }
        this.reload$.pipe(
            debounceTime(150), tap(() => { this.loading = true; this.error = null; }),
            switchMap(() => this.api.obligations({status: this.status, category: this.category, search: this.search || null, take: 100}).pipe(finalize(() => this.loading = false))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: p => { this.rows = p.entities; this.count = p.count; this.selected.clear(); },
            error: e => { this.loading = false; this.error = errorMessageOf(e, 'Could not load obligations.'); }
        });
        this.load();
    }

    load() { this.reload$.next(); }
    setStatus(s: ObligationStatus | null) { this.status = s; this.load(); }
    toggle(id: string, event: Event) { event.stopPropagation(); this.selected.has(id) ? this.selected.delete(id) : this.selected.add(id); }

    open(id: string | null) {
        this.editing = id ?? '';
        this.router.navigate([], {relativeTo: this.route, queryParams: {obligation: id ?? 'new'}, queryParamsHandling: 'merge', replaceUrl: true});
    }
    close() {
        this.editing = null;
        this.router.navigate([], {relativeTo: this.route, queryParams: {obligation: null}, queryParamsHandling: 'merge', replaceUrl: true});
    }
    saved(d: ObligationDetail | null) { if (!d) { this.close(); } else if (this.editing === '') { this.editing = d.id; } this.load(); }

    /** Suggestions: activate (tasks are scheduled) or dismiss the selected ones, or all of them. */
    bulk(action: 'activate' | 'dismiss', all: boolean) {
        const ids = all ? [] : [...this.selected];
        if (!all && !ids.length) { return; }
        if (all && !confirm(action === 'activate' ? `Activate all ${this.count} suggestions? Their deadlines start being tracked.` : `Dismiss all ${this.count} suggestions?`)) { return; }
        this.busy = true;
        this.api.bulkObligations({ids, action, ownerId: this.bulkOwnerId}).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.message = r.message; this.load(); },
            error: e => this.error = errorMessageOf(e, 'The suggestions could not be updated.')
        });
    }

    trackById(_: number, r: ObligationRow) { return r.id; }
}
