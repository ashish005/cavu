import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize, map, of} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {AccountOption, FinanceKind, ModeOption, PartyOption, todayIso} from "../../domains/finance.models";
import {FinanceApiService, financeErrorOf} from "../../services/finance-api.service";
import {PickerOption} from "../../views/finance-picker.component";
import {ROUTE_OF_KIND} from "../../views/documents.view";
import {BankingApiService} from "../banking-api.service";
import {
    BANK_ACTION_IN, BANK_ACTION_LABEL, BankCreateInput, BankFeedLine, BankFeedStatus, BankRuleAction, MONEY_KIND_ICON, MoneyAccount, Reconciliation,
    StatementColumns, StatementImport
} from "../banking.models";

type Filter = BankFeedStatus | null;

/**
 * One money account's statement: import the bank's CSV, then match each line to what is already in the books (the
 * best candidates are suggested), record what is missing (a customer payment, a vendor payment, an expense, income or
 * a transfer; bank rules pre-fill it), or exclude it. Reconciling closes the period once books and statement agree.
 */
@Component({standalone: false, templateUrl: './templates/bank-statement.html'})
export class FinanceBankStatementView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    readonly actionLabel = BANK_ACTION_LABEL;
    readonly kindIcon = MONEY_KIND_ICON;
    readonly filters: {key: Filter; label: string}[] = [
        {key: 'Unmatched', label: 'To reconcile'}, {key: 'Matched', label: 'Matched'}, {key: 'Excluded', label: 'Excluded'}, {key: null, label: 'All'}
    ];
    id = '';
    account: MoneyAccount | null = null;
    filter: Filter = 'Unmatched';
    search: string | null = null;
    lines: BankFeedLine[] = [];
    page = {skip: 0, take: 50, page: 1, count: 0};
    loading = false;
    error: string | null = null;
    /** Lines being acted on (buttons disabled). */
    readonly busyLines = new Set<string>();
    modes: ModeOption[] = [];
    otherAccounts: AccountOption[] = [];

    importing = false;
    importResult: StatementImport | null = null;
    /** Column mapping offered when the import found nothing usable. */
    mapping: {file: File; columns: string[]; map: StatementColumns} | null = null;

    matchForm: {line: BankFeedLine; chosen: Set<string>} | null = null;
    createForm: {line: BankFeedLine; model: BankCreateInput; partyLabel: string | null; accountLabel: string | null; remember: boolean} | null = null;
    excludeForm: {line: BankFeedLine; note: string} | null = null;
    rec: {asOf: string; statementBalance: number | null; data: Reconciliation | null; loading: boolean; error: string | null} | null = null;
    formError: string | null = null;
    saving = false;

    constructor(private api: BankingApiService, private finance: FinanceApiService, private alerts: AlertService, private router: Router,
                private route: ActivatedRoute) {}

    ngOnInit() {
        this.finance.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.modes = l.paymentModes, error: () => {}});
        this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(p => {
            this.id = p.get('id') ?? '';
            this.loadAccount();
            this.page = {...this.page, skip: 0, page: 1};
            this.loadLines();
        });
    }

    loadAccount() {
        this.api.account(this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: a => this.account = a,
            error: e => this.error = financeErrorOf(e, 'The account could not be loaded.')
        });
        this.finance.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: l => this.otherAccounts = l.bankAccounts.filter(b => b.id !== this.account?.row.accountId), error: () => {}
        });
    }

    loadLines() {
        this.loading = true;
        this.error = null;
        this.api.feed(this.id, this.filter, this.search, this.page.skip, this.page.take).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: r => { this.lines = r.entities; this.page.count = r.count; },
                error: e => this.error = financeErrorOf(e, 'The statement could not be loaded.')
            });
    }

    setFilter(f: Filter) { this.filter = f; this.page = {...this.page, skip: 0, page: 1}; this.loadLines(); }
    toPage(p: {skip: number; take: number; page?: number}) { this.page = {...this.page, skip: p.skip, take: p.take, page: p.page ?? Math.floor(p.skip / p.take) + 1}; this.loadLines(); }
    back() { this.router.navigate(['..'], {relativeTo: this.route}); }

    /** Replace a line after an action; it leaves the list when it no longer fits the filter. */
    private replace(line: BankFeedLine) {
        const i = this.lines.findIndex(l => l.id === line.id);
        if (i < 0) { return; }
        if (this.filter && line.status !== this.filter) { this.lines.splice(i, 1); this.page.count--; } else { this.lines[i] = line; }
        this.loadAccount();
    }

    private act(line: BankFeedLine, call: Observable<BankFeedLine>, done: string, after?: () => void) {
        this.busyLines.add(line.id);
        this.formError = null;
        this.saving = true;
        call.pipe(finalize(() => { this.busyLines.delete(line.id); this.saving = false; }), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: l => { this.replace(l); after?.(); this.alerts.showMessage('Statement', done, MessageSeverity.success); },
            error: e => {
                const message = financeErrorOf(e, 'The action failed.');
                if (this.matchForm || this.createForm || this.excludeForm) { this.formError = message; }
                else { this.alerts.showMessage('Statement', message, MessageSeverity.error); }
            }
        });
    }

    // ---------- Import ----------

    importFile(input: HTMLInputElement) {
        const file = input.files?.[0];
        input.value = '';
        if (file) { this.runImport(file, null); }
    }

    runImport(file: File, columns: StatementColumns | null) {
        this.importing = true;
        this.importResult = null;
        this.api.importStatement(this.id, file, columns).pipe(finalize(() => this.importing = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => {
                this.importResult = r;
                this.mapping = r.imported === 0 && r.duplicates === 0 && r.columns.length ? {file, columns: r.columns, map: {...r.detected}} : null;
                if (r.imported) { this.setFilter('Unmatched'); this.loadAccount(); }
            },
            error: e => this.alerts.showMessage('Import', financeErrorOf(e, 'The statement could not be imported.'), MessageSeverity.error)
        });
    }

    retryImport() { if (this.mapping) { this.runImport(this.mapping.file, this.mapping.map); } }

    // ---------- Match ----------

    quickMatch(line: BankFeedLine) {
        const best = line.suggestions[0];
        if (best) { this.act(line, this.api.match(line.id, [best.valueId]), `Matched to ${best.entryNumber}.`); }
    }

    openMatch(line: BankFeedLine) { this.formError = null; this.matchForm = {line, chosen: new Set(line.suggestions.length === 1 ? [line.suggestions[0].valueId] : [])}; }

    toggle(id: string) {
        const c = this.matchForm?.chosen;
        if (c) { c.has(id) ? c.delete(id) : c.add(id); }
    }

    get chosenTotal() {
        const f = this.matchForm;
        return f ? f.line.suggestions.filter(s => f.chosen.has(s.valueId)).reduce((t, s) => t + s.amount, 0) : 0;
    }

    confirmMatch() {
        const f = this.matchForm;
        if (!f || !f.chosen.size) { return; }
        this.act(f.line, this.api.match(f.line.id, [...f.chosen]), 'Matched.', () => this.matchForm = null);
    }

    // ---------- Create ----------

    actionsFor(line: BankFeedLine): BankRuleAction[] {
        const moneyIn = line.amount > 0;
        return (Object.keys(BANK_ACTION_LABEL) as BankRuleAction[]).filter(a => BANK_ACTION_IN[a] === null || BANK_ACTION_IN[a] === moneyIn);
    }

    openCreate(line: BankFeedLine, fromRule = false) {
        this.formError = null;
        const r = fromRule ? line.rule : null;
        const action: BankRuleAction = r?.action ?? (line.amount > 0 ? 'Receipt' : 'Expense');
        this.createForm = {
            line, remember: false, partyLabel: r?.party ?? null, accountLabel: r?.account ?? null,
            model: {action, partyAccountId: r?.partyAccountId ?? null, accountId: r?.accountId ?? null, paymentModeId: null, description: line.description, applyToOpen: true, rememberAs: null}
        };
    }

    /** One click: record the line as the matching rule says. */
    applyRule(line: BankFeedLine) {
        const r = line.rule;
        if (!r) { return; }
        this.act(line, this.api.createFromLine(line.id, {
            action: r.action, partyAccountId: r.partyAccountId, accountId: r.accountId, paymentModeId: null, description: line.description, applyToOpen: true, rememberAs: null
        }), `Recorded by rule "${r.ruleName}".`);
    }

    changeAction(a: BankRuleAction) {
        const f = this.createForm;
        if (!f) { return; }
        f.model.action = a;
        f.model.partyAccountId = null; f.partyLabel = null;
        f.model.accountId = null; f.accountLabel = null;
    }

    searchParties = (term: string | null): Observable<PickerOption[]> => {
        const kind: FinanceKind = this.createForm?.model.action === 'Receipt' ? 'Invoice' : 'Bill';
        return this.finance.parties(kind, term).pipe(map((list: PartyOption[]) => list.map(p => ({id: p.accountId, label: p.name, sub: p.number}))));
    };

    searchAccounts = (term: string | null): Observable<PickerOption[]> => {
        const action = this.createForm?.model.action;
        if (action !== 'Expense' && action !== 'Income') { return of([]); }
        return this.finance.accountOptions(action === 'Expense' ? 'expense' : 'income', term)
            .pipe(map((list: AccountOption[]) => list.map(a => ({id: a.id, label: a.name, sub: [a.code, a.group].filter(Boolean).join(' · ')}))));
    };

    confirmCreate() {
        const f = this.createForm;
        if (!f) { return; }
        const m = f.model;
        if ((m.action === 'Receipt' || m.action === 'Payment') && !m.partyAccountId) { this.formError = `Choose the ${m.action === 'Receipt' ? 'customer' : 'vendor'}.`; return; }
        if (m.action !== 'Receipt' && m.action !== 'Payment' && !m.accountId) { this.formError = 'Choose the account.'; return; }
        const rememberAs = f.remember ? (m.rememberAs ?? '').trim() : '';
        if (f.remember && rememberAs.length < 2) { this.formError = 'Give the text the rule looks for.'; return; }
        this.act(f.line, this.api.createFromLine(f.line.id, {...m, rememberAs: rememberAs || null}), 'Recorded and matched.', () => this.createForm = null);
    }

    /** A sensible rule text: the description without numbers and references. */
    suggestRuleText() {
        const f = this.createForm;
        if (f && f.remember && !f.model.rememberAs) {
            f.model.rememberAs = f.line.description.replace(/[0-9/#:.,-]+/g, ' ').replace(/\s+/g, ' ').trim().split(' ').slice(0, 3).join(' ').slice(0, 100);
        }
    }

    // ---------- Exclude / undo ----------

    confirmExclude() {
        const f = this.excludeForm;
        if (f) { this.act(f.line, this.api.exclude(f.line.id, f.note.trim() || null), 'Excluded.', () => this.excludeForm = null); }
    }

    undo(line: BankFeedLine) {
        if (confirm(line.voucherId ? 'Unmatch this line? The document recorded from it stays in the books; void it there if it is wrong.' : 'Unmatch this line?')) {
            this.act(line, this.api.undo(line.id), 'Unmatched.');
        }
    }

    /** Opens the document a line was recorded as. */
    openDocument(id: string) {
        this.finance.document(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => this.router.navigate(ROUTE_OF_KIND[d.kind].split('/'), {relativeTo: this.route.parent, queryParams: {doc: d.id}}),
            error: e => this.alerts.showMessage('Statement', financeErrorOf(e, 'The document could not be opened.'), MessageSeverity.error)
        });
    }

    // ---------- Reconcile ----------

    openReconcile() {
        const row = this.account?.row;
        this.rec = {asOf: row?.statementDate ?? todayIso(), statementBalance: row?.statementBalance ?? null, data: null, loading: false, error: null};
        this.loadReconciliation();
    }

    loadReconciliation() {
        const r = this.rec;
        if (!r) { return; }
        r.loading = true;
        r.error = null;
        this.api.reconciliation(this.id, r.asOf).pipe(finalize(() => r.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { r.data = d; if (d.statementBalance !== null) { r.statementBalance = d.statementBalance; } },
            error: e => r.error = financeErrorOf(e, 'The reconciliation could not be loaded.')
        });
    }

    get recDifference(): number | null {
        const r = this.rec;
        return r?.data && r.statementBalance !== null && (r.statementBalance as any) !== '' ? Math.round((+r.statementBalance - r.data.ledgerBalance) * 100) / 100 : null;
    }

    closeReconciliation() {
        const r = this.rec;
        if (!r?.data || r.statementBalance === null) { return; }
        r.loading = true;
        r.error = null;
        this.api.closeReconciliation(this.id, r.asOf, +r.statementBalance).pipe(finalize(() => r.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => {
                r.data = d;
                this.alerts.showMessage('Reconciled', `Reconciled to ${d.asOf}. Lines up to this date are locked.`, MessageSeverity.success);
                this.loadAccount();
            },
            error: e => r.error = financeErrorOf(e, 'The reconciliation could not be closed.')
        });
    }
}
