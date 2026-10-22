import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize, forkJoin, map, of} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {AccountOption, FinanceKind, PartyOption} from "../../domains/finance.models";
import {FinanceApiService, financeErrorOf} from "../../services/finance-api.service";
import {PickerOption} from "../../views/finance-picker.component";
import {BankingApiService} from "../banking-api.service";
import {BANK_ACTION_LABEL, BankRule, BankRuleAction, BankRuleInput, MoneyAccountRow, PaymentModeSetting} from "../banking.models";

/**
 * Payment modes offered on receipts and payments (cash, cheque, card, UPI…), their order, and the money account each
 * settles to when none is chosen on the document.
 */
@Component({standalone: false, templateUrl: './templates/payment-modes.html'})
export class FinancePaymentModesView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    modes: PaymentModeSetting[] | null = null;
    moneyAccounts: AccountOption[] = [];
    saving = false;
    error: string | null = null;

    constructor(private api: BankingApiService, private finance: FinanceApiService, private alerts: AlertService) {}

    ngOnInit() {
        forkJoin({m: this.api.paymentModes(), l: this.finance.lookups()}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: ({m, l}) => { this.modes = m; this.moneyAccounts = l.bankAccounts; },
            error: e => this.error = financeErrorOf(e, 'Payment modes could not be loaded.')
        });
    }

    move(i: number, by: -1 | 1) {
        const list = this.modes;
        if (!list || i + by < 0 || i + by >= list.length) { return; }
        [list[i], list[i + by]] = [list[i + by], list[i]];
    }

    save() {
        const list = this.modes;
        if (!list) { return; }
        if (!list.some(m => m.isEnabled)) { this.error = 'Keep at least one payment mode.'; return; }
        this.error = null;
        this.saving = true;
        this.api.savePaymentModes(list.map((m, i) => ({paymentModeId: m.id, isEnabled: m.isEnabled, accountId: m.accountId, sortOrder: i + 1})))
            .pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: m => { this.modes = m; this.finance.lookups(true); this.alerts.showMessage('Saved', 'Payment modes saved.', MessageSeverity.success); },
                error: e => this.error = financeErrorOf(e, 'Payment modes could not be saved.')
            });
    }
}

/**
 * Bank rules: statement lines containing some text are pre-filled as a customer payment, vendor payment, expense,
 * income or transfer. Rules are also created from the statement ("Remember for lines like this").
 */
@Component({standalone: false, templateUrl: './templates/bank-rules.html'})
export class FinanceBankRulesView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    readonly actionLabel = BANK_ACTION_LABEL;
    readonly actions = Object.keys(BANK_ACTION_LABEL) as BankRuleAction[];
    rules: BankRule[] | null = null;
    accounts: MoneyAccountRow[] = [];
    moneyLedgers: AccountOption[] = [];
    error: string | null = null;
    form: {id: string | null; model: BankRuleInput; partyLabel: string | null; accountLabel: string | null} | null = null;
    saving = false;
    formError: string | null = null;

    constructor(private api: BankingApiService, private finance: FinanceApiService, private alerts: AlertService) {}

    ngOnInit() {
        this.api.accounts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: a => this.accounts = a, error: () => {}});
        this.finance.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.moneyLedgers = l.bankAccounts, error: () => {}});
        this.load();
    }

    load() {
        this.api.rules().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => this.rules = r,
            error: e => this.error = financeErrorOf(e, 'Rules could not be loaded.')
        });
    }

    accountName(id: string | null) { return id ? this.accounts.find(a => a.id === id)?.name ?? '' : 'Any account'; }

    create() {
        this.formError = null;
        this.form = {id: null, partyLabel: null, accountLabel: null,
            model: {name: '', contains: '', moneyIn: false, bankAccountId: null, action: 'Expense', partyAccountId: null, accountId: null, priority: 100}};
    }

    edit(r: BankRule) {
        this.formError = null;
        this.form = {id: r.id, partyLabel: r.party, accountLabel: r.account,
            model: {name: r.name, contains: r.contains, moneyIn: r.moneyIn, bankAccountId: r.bankAccountId, action: r.action, partyAccountId: r.partyAccountId,
                accountId: r.accountId, priority: r.priority}};
    }

    changeAction(a: BankRuleAction) {
        const f = this.form;
        if (!f) { return; }
        f.model.action = a;
        f.model.partyAccountId = null; f.partyLabel = null;
        f.model.accountId = null; f.accountLabel = null;
        f.model.moneyIn = a === 'Receipt' || a === 'Income' ? true : a === 'Payment' || a === 'Expense' ? false : f.model.moneyIn;
    }

    searchParties = (term: string | null): Observable<PickerOption[]> => {
        const kind: FinanceKind = this.form?.model.action === 'Receipt' ? 'Invoice' : 'Bill';
        return this.finance.parties(kind, term).pipe(map((list: PartyOption[]) => list.map(p => ({id: p.accountId, label: p.name, sub: p.number}))));
    };

    searchAccounts = (term: string | null): Observable<PickerOption[]> => {
        const action = this.form?.model.action;
        if (action !== 'Expense' && action !== 'Income') { return of([]); }
        return this.finance.accountOptions(action === 'Expense' ? 'expense' : 'income', term)
            .pipe(map((list: AccountOption[]) => list.map(a => ({id: a.id, label: a.name, sub: [a.code, a.group].filter(Boolean).join(' · ')}))));
    };

    save() {
        const f = this.form;
        if (!f) { return; }
        const m = f.model;
        this.formError = null;
        if ((m.contains ?? '').trim().length < 2) { this.formError = 'Give the text to look for.'; return; }
        if ((m.action === 'Receipt' || m.action === 'Payment') && !m.partyAccountId) { this.formError = `Choose the ${m.action === 'Receipt' ? 'customer' : 'vendor'}.`; return; }
        if (m.action !== 'Receipt' && m.action !== 'Payment' && !m.accountId) { this.formError = 'Choose the account.'; return; }
        this.saving = true;
        const body: BankRuleInput = {...m, contains: m.contains.trim(), name: (m.name ?? '').trim() || m.contains.trim(), priority: +m.priority || 100};
        this.api.saveRule(f.id, body).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.form = null; this.load(); this.alerts.showMessage('Saved', 'Rule saved.', MessageSeverity.success); },
            error: e => this.formError = financeErrorOf(e, 'The rule could not be saved.')
        });
    }

    remove(r: BankRule) {
        if (!confirm(`Remove the rule "${r.name}"?`)) { return; }
        this.api.deleteRule(r.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.load(),
            error: e => this.alerts.showMessage('Bank rules', financeErrorOf(e, 'The rule could not be removed.'), MessageSeverity.error)
        });
    }
}
