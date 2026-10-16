import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize, forkJoin} from "rxjs";
import {AlertService, DateFormatCell, FullDateFormatCell, MessageSeverity, ViewExtender} from "@app-global";
import {
    AccountOption, AccountingSettings, DocumentTypeInput, DocumentTypeRow, InvoiceSettings, PostingJobQueryOptions, PostingJobRow, PostingSummary,
    RecurringInput, RecurringRow, SimpleQueryOptions, TaxCodeInput, TaxCodeRow, TaxOption
} from "../domains/finance.models";
import {
    DocumentTypeGridService, FinanceApiService, FinanceGridEvents, PostingJobGridService, RecurringGridService, TaxCodeGridService, financeErrorOf
} from "../services/finance-api.service";
import {DocumentTypeCell, PostingJobCell, RecurringCell, TaxCodeCell, formatMoney} from "../grid-cells/finance-cells";

/** Tax codes: rates charged on sales and paid on purchases, with the accounts they post to. */
@Component({standalone: false, templateUrl: './templates/settings-tax-codes.html'})
export class FinanceTaxCodesView extends ViewExtender<TaxCodeRow> implements OnInit {
    override coreState = new SimpleQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    taxAccounts: AccountOption[] = [];
    form: {id: string | null; model: TaxCodeInput} | null = null;
    saving = false;
    formError: string | null = null;

    constructor(public override service: TaxCodeGridService, public override activatedRoute: ActivatedRoute, private api: FinanceApiService,
                private events: FinanceGridEvents, private alerts: AlertService) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Code', field: 'code', cellTemplate: TaxCodeCell},
            {headerName: 'Rate', field: 'rate', class: 'text-right', cellFn: (r: TaxCodeRow) => `${+r.rate}%`},
            {headerName: 'Used for', field: 'scope', cellFn: (r: TaxCodeRow) => r.scope === 'Both' ? 'Sales and purchases' : r.scope},
            {headerName: 'Posts to', field: 'salesAccount', cellFn: (r: TaxCodeRow) => [r.salesAccount ?? (r.scope !== 'Purchases' ? 'Output tax (default)' : null), r.purchaseAccount ?? (r.scope !== 'Sales' ? 'Input tax (default)' : null)].filter(Boolean).join(' · ')},
            {headerName: 'Lines', field: 'usedOnLines', class: 'text-right'}
        ];
    }

    get errorText() { return this.errorMsg ? financeErrorOf(this.errorMsg, 'Tax codes could not be loaded.') : null; }

    ngOnInit() {
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'open') { this.edit(a.row); } });
        this.api.accountOptions(null, 'tax').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: a => this.taxAccounts = a, error: () => {}});
        this.populateGrid();
    }

    actionCb(row: TaxCodeRow) { this.edit(row); }

    add() { this.formError = null; this.form = {id: null, model: {code: '', name: '', rate: 0, scope: 'Both', salesAccountId: null, purchaseAccountId: null, isDefault: false, isActive: true, description: null, countryCode: null}}; }

    edit(r: TaxCodeRow) {
        this.formError = null;
        this.form = {id: r.id, model: {code: r.code, name: r.name, rate: +r.rate, scope: r.scope, salesAccountId: r.salesAccountId, purchaseAccountId: r.purchaseAccountId,
            isDefault: r.isDefault, isActive: r.isActive, description: r.description, countryCode: r.countryCode}};
    }

    save() {
        const f = this.form!;
        if (!f.model.code?.trim() || !f.model.name?.trim()) { this.formError = 'Enter the code and name.'; return; }
        this.saving = true;
        this.api.saveTaxCode(f.id, {...f.model, rate: +f.model.rate}).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.form = null; this.api.lookups(true); this.alerts.showMessage('Saved', 'Tax code saved.', MessageSeverity.success); this.refreshGrid(); },
            error: e => this.formError = financeErrorOf(e, 'The tax code could not be saved.')
        });
    }

    remove() {
        const f = this.form!;
        if (!f.id || !confirm('Remove this tax code? Documents that used it keep their amounts.')) { return; }
        this.api.deleteTaxCode(f.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.form = null; this.api.lookups(true); this.refreshGrid(); },
            error: e => this.formError = financeErrorOf(e, 'The tax code could not be removed.')
        });
    }
}

