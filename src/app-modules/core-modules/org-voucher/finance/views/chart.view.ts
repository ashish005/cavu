import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {AccountNature, Chart, CoaAccount, CoaAccountInput, CoaGroup} from "../domains/finance.models";
import {FinanceApiService, financeErrorOf} from "../services/finance-api.service";

interface GroupNode { group: CoaGroup; children: GroupNode[]; accounts: CoaAccount[]; total: number; party?: {accounts: number; balance: number}; }

/**
 * Chart of accounts as a tree per nature (assets, liabilities, equity, revenue, other income, expenses) with balances.
 * Add or edit accounts and groups; built-in accounts keep their code; customer, vendor and employee accounts are summarised.
 */
@Component({standalone: false, templateUrl: './templates/chart.html'})
export class FinanceChartView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    readonly natures: {nature: AccountNature; title: string; creditNormal: boolean}[] = [
        {nature: 'Asset', title: 'Assets', creditNormal: false}, {nature: 'Liability', title: 'Liabilities', creditNormal: true},
        {nature: 'Equity', title: 'Equity', creditNormal: true}, {nature: 'Revenue', title: 'Revenue', creditNormal: true},
        {nature: 'Income', title: 'Other income', creditNormal: true}, {nature: 'Expense', title: 'Expenses', creditNormal: false}
    ];
    chart: Chart | null = null;
    trees: Record<string, GroupNode[]> = {};
    expanded = new Set<string>();
    search = '';
    showInactive = false;
    loading = false;
    error: string | null = null;

    accountForm: {id: string | null; isSystem: boolean; model: CoaAccountInput} | null = null;
    groupForm: {id: string | null; parent: CoaGroup | null; name: string; code: string | null} | null = null;
    saving = false;
    formError: string | null = null;

    constructor(private api: FinanceApiService, private alerts: AlertService) {}

    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.api.chart().pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: c => { this.chart = c; this.build(); this.error = null; },
            error: e => this.error = financeErrorOf(e, 'The chart of accounts could not be loaded.')
        });
    }

    private build() {
        const c = this.chart!;
        const term = this.search.trim().toLowerCase();
        const matches = (a: CoaAccount) => (this.showInactive || a.isActive)
            && (!term || a.name.toLowerCase().includes(term) || (a.code ?? '').toLowerCase().includes(term));
        const node = (g: CoaGroup): GroupNode => {
            const children = c.groups.filter(x => x.parentId === g.id).map(node);
            const accounts = c.accounts.filter(a => a.groupId === g.id && matches(a));
            const party = c.partyGroups.find(p => p.groupId === g.id);
            const total = accounts.reduce((s, a) => s + a.balance, 0) + children.reduce((s, ch) => s + ch.total, 0) + (party?.balance ?? 0);
            return {group: g, children, accounts, total, party: party ? {accounts: party.accounts, balance: party.balance} : undefined};
        };
        const prune = (n: GroupNode): GroupNode | null => {
            const children = n.children.map(prune).filter((x): x is GroupNode => !!x);
            if (term && !children.length && !n.accounts.length && !n.group.name.toLowerCase().includes(term)) { return null; }
            return {...n, children};
        };
        this.trees = {};
        for (const n of this.natures) {
            this.trees[n.nature] = c.groups.filter(g => !g.parentId && g.nature === n.nature).map(node).map(prune).filter((x): x is GroupNode => !!x);
        }
        if (term) { c.groups.forEach(g => this.expanded.add(g.id)); }
    }

    applySearch() { this.build(); }
    toggle(id: string) { this.expanded.has(id) ? this.expanded.delete(id) : this.expanded.add(id); }
    expandAll(open: boolean) { this.expanded = new Set(open ? this.chart?.groups.map(g => g.id) ?? [] : []); }

    /** Balance shown with the account's normal sign (credit-normal natures show credits as positive). */
    shown(value: number, nature: AccountNature) {
        return this.natures.find(n => n.nature === nature)?.creditNormal ? -value : value;
    }

    // ---------- Accounts ----------

    newAccount(group: CoaGroup) {
        this.formError = null;
        this.accountForm = {id: null, isSystem: false, model: {name: '', code: null, groupId: group.id, description: null, isBank: false, isCash: false, currencyCode: null, isActive: true}};
    }

    editAccount(a: CoaAccount) {
        this.formError = null;
        this.accountForm = {id: a.id, isSystem: a.isSystem, model: {name: a.name, code: a.code, groupId: a.groupId, description: a.description, isBank: a.isBank, isCash: a.isCash, currencyCode: a.currencyCode, isActive: a.isActive}};
    }

    get postingGroups() { return (this.chart?.groups ?? []).filter(g => g.allowPosting && !['customer_receivables', 'supplier_payables', 'employee_receivables'].includes(g.code ?? '')); }

    saveAccount() {
        const f = this.accountForm!;
        if (!f.model.name?.trim()) { this.formError = 'Enter the account name.'; return; }
        this.saving = true;
        const call = f.id ? this.api.updateAccount(f.id, f.model) : this.api.createAccount(f.model);
        call.pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.accountForm = null; this.alerts.showMessage('Saved', 'Account saved.', MessageSeverity.success); this.load(); },
            error: e => this.formError = financeErrorOf(e, 'The account could not be saved.')
        });
    }

    deleteAccount() {
        const f = this.accountForm!;
        if (!f.id || !confirm('Delete this account? Accounts with postings can only be deactivated.')) { return; }
        this.saving = true;
        this.api.deleteAccount(f.id).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.accountForm = null; this.load(); },
            error: e => this.formError = financeErrorOf(e, 'The account could not be deleted.')
        });
    }

    // ---------- Groups ----------

    newGroup(parent: CoaGroup) { this.formError = null; this.groupForm = {id: null, parent, name: '', code: null}; }
    renameGroup(g: CoaGroup) { this.formError = null; this.groupForm = {id: g.id, parent: null, name: g.name, code: g.code}; }

    saveGroup() {
        const f = this.groupForm!;
        if (!f.name?.trim()) { this.formError = 'Enter the group name.'; return; }
        this.saving = true;
        const body = {name: f.name.trim(), code: f.code, parentId: f.parent?.id ?? '00000000-0000-0000-0000-000000000000'};
        const call = f.id ? this.api.renameGroup(f.id, body) : this.api.createGroup(body);
        call.pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: g => { this.groupForm = null; this.expanded.add(g.parentId ?? g.id); this.load(); },
            error: e => this.formError = financeErrorOf(e, 'The group could not be saved.')
        });
    }
}
