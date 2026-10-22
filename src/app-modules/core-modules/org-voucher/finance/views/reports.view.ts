import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize, map} from "rxjs";
import {DateFormatCell, ViewExtender} from "@app-global";
import {AccountOption, AnalysisBy, AnalysisReport, AnalysisSide, BalanceSheet, JournalQueryOptions, JournalRow, LedgerReport, ProfitLoss, ReportSection, TAX_KIND_LABEL, TaxReport, TrialBalance, todayIso} from "../domains/finance.models";
import {FinanceApiService, JournalGridService, financeErrorOf} from "../services/finance-api.service";
import {PickerOption} from "./finance-picker.component";
import {formatMoney} from "../grid-cells/finance-cells";

type Tab = 'pl' | 'bs' | 'tb' | 'tax' | 'analysis' | 'ledger' | 'journals';

/**
 * Financial reports from the ledger: profit and loss, balance sheet, trial balance, account ledger (running balance)
 * (cash and bank books from the money accounts), sales/purchase analysis and the journal register. Periods default to
 * the financial year to date; every report exports to CSV.
 */
@Component({standalone: false, templateUrl: './templates/reports.html'})
export class FinanceReportsView extends ViewExtender<JournalRow> implements OnInit {
    override coreState = new JournalQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    readonly tabs: {key: Tab; label: string}[] = [
        {key: 'pl', label: 'Profit and loss'}, {key: 'bs', label: 'Balance sheet'}, {key: 'tb', label: 'Trial balance'}, {key: 'tax', label: 'Tax summary'},
        {key: 'analysis', label: 'Analysis'}, {key: 'ledger', label: 'Ledger & cash book'}, {key: 'journals', label: 'Journal register'}
    ];
    tab: Tab = 'pl';
    from: string | null = null;
    to: string | null = todayIso();
    loading = false;
    error: string | null = null;

    pl: ProfitLoss | null = null;
    bs: BalanceSheet | null = null;
    tb: TrialBalance | null = null;
    tax: TaxReport | null = null;
    readonly kindLabel = TAX_KIND_LABEL;
    analysis: AnalysisReport | null = null;
    side: AnalysisSide = 'sales';
    by: AnalysisBy = 'party';
    readonly sides: {key: AnalysisSide; label: string}[] = [
        {key: 'sales', label: 'Sales'}, {key: 'purchases', label: 'Purchases'}, {key: 'receipts', label: 'Money in'}, {key: 'payments', label: 'Money out'}
    ];
    /** Cash and bank accounts, for the cash/bank book shortcuts. */
    moneyAccounts: AccountOption[] = [];
    ledger: LedgerReport | null = null;
    ledgerAccount: {id: string; label: string} | null = null;
    ledgerPage = {skip: 0, take: 50, page: 1};