/** Invoicing preferences: approval limits, default taxes and terms, footer and payment instructions. */
@Component({standalone: false, templateUrl: './templates/settings-invoicing.html'})
export class FinanceInvoicingView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    model: InvoiceSettings | null = null;
    taxes: TaxOption[] = [];
    currency = 'USD';
    saving = false;
    error: string | null = null;

    constructor(private api: FinanceApiService, private alerts: AlertService) {}

    ngOnInit() {
        forkJoin({s: this.api.invoiceSettings(), l: this.api.lookups(true)}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: ({s, l}) => { this.model = s; this.taxes = l.taxCodes; this.currency = l.functionalCurrency; },
            error: e => this.error = financeErrorOf(e, 'Settings could not be loaded.')
        });
    }

    save() {
        this.saving = true;
        this.error = null;
        const m = this.model!;
        const num = (v: any) => v === null || v === '' || v === undefined ? null : +v;
        this.api.saveInvoiceSettings({...m, billApprovalThreshold: num(m.billApprovalThreshold), invoiceApprovalThreshold: num(m.invoiceApprovalThreshold), defaultDueDays: +m.defaultDueDays || 0})
            .pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: s => { this.model = s; this.api.lookups(true); this.alerts.showMessage('Saved', 'Invoicing settings saved.', MessageSeverity.success); },
                error: e => this.error = financeErrorOf(e, 'Settings could not be saved.')
            });
    }
}

/** Document types: names, labels, numbering (prefix, digits, start, manual) and default accounts. */
@Component({standalone: false, templateUrl: './templates/settings-document-types.html'})
export class FinanceDocumentTypesView extends ViewExtender<DocumentTypeRow> implements OnInit {
    override coreState = new SimpleQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    accounts: AccountOption[] = [];
    form: {row: DocumentTypeRow; model: DocumentTypeInput} | null = null;
    saving = false;
    formError: string | null = null;

    constructor(public override service: DocumentTypeGridService, public override activatedRoute: ActivatedRoute, private api: FinanceApiService,
                private events: FinanceGridEvents, private alerts: AlertService) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Type', field: 'name', cellTemplate: DocumentTypeCell},
            {headerName: 'Number format', field: 'prefix', cellFn: (r: DocumentTypeRow) => r.manual ? 'Manual' : `${r.prefix ?? ''}${'0'.repeat(Math.max(0, r.numberLength - 1))}1${r.suffix ?? ''}`},
            {headerName: 'Default account', field: 'defaultAccount', cellFn: (r: DocumentTypeRow) => r.defaultAccount ?? '—'},
            {headerName: 'On menus', field: 'showOnMenu', cellFn: (r: DocumentTypeRow) => r.showOnMenu ? 'Yes' : 'No'}
        ];
        this.coreState.take = 100;
    }

    ngOnInit() {
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'open') { this.edit(a.row); } });
        this.api.accountOptions('item', null).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: a => this.accounts = a, error: () => {}});
        this.populateGrid();
    }

    actionCb(row: DocumentTypeRow) { this.edit(row); }

    edit(r: DocumentTypeRow) {
        this.formError = null;
        this.form = {row: r, model: {name: r.name, prefix: r.prefix, suffix: r.suffix, numberLength: r.numberLength, startingNumber: r.startingNumber, manual: r.manual,
            numberLabel: r.numberLabel, dateLabel: r.dateLabel, showOnMenu: r.showOnMenu, isActive: r.isActive, defaultAccountId: r.defaultAccountId}};
    }

    get preview() {
        const m = this.form?.model;
        if (!m) { return ''; }
        if (m.manual) { return 'Entered by hand'; }
        const next = (+m.startingNumber || 1) + (this.form!.row.issued || 0);
        return `${m.prefix ?? ''}${String(next).padStart(+m.numberLength || 1, '0')}${m.suffix ?? ''}`;
    }

    save() {
        const f = this.form!;
        this.saving = true;
        this.api.saveDocumentType(+f.row.id, {...f.model, numberLength: +f.model.numberLength, startingNumber: +f.model.startingNumber})
            .pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: () => { this.form = null; this.alerts.showMessage('Saved', 'Document type saved.', MessageSeverity.success); this.refreshGrid(); },
                error: e => this.formError = financeErrorOf(e, 'The document type could not be saved.')
            });
    }
}

