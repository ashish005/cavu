import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize, map} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {AccountOption, todayIso} from "../../domains/finance.models";
import {FinanceApiService, financeErrorOf} from "../../services/finance-api.service";
import {PickerOption} from "../../views/finance-picker.component";
import {BankingApiService} from "../banking-api.service";
import {MONEY_KIND_ICON, MONEY_KIND_LABEL, MoneyAccountInput, MoneyAccountKind, MoneyAccountRow} from "../banking.models";

/** Routing code names by what banks call them. */
const ROUTING_LABELS = ['IFSC', 'IBAN', 'Sort code', 'Routing number', 'BSB', 'Transit number', 'SWIFT'];

/**
 * Bank & cash: every account money moves through (bank accounts, cash, cards, wallets, payment gateways) with the
 * balance in the books, the last statement balance and the lines still to reconcile. Opens an account's statement.
 */
@Component({standalone: false, templateUrl: './templates/money-accounts.html'})
export class FinanceMoneyAccountsView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    readonly kindLabel = MONEY_KIND_LABEL;
    readonly kindIcon = MONEY_KIND_ICON;
    readonly kinds = Object.keys(MONEY_KIND_LABEL) as MoneyAccountKind[];
    readonly routingLabels = ROUTING_LABELS;
    accounts: MoneyAccountRow[] | null = null;
    currency = 'USD';
    loading = false;
    error: string | null = null;

    form: {id: string | null; model: MoneyAccountInput; masked: string | null; routingMasked: string | null; linkLabel: string | null} | null = null;
    saving = false;
    formError: string | null = null;

    constructor(private api: BankingApiService, private finance: FinanceApiService, private alerts: AlertService, private router: Router,
                private route: ActivatedRoute) {}

    ngOnInit() {
        this.finance.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.currency = l.functionalCurrency, error: () => {}});
        this.load();
    }

    load() {
        this.loading = true;
        this.error = null;
        this.api.accounts().pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: a => this.accounts = a,
            error: e => this.error = financeErrorOf(e, 'The accounts could not be loaded.')
        });
    }

    get total() { return (this.accounts ?? []).filter(a => a.currencyCode === this.currency).reduce((s, a) => s + a.ledgerBalance, 0); }

    open(a: MoneyAccountRow) { this.router.navigate([a.id], {relativeTo: this.route}); }

    create(kind: MoneyAccountKind = 'Bank') {
        this.formError = null;
        this.form = {
            id: null, masked: null, routingMasked: null, linkLabel: null,
            model: {
                name: '', kind, accountId: null, bankName: null, accountNumber: null, routing: null, routingLabel: null, bic: null, currencyCode: this.currency,
                branchId: null, isDefaultForReceipts: false, isDefaultForPayments: false, notes: null, openingBalance: null, openingDate: todayIso()
            }
        };
    }

    edit(a: MoneyAccountRow) {
        this.formError = null;
        this.api.account(a.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => this.form = {
                id: a.id, masked: d.accountNumberMasked, routingMasked: d.routingMasked, linkLabel: null,
                model: {
                    name: a.name, kind: a.kind, accountId: a.accountId, bankName: a.bankName, accountNumber: null, routing: null, routingLabel: d.routingLabel,
                    bic: d.bic, currencyCode: a.currencyCode, branchId: a.branchId, isDefaultForReceipts: a.isDefaultForReceipts,
                    isDefaultForPayments: a.isDefaultForPayments, notes: d.notes, openingBalance: null, openingDate: null
                }
            },
            error: e => this.alerts.showMessage('Bank & cash', financeErrorOf(e, 'The account could not be opened.'), MessageSeverity.error)
        });
    }

    searchLedger = (term: string | null): Observable<PickerOption[]> =>
        this.finance.accountOptions('bank', term).pipe(map((list: AccountOption[]) => list.map(a => ({id: a.id, label: a.name, sub: [a.code, a.group].filter(Boolean).join(' · ')}))));

    pickLedger(o: PickerOption) {
        if (!this.form) { return; }
        this.form.model.accountId = o.id;
        this.form.linkLabel = o.label;
        if (!this.form.model.name) { this.form.model.name = o.label; }
    }

    save() {
        const f = this.form;
        if (!f) { return; }
        this.formError = null;
        const m = f.model;
        if ((m.name ?? '').trim().length < 2) { this.formError = 'Give the account a name.'; return; }
        const num = (v: any) => v === null || v === '' || v === undefined ? null : +v;
        const body: MoneyAccountInput = {
            ...m, name: m.name.trim(), currencyCode: (m.currencyCode ?? '').trim().toUpperCase() || null,
            openingBalance: f.id ? null : num(m.openingBalance), openingDate: f.id || num(m.openingBalance) === null ? null : m.openingDate
        };
        this.saving = true;
        this.api.saveAccount(f.id, body).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.form = null;
                this.finance.lookups(true);
                this.alerts.showMessage('Bank & cash', f.id ? 'Account saved.' : 'Account added.', MessageSeverity.success);
                this.load();
            },
            error: e => this.formError = financeErrorOf(e, 'The account could not be saved.')
        });
    }
}