    constructor(public override service: JournalGridService, public override activatedRoute: ActivatedRoute, private router: Router, private api: FinanceApiService) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Date', field: 'date', cellTemplate: DateFormatCell},
            {headerName: 'Entry', field: 'entryNumber'},
            {headerName: 'Description', field: 'description', cellFn: (r: JournalRow) => r.description ?? ''},
            {headerName: 'Lines', field: 'lines', cellFn: (r: JournalRow) => r.lines.map(l => `${l.debit ? 'Dr' : 'Cr'} ${l.account} ${formatMoney(l.debit || l.credit, r.currency, false)}`).join(' · ')},
            {headerName: 'Amount', field: 'amount', class: 'text-right', cellFn: (r: JournalRow) => formatMoney(r.amount, r.currency)}
        ];
    }

    get errorText() { return this.error ?? (this.errorMsg ? financeErrorOf(this.errorMsg, 'The journals could not be loaded.') : null); }

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.moneyAccounts = l.bankAccounts, error: () => {}});
        this.activatedRoute.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(q => {
            const tab = (q.get('tab') as Tab) || 'pl';
            const account = q.get('account');
            const side = q.get('side') as AnalysisSide | null;
            if (side && ['sales', 'purchases', 'receipts', 'payments'].includes(side)) { this.side = side; }
            if (account && account !== this.ledgerAccount?.id) { this.ledgerAccount = {id: account, label: 'Selected account'}; }
            this.select(tab, false);
        });
    }

    select(tab: Tab, navigate = true) {
        this.tab = tab;
        this.error = null;
        if (navigate) { this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {tab}, queryParamsHandling: 'merge', replaceUrl: true}); return; }
        this.run();
    }

    /** Quick periods. */
    period(p: 'month' | 'quarter' | 'year' | 'fy') {
        const now = new Date();
        const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        this.to = iso(now);
        if (p === 'month') { this.from = iso(new Date(now.getFullYear(), now.getMonth(), 1)); }
        if (p === 'quarter') { this.from = iso(new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)); }
        if (p === 'year') { this.from = iso(new Date(now.getFullYear(), 0, 1)); }
        if (p === 'fy') { this.from = null; }
        this.run();
    }

    run() {
        this.error = null;
        switch (this.tab) {
            case 'pl': this.load(this.api.profitLoss(this.from, this.to), r => this.pl = r); break;
            case 'bs': this.load(this.api.balanceSheet(this.to), r => this.bs = r); break;
            case 'tb': this.load(this.api.trialBalance(this.from, this.to), r => this.tb = r); break;
            case 'tax': this.load(this.api.taxReport(this.from, this.to), r => this.tax = r); break;
            case 'analysis':
                if (this.by === 'mode' && (this.side === 'sales' || this.side === 'purchases')) { this.by = 'party'; }
                this.load(this.api.analysis(this.side, this.by, this.from, this.to), r => this.analysis = r);
                break;
            case 'ledger': this.loadLedger(); break;
            case 'journals':
                Object.assign(this.coreState, {from: this.from, to: this.to, skip: 0, page: 1, take: 25});
                this.populateGrid();
                break;
        }
    }

    private load<T>(call: Observable<T>, set: (r: T) => void) {
        this.loading = true;
        call.pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({next: set, error: e => this.error = financeErrorOf(e, 'The report could not be loaded.')});
    }

    // ---------- Ledger ----------

    searchAccounts = (term: string | null): Observable<PickerOption[]> =>
        this.api.accountOptions(null, term).pipe(map((list: AccountOption[]) => list.map(a => ({id: a.id, label: a.name, sub: [a.code, a.group].filter(Boolean).join(' · ')}))));

    pickAccount(o: PickerOption) {
        this.ledgerAccount = {id: o.id, label: o.label};
        this.ledgerPage = {skip: 0, take: 50, page: 1};
        this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {tab: 'ledger', account: o.id}, queryParamsHandling: 'merge', replaceUrl: true});
    }

    loadLedger() {
        if (!this.ledgerAccount) { this.ledger = null; return; }
        this.load(this.api.ledger(this.ledgerAccount.id, this.from, this.to, this.ledgerPage.skip, this.ledgerPage.take), r => {
            this.ledger = r;
            this.ledgerAccount = {id: r.accountId, label: r.account};
        });
    }

    ledgerToPage(p: {skip: number; take: number; page?: number}) {
        this.ledgerPage = {skip: p.skip, take: p.take, page: p.page ?? Math.floor(p.skip / p.take) + 1};
        this.loadLedger();
    }

    openLedger(accountId: string | null) {
        if (!accountId) { return; }
        this.ledgerPage = {skip: 0, take: 50, page: 1};
        this.ledgerAccount = {id: accountId, label: 'Account'};
        this.router.navigate([], {relativeTo: this.activatedRoute, queryParams: {tab: 'ledger', account: accountId}, queryParamsHandling: 'merge'});
    }

    // ---------- Analysis ----------

    get byLabel() { return {party: this.side === 'sales' || this.side === 'receipts' ? 'Customer' : 'Vendor', month: 'Month', preparer: 'Prepared by', mode: 'Payment mode'}[this.by]; }
    get hasOutstanding() { return this.side === 'sales' || this.side === 'purchases'; }

    setSide(side: AnalysisSide) { this.side = side; this.run(); }
    setBy(by: AnalysisBy) { this.by = by; this.run(); }

    // ---------- Export ----------

    exportCsv() {
        const rows: (string | number)[][] = [];
        const section = (s: ReportSection) => { rows.push([s.title, '']); s.lines.forEach(l => rows.push([`${'  '.repeat(l.level)}${l.name}`, l.amount])); rows.push([`Total ${s.title}`, s.total]); rows.push([]); };
        let name = 'report';
        if (this.tab === 'pl' && this.pl) { name = `profit-loss_${this.pl.from}_${this.pl.to}`; this.pl.sections.forEach(section); rows.push(['Net profit', this.pl.netProfit]); }
        if (this.tab === 'bs' && this.bs) { name = `balance-sheet_${this.bs.asOf}`; this.bs.sections.forEach(section); }
        if (this.tab === 'tb' && this.tb) {
            name = `trial-balance_${this.tb.from}_${this.tb.to}`;
            rows.push(['Code', 'Account', 'Group', 'Opening', 'Debit', 'Credit', 'Closing']);
            this.tb.rows.forEach(r => rows.push([r.code, r.name, r.group, r.opening, r.debit, r.credit, r.closing]));
            rows.push(['', 'Total', '', '', this.tb.totalDebit, this.tb.totalCredit, '']);
        }
        if (this.tab === 'tax' && this.tax) {
            name = `tax_${this.tax.from}_${this.tax.to}`;
            rows.push(['Country', 'Jurisdiction', 'Code', 'Component', 'Kind', 'Side', 'Rate', 'Return box', 'Taxable', 'Tax', 'Documents']);
            this.tax.rows.forEach(r => rows.push([r.countryCode ?? '', r.jurisdiction ?? '', r.code, r.component, r.kind, r.isSales ? 'Sales' : 'Purchases', r.rate, r.reportingCode ?? '', r.taxable, r.tax, r.documents]));
            rows.push([]); rows.push(['Output tax', this.tax.outputTax]); rows.push(['Input tax', this.tax.inputTax]); rows.push(['Net payable', this.tax.netPayable]);
        }
        if (this.tab === 'analysis' && this.analysis) {
            const a = this.analysis;
            name = `${a.side}-by-${a.by}_${a.from}_${a.to}`;
            rows.push([this.byLabel, 'Documents', 'Amount', ...(this.hasOutstanding ? ['Outstanding'] : []), 'Share %']);
            a.rows.forEach(r => rows.push([r.label, r.documents, r.amount, ...(this.hasOutstanding ? [r.outstanding] : []), r.share]));
            rows.push(['Total', a.documents, a.amount, ...(this.hasOutstanding ? [a.outstanding] : []), 100]);
        }
        if (this.tab === 'ledger' && this.ledger) {
            name = `ledger_${this.ledger.code ?? this.ledger.account}`;
            rows.push(['Date', 'Entry', 'Description', 'Party', 'Debit', 'Credit', 'Balance']);
            rows.push(['', '', 'Opening balance', '', '', '', this.ledger.opening]);
            this.ledger.lines.entities.forEach(l => rows.push([l.date, l.entryNumber, l.description ?? '', l.party ?? '', l.debit, l.credit, l.balance]));
        }
        const csv = rows.map(r => r.map(c => { const s = String(c ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(',')).join('\n');
        const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8'}));
        const a = document.createElement('a');
        a.href = url; a.download = `${name}.csv`; a.click();
        URL.revokeObjectURL(url);
    }

    print() { window.print(); }
}