/** Default posting accounts and the functional currency. */
@Component({standalone: false, templateUrl: './templates/settings-accounting.html'})
export class FinanceAccountingView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    settings: AccountingSettings | null = null;
    accounts: AccountOption[] = [];
    choices: Record<string, string | null> = {};
    currency = '';
    saving = false;
    error: string | null = null;

    constructor(private api: FinanceApiService, private alerts: AlertService) {}

    ngOnInit() {
        forkJoin({s: this.api.accountingSettings(), a: this.api.accountOptions(null, null)}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: ({s, a}) => { this.apply(s); this.accounts = a; },
            error: e => this.error = financeErrorOf(e, 'Accounting settings could not be loaded.')
        });
    }

    private apply(s: AccountingSettings) {
        this.settings = s;
        this.currency = s.functionalCurrency;
        this.choices = Object.fromEntries(s.accounts.map(a => [a.key, a.accountId]));
    }

    save() {
        this.saving = true;
        this.error = null;
        this.api.saveAccountingSettings({functionalCurrency: this.currency?.toUpperCase() || null, accounts: this.choices})
            .pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: s => { this.apply(s); this.api.lookups(true); this.alerts.showMessage('Saved', 'Accounting defaults saved.', MessageSeverity.success); },
                error: e => this.error = financeErrorOf(e, 'Accounting settings could not be saved.')
            });
    }
}

/** Posting queue: vouchers waiting to be posted by the worker, and failures to fix and retry. */
@Component({standalone: false, templateUrl: './templates/settings-posting.html'})
export class FinancePostingView extends ViewExtender<PostingJobRow> implements OnInit {
    override coreState = new PostingJobQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    summary: PostingSummary | null = null;

    constructor(public override service: PostingJobGridService, public override activatedRoute: ActivatedRoute, private api: FinanceApiService,
                private events: FinanceGridEvents, private alerts: AlertService) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Voucher', field: 'voucherNo', cellTemplate: PostingJobCell},
            {headerName: 'Date', field: 'voucherDate', cellTemplate: DateFormatCell},
            {headerName: 'Amount', field: 'amount', class: 'text-right', cellFn: (r: PostingJobRow) => r.amount === null ? '' : formatMoney(r.amount, null, false)},
            {headerName: 'State', field: 'status'},
            {headerName: 'Attempts', field: 'attempts', class: 'text-right'},
            {headerName: 'Queued', field: 'createdDate', cellTemplate: FullDateFormatCell}
        ];
    }

    get errorText() { return this.errorMsg ? financeErrorOf(this.errorMsg, 'The queue could not be loaded.') : null; }

    ngOnInit() {
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'retry') { this.retry(a.row); } });
        this.load();
    }

    load() {
        this.api.postingSummary().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: s => this.summary = s, error: () => {}});
        this.populateGrid();
    }

    show(status: string | null) { this.coreState.status = status; this.coreState.skip = 0; this.coreState.page = 1; this.populateGrid(); }

    retry(row: PostingJobRow) {
        this.api.retryPosting(row.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.alerts.showMessage('Queued', 'It will be posted again shortly.', MessageSeverity.success); this.load(); },
            error: e => this.alerts.showMessage('Not queued', financeErrorOf(e, 'It could not be retried.'), MessageSeverity.error)
        });
    }

    retryAll() {
        this.api.retryAllPostings().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.alerts.showMessage('Queued', `${r.requeued} will be posted again.`, MessageSeverity.success); this.load(); },
            error: e => this.alerts.showMessage('Not queued', financeErrorOf(e, 'They could not be retried.'), MessageSeverity.error)
        });
    }

    queueDrafts() {
        if (!confirm('Post every unposted draft of this branch in the background?')) { return; }
        this.api.queueUnposted(null).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.alerts.showMessage('Queued', `${r.queued} drafts queued for posting.`, MessageSeverity.success); this.load(); },
            error: e => this.alerts.showMessage('Not queued', financeErrorOf(e, 'Drafts could not be queued.'), MessageSeverity.error)
        });
    }
}

