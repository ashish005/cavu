import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize, forkJoin} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {ExpenseApiService, expenseErrorOf} from "../expense-api.service";
import {CategoryKind, ExpenseCategory, ExpenseLookups, ExpensePolicy} from "../expense.models";

/**
 * Expense settings (finance): the policy (receipts, deadlines, approval, duplicates, card / petty cash / payout accounts)
 * and the categories employees choose from, each posting to an expense account, with limits and mileage or per-diem rates.
 */
@Component({standalone: false, templateUrl: './templates/expense-settings.html'})
export class ExpenseSettingsView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    readonly kinds: {value: CategoryKind; label: string}[] = [
        {value: 'Standard', label: 'Amount on the receipt'}, {value: 'Mileage', label: 'Mileage (distance × rate)'}, {value: 'PerDiem', label: 'Per diem (days × allowance)'}
    ];
    lookups: ExpenseLookups | null = null;
    policy: ExpensePolicy | null = null;
    categories: ExpenseCategory[] = [];
    expenseAccounts: {id: string; name: string}[] = [];
    balanceAccounts: {id: string; name: string}[] = [];
    form: ExpenseCategory | null = null;
    saving = false;
    error: string | null = null;
    formError: string | null = null;

    constructor(private api: ExpenseApiService, private alerts: AlertService) {}

    ngOnInit() {
        forkJoin({l: this.api.lookups(true), p: this.api.policy(), c: this.api.categories(), e: this.api.accountOptions('expense', null), a: this.api.accountOptions('item', null)})
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: r => { this.lookups = r.l; this.policy = r.p; this.categories = r.c; this.expenseAccounts = r.e; this.balanceAccounts = r.a; },
                error: e => this.error = expenseErrorOf(e, 'Settings could not be loaded.')
            });
    }

    savePolicy() {
        const p = this.policy;
        if (!p) { return; }
        this.saving = true;
        this.error = null;
        this.api.savePolicy({...p, receiptRequiredAbove: +p.receiptRequiredAbove || 0, submitWithinDays: +p.submitWithinDays || 90, duplicateWindowDays: +p.duplicateWindowDays || 0})
            .pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: s => { this.policy = s; this.api.lookups(true); this.alerts.showMessage('Saved', 'Expense policy saved.', MessageSeverity.success); },
                error: e => this.error = expenseErrorOf(e, 'The policy could not be saved.')
            });
    }

    newCategory() {
        this.formError = null;
        this.form = {id: null, name: '', code: null, description: null, kind: 'Standard', accountId: this.expenseAccounts[0]?.id ?? '', accountName: null,
            defaultTaxCodeId: null, rate: null, unit: 'km', limitPerItem: null, receiptRequiredAbove: null, requiresAttendees: false,
            sortOrder: (this.categories.length + 1), isActive: true};
    }

    editCategory(c: ExpenseCategory) { this.formError = null; this.form = {...c}; }

    saveCategory() {
        const f = this.form;
        if (!f) { return; }
        if (!(f.name ?? '').trim()) { this.formError = 'Give the category a name.'; return; }
        if (!f.accountId) { this.formError = 'Choose the expense account.'; return; }
        const num = (v: any) => v === null || v === '' || v === undefined ? null : +v;
        this.saving = true;
        this.api.saveCategory({...f, name: f.name.trim(), rate: num(f.rate), limitPerItem: num(f.limitPerItem), receiptRequiredAbove: num(f.receiptRequiredAbove), sortOrder: +f.sortOrder || 0})
            .pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: saved => {
                    const i = this.categories.findIndex(c => c.id === saved.id);
                    if (i >= 0) { this.categories[i] = saved; } else { this.categories = [...this.categories, saved]; }
                    this.form = null;
                    this.api.lookups(true);
                },
                error: e => this.formError = expenseErrorOf(e, 'The category could not be saved.')
            });
    }

    kindLabel(k: CategoryKind) { return this.kinds.find(x => x.value === k)?.label ?? k; }
}
