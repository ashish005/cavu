import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute} from "@angular/router";
import {finalize, forkJoin} from "rxjs";
import {Party, PartyLookups, PartyRole, PartySummary, ROLE_META, Statement, money, roleFrom, roleLabel} from "../domains/party.models";
import {PartyApiService, errorMessageOf} from "../services/party-api.service";

/** One customer, vendor or employee: account summary, aging, statement and details. */
@Component({standalone: false, templateUrl: './templates/party-detail.html'})
export class PartyDetailView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    role: PartyRole = 'customer';
    id!: string;
    lookups: PartyLookups | null = null;
    party: Party | null = null;
    summary: PartySummary | null = null;
    statement: Statement | null = null;
    from = '';
    to = '';
    loading = false;
    busy = false;
    error: string | null = null;
    editing = false;

    readonly buckets: {key: keyof PartySummary['aging']; label: string}[] = [
        {key: 'current', label: 'Not yet due'}, {key: 'days1To30', label: '1–30 days'}, {key: 'days31To60', label: '31–60 days'},
        {key: 'days61To90', label: '61–90 days'}, {key: 'over90', label: 'Over 90 days'}
    ];

    constructor(private api: PartyApiService, private route: ActivatedRoute) {}

    get meta() { return ROLE_META[this.role]; }
    get label() { return roleLabel(this.role, this.lookups); }
    get section() { return this.party?.[this.role] ?? null; }
    get currency() { return this.summary?.currencyCode ?? this.lookups?.currencyCode ?? 'USD'; }

    ngOnInit() {
        this.role = roleFrom(this.route);
        this.id = this.route.snapshot.paramMap.get('id')!;
        const today = new Date();
        this.to = today.toISOString().slice(0, 10);
        this.from = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()).toISOString().slice(0, 10);
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(l => this.lookups = l);
        this.load();
    }

    load() {
        this.loading = true;
        this.error = null;
        forkJoin({party: this.api.get1(this.role, this.id), summary: this.api.summary(this.role, this.id)})
            .pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: r => { this.party = r.party; this.summary = r.summary; this.loadStatement(); },
                error: e => this.error = errorMessageOf(e, 'Could not load.')
            });
    }

    loadStatement() {
        if (!this.from || !this.to) { return; }
        this.api.statement(this.role, this.id, this.from, this.to).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: s => this.statement = s,
            error: e => this.error = errorMessageOf(e, 'Could not load the statement.')
        });
    }

    setStatus(status: string) {
        const reason = status === 'Active' ? null : prompt(`Reason for marking ${this.party?.displayName} ${status.toLowerCase()}:`);
        if (status !== 'Active' && reason === null) { return; }
        this.run(this.api.setStatus(this.role, this.id, status, reason));
    }

    grantPortal() {
        const roleCode = this.role === 'employee' ? prompt('Role the employee signs in with (e.g. accountant):') : null;
        if (this.role === 'employee' && !roleCode) { return; }
        this.run(this.api.portalAccess(this.role, this.id, roleCode));
    }

    onEditorClosed(id: string | null) { this.editing = false; if (id) { this.load(); } }

    /** Statement as CSV (opens in any spreadsheet). */
    exportCsv() {
        const s = this.statement;
        if (!s) { return; }
        const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
        const rows = [['Date', 'Entry', 'Document', 'Reference', 'Description', 'Charge', 'Payment / credit', 'Balance'],
            ['', '', '', '', 'Opening balance', '', '', s.opening],
            ...s.lines.map(l => [l.date, l.entryNumber, l.documentType, l.reference, l.description, l.charge, l.settlement, l.balance]),
            ['', '', '', '', 'Closing balance', s.totalCharges, s.totalSettlements, s.closing]];
        const blob = new Blob([rows.map(r => r.map(esc).join(',')).join('\r\n')], {type: 'text/csv'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `statement-${s.number}-${s.from}-${s.to}.csv`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }

    bucketShare(value: number) {
        const total = Math.max(0.01, this.summary?.aging.total ?? 0);
        return Math.max(0, (value / total) * 100);
    }

    fmt(v: number | null | undefined) { return money(v, this.currency); }

    private run(request$: import("rxjs").Observable<Party>) {
        this.busy = true;
        request$.pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.load(),
            error: e => this.error = errorMessageOf(e, 'The action failed.')
        });
    }
}