/** Recurring invoices and bills. */
@Component({standalone: false, templateUrl: './templates/recurring.html'})
export class FinanceRecurringView extends ViewExtender<RecurringRow> implements OnInit {
    override coreState = new SimpleQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    form: {row: RecurringRow; model: RecurringInput} | null = null;
    saving = false;
    formError: string | null = null;

    constructor(public override service: RecurringGridService, public override activatedRoute: ActivatedRoute, private api: FinanceApiService,
                private events: FinanceGridEvents, private alerts: AlertService) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Schedule', field: 'name', cellTemplate: RecurringCell},
            {headerName: 'Every', field: 'frequency', cellFn: (r: RecurringRow) => `${r.interval > 1 ? r.interval + ' ' : ''}${{Weekly: 'week', Monthly: 'month', Quarterly: 'quarter', Yearly: 'year'}[r.frequency]}${r.interval > 1 ? 's' : ''}`},
            {headerName: 'Next copy', field: 'nextRunDate', cellTemplate: DateFormatCell},
            {headerName: 'Left', field: 'remainingCount', cellFn: (r: RecurringRow) => r.remainingCount ?? (r.endDate ? `until ${r.endDate}` : 'no end')},
            {headerName: 'Issued', field: 'generated', class: 'text-right'}
        ];
    }

    get errorText() { return this.errorMsg ? financeErrorOf(this.errorMsg, 'Schedules could not be loaded.') : null; }

    ngOnInit() {
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'open') { this.edit(a.row); } });
        this.populateGrid();
    }

    actionCb(row: RecurringRow) { this.edit(row); }

    edit(r: RecurringRow) {
        this.formError = null;
        this.form = {row: r, model: {templateVoucherId: r.templateVoucherId, name: r.name, frequency: r.frequency, interval: r.interval, nextRunDate: r.nextRunDate,
            endDate: r.endDate, remainingCount: r.remainingCount, autoPost: r.autoPost, isPaused: r.isPaused}};
    }

    save() {
        const f = this.form!;
        this.saving = true;
        this.api.saveRecurring(f.row.id, {...f.model, interval: +f.model.interval || 1, remainingCount: f.model.remainingCount ? +f.model.remainingCount : null, endDate: f.model.endDate || null})
            .pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: () => { this.form = null; this.refreshGrid(); },
                error: e => this.formError = financeErrorOf(e, 'The schedule could not be saved.')
            });
    }

    runNow() {
        const f = this.form!;
        this.saving = true;
        this.api.runRecurring(f.row.id).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.form = null; this.alerts.showMessage(r.lastError ? 'Issued with a problem' : 'Issued', r.lastError ?? `Next copy on ${r.nextRunDate}.`, r.lastError ? MessageSeverity.warn : MessageSeverity.success); this.refreshGrid(); },
            error: e => this.formError = financeErrorOf(e, 'It could not be issued.')
        });
    }

    remove() {
        const f = this.form!;
        if (!confirm('Stop and remove this schedule? Documents already issued stay.')) { return; }
        this.api.deleteRecurring(f.row.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.form = null; this.refreshGrid(); },
            error: e => this.formError = financeErrorOf(e, 'The schedule could not be removed.')
        });
    }
}
