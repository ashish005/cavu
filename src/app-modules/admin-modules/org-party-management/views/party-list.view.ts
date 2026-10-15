import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject, debounceTime, finalize, switchMap, tap} from "rxjs";
import {PartyLookups, PartyRole, PartyRow, ROLE_META, embeddedFrom, money, roleFrom, roleLabel} from "../domains/party.models";
import {PartyApiService, errorMessageOf} from "../services/party-api.service";

/** Customers, vendors or employees (by route data `role`): search, filter, balances; create and edit in the aside. */
@Component({standalone: false, templateUrl: './templates/party-list.html'})
export class PartyListView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    private readonly reload$ = new Subject<void>();
    readonly pageSize = 50;

    role: PartyRole = 'customer';
    lookups: PartyLookups | null = null;
    rows: PartyRow[] = [];
    total = 0;
    skip = 0;
    search = '';
    status = 'Active';
    withBalance = false;
    sort = 'name';
    departmentId = '';
    loading = false;
    error: string | null = null;
    editing: string | null | undefined = undefined; // undefined = closed, null = new

    constructor(private api: PartyApiService, private route: ActivatedRoute, private router: Router) {}

    embedded = false;

    get meta() { return ROLE_META[this.role]; }
    /** The organisation's own names, e.g. Patients / Patient. */
    get label() { return roleLabel(this.role, this.lookups); }

    ngOnInit() {
        this.role = roleFrom(this.route);
        this.embedded = embeddedFrom(this.route);
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: l => this.lookups = l,
            error: e => this.error = errorMessageOf(e, 'Could not load.')
        });
        this.reload$.pipe(
            debounceTime(200),
            tap(() => { this.loading = true; this.error = null; }),
            switchMap(() => this.api.list(this.role, {
                search: this.search || null, status: this.status || null, withBalance: this.withBalance, sort: this.sort,
                departmentId: this.departmentId || null, skip: this.skip, take: this.pageSize
            }).pipe(finalize(() => this.loading = false))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: p => { this.rows = p.items; this.total = p.total; },
            error: e => this.error = errorMessageOf(e, `Could not load ${this.label.plural.toLowerCase()}.`)
        });
        this.reload$.next();
    }

    reload(resetPage = true) { if (resetPage) { this.skip = 0; } this.reload$.next(); }
    page(delta: number) { this.skip = Math.max(0, this.skip + delta * this.pageSize); this.reload(false); }
    open(row: PartyRow) { this.router.navigate([row.id], {relativeTo: this.route}); }

    onEditorClosed(id: string | null) {
        const wasNew = this.editing === null;
        this.editing = undefined;
        if (id) {
            if (wasNew) { this.router.navigate([id], {relativeTo: this.route}); } else { this.reload(false); }
        }
    }

    fmt(v: number) { return money(v, this.lookups?.currencyCode ?? 'USD'); }
    trackById(_: number, r: PartyRow) { return r.id; }
}
