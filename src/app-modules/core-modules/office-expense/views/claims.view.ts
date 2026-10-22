import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AlertService, DateFormatCell, MessageSeverity, ViewExtender} from "@app-global";
import {ClaimGridService, ExpenseApiService, ExpenseGridEvents, expenseErrorOf} from "../expense-api.service";
import {ClaimNumberCell, ClaimStatusCell} from "../expense-cells";
import {Claim, ClaimQueryOptions, ClaimRow, ClaimScope, ExpenseLookups, ExpenseSummary} from "../expense.models";

interface Filter { key: string | null; label: string; }

const FILTERS: Record<ClaimScope, Filter[]> = {
    mine: [{key: null, label: 'All'}, {key: 'draft', label: 'Drafts'}, {key: 'returned', label: 'Returned'}, {key: 'open', label: 'In approval'},
        {key: 'to_reimburse', label: 'To be reimbursed'}, {key: 'paid', label: 'Reimbursed'}],
    team: [{key: 'submitted', label: 'To approve'}, {key: null, label: 'All'}],
    finance: [{key: 'awaiting_finance', label: 'To post'}, {key: 'to_reimburse', label: 'To reimburse'}, {key: 'paid', label: 'Reimbursed'}, {key: null, label: 'All'}],
    all: [{key: null, label: 'All'}, {key: 'open', label: 'In approval'}, {key: 'to_reimburse', label: 'To reimburse'}, {key: 'paid', label: 'Reimbursed'},
        {key: 'cancelled', label: 'Cancelled'}]
};

/**
 * A list of claims for one audience (route data `scope`): my claims, claims I approve, finance's queues, or all.
 * Opens a claim in a side panel (`?claim=<id>`), and new claims in the editor (`?new=1`).
 */
@Component({standalone: false, templateUrl: './templates/claims.html'})
export class ExpenseClaimsView extends ViewExtender<ClaimRow> implements OnInit {
    override coreState = new ClaimQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    scope: ClaimScope = 'mine';
    filters: Filter[] = [];
    lookups: ExpenseLookups | null = null;
    summary: ExpenseSummary | null = null;
    title = 'My expenses';

    /** The claim open in the side panel. */
    claim: Claim | null = null;
    /** Editing: a claim (or null for a new one). */
    editing: {claim: Claim | null} | null = null;

    constructor(public override service: ClaimGridService, public override activatedRoute: ActivatedRoute, private api: ExpenseApiService,
                private events: ExpenseGridEvents, private alerts: AlertService, private router: Router) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.coreState.take = 25;
    }

    get errorText() { return this.errorMsg ? expenseErrorOf(this.errorMsg, 'The claims could not be loaded.') : null; }

    ngOnInit() {
        const data = this.activatedRoute.snapshot.data;
        this.scope = (data['scope'] as ClaimScope) ?? 'mine';
        this.title = data['title'] ?? this.title;
        this.filters = FILTERS[this.scope];
        this.coreState.scope = this.scope;
        this.coreState.status = this.filters[0].key;
        this.setColumns();
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.lookups = l, error: () => {}});
        this.loadSummary();
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'open') { this.openRow(a.row.id); } });
        this.activatedRoute.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(q => {
            const id = q.get('claim');
            if (id && id !== this.claim?.id) { this.open(id); }
            if (q.get('new') === '1' && !this.editing) { this.editing = {claim: null}; }
        });
        this.populateGrid();
    }

    private setColumns() {
        const money = (r: ClaimRow, v: number) => `${v.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${r.currencyCode}`;
        this.gridOptions.columnDefs = [
            {headerName: 'Claim', field: 'number', cellTemplate: ClaimNumberCell},
            ...(this.scope === 'mine' ? [] : [{headerName: 'Employee', field: 'employeeName'}]),
            {headerName: 'Period', field: 'periodFrom', cellFn: (r: ClaimRow) => r.periodFrom ? (r.periodFrom === r.periodTo ? r.periodFrom : `${r.periodFrom} – ${r.periodTo}`) : '—'},
            {headerName: 'Expenses', field: 'lineCount', class: 'text-right', cellFn: (r: ClaimRow) => `${r.lineCount} (${r.receiptCount} receipts)`},
            {headerName: 'Total', field: 'total', class: 'text-right', cellFn: (r: ClaimRow) => money(r, r.total)},
            {headerName: 'Owed', field: 'outstanding', class: 'text-right', cellFn: (r: ClaimRow) => r.outstanding ? money(r, r.outstanding) : ''},
            {headerName: 'Status', field: 'status', cellTemplate: ClaimStatusCell},
            {headerName: 'Updated', field: 'statusChangedAt', cellTemplate: DateFormatCell}
        ];
    }

    loadSummary() {
        this.api.summary().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: s => this.summary = s, error: () => {}});
    }

    setFilter(f: Filter) { this.coreState.status = f.key; this.coreState.skip = 0; this.coreState.page = 1; this.populateGrid(); }
    search() { this.coreState.skip = 0; this.populateGrid(); }
    actionCb(_: any) {}

    // ---------- Panels ----------

    openRow(id: string) { this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {claim: id, new: null}, queryParamsHandling: 'merge'}); }

    open(id: string) {
        this.api.claim(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: c => { this.claim = c; this.editing = null; },
            error: e => this.alerts.showMessage('Expenses', expenseErrorOf(e, 'The claim could not be opened.'), MessageSeverity.error)
        });
    }

    newClaim() {
        if (!this.lookups?.me && !this.lookups?.canCreateForOthers) {
            this.alerts.showMessage('Expenses', 'You have no employee record in this organisation, so you cannot claim expenses. Ask an administrator.', MessageSeverity.warn);
            return;
        }
        this.claim = null;
        this.editing = {claim: null};
    }

    closePanels() {
        this.claim = null;
        this.editing = null;
        this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {claim: null, new: null}, queryParamsHandling: 'merge', replaceUrl: true});
    }

    edit(c: Claim) { this.editing = {claim: c}; }

    /** Closing the editor of an existing claim goes back to it; of a new one, to the list. */
    closeEditor() { if (this.editing?.claim) { this.claim = this.editing.claim; this.editing = null; } else { this.closePanels(); } }

    /** After saving in the editor: show the claim. */
    saved(c: Claim) {
        this.editing = null;
        this.claim = c;
        this.refreshGrid();
        this.loadSummary();
        this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {claim: c.id, new: null}, queryParamsHandling: 'merge', replaceUrl: true});
    }

    /** After an action in the detail panel. */
    changed(c: Claim | null) {
        this.claim = c;
        if (!c) { this.closePanels(); }
        this.refreshGrid();
        this.loadSummary();
    }
}
