import {Component, DestroyRef, OnDestroy, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, Subscription, finalize, interval, map, switchMap} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {AccountOption, ModeOption, PartyOption, TaxOption} from "../../domains/finance.models";
import {FinanceApiService, financeErrorOf} from "../../services/finance-api.service";
import {PickerOption} from "../../views/finance-picker.component";
import {ROUTE_OF_KIND} from "../../views/documents.view";
import {CaptureApiService} from "../capture-api.service";
import {
    CAPTURE_ACCEPT, CAPTURE_PURPOSE_LABEL, CAPTURE_STATUS_LABEL, CAPTURE_STATUS_TONE, Capture, CaptureInput, CaptureProvider, CapturePurpose, CaptureRow,
    CaptureCheck, CaptureTaxCodeOption, CaptureTaxLine, CaptureView, OcrRun, PartyMatch, PartyProposal, RUN_STATUS_TONE, RejectReason, TAX_STATUS_TONE
} from "../capture.models";

/** An editor line: the request plus the account's name for the picker. */
interface EditLine { description: string; quantity: number; unitPrice: number; amount: number; accountId: string | null; accountLabel: string | null; taxCodeId: string | null;
    itemId: string | null; suggestedBy: string | null; code: string | null; unit: string | null; taxRate: number | null; isExempt: boolean; }

/** Document types the readers tell apart. */
export const DOCUMENT_TYPES = ['Invoice', 'Receipt', 'CreditNote', 'DebitNote', 'Proforma', 'Quotation', 'PurchaseOrder', 'BillOfSupply'];

const POLL_MS = 4000;

/**
 * Scan bills & receipts: upload PDFs or photos; each is read (AWS Textract, or typed in), matched to a vendor, given
 * accounts and tax from the vendor's history, and checked for duplicates. Review what was read beside the original and
 * convert it to a bill, a paid expense (bill and payment) or a journal. Deep link `?capture=<id>`.
 */
@Component({standalone: false, templateUrl: './templates/capture-inbox.html'})
export class FinanceCaptureInboxView implements OnInit, OnDestroy {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    accept = CAPTURE_ACCEPT;
    maxFileMb = 50;
    /** Review panel: the editable details, or the readers compared side by side. */
    tab: 'details' | 'compare' | 'result' | 'log' = 'details';
    readonly documentTypes = DOCUMENT_TYPES;
    readonly taxTone = TAX_STATUS_TONE;
    readonly runTone = RUN_STATUS_TONE;
    /** Who the document is from (or to): candidates in the books and a new party prefilled from the document. */
    partyMatch: PartyMatch | null = null;
    newParty: PartyProposal | null = null;
    allowDuplicateParty = false;
    taxOptions: CaptureTaxCodeOption[] = [];
    runs: OcrRun[] | null = null;
    rejectReasons: RejectReason[] = [];
    /** The reject form while open. */
    rejecting: {reason: string | null; note: string} | null = null;
    /** The reviewer has looked at the failed checks (needed to convert with errors). */
    acceptChecks = false;
    /** Details read (addresses, contacts, bank…), cached for the template. */
    details: {label: string; value: string}[] = [];
    readonly purposeLabel = CAPTURE_PURPOSE_LABEL;
    readonly purposes = Object.keys(CAPTURE_PURPOSE_LABEL) as CapturePurpose[];
    readonly statusLabel = CAPTURE_STATUS_LABEL;
    readonly statusTone = CAPTURE_STATUS_TONE;
    readonly views: {key: CaptureView; label: string}[] = [
        {key: 'inbox', label: 'Inbox'}, {key: 'review', label: 'To review'}, {key: 'converted', label: 'Done'}, {key: 'discarded', label: 'Rejected'}, {key: 'all', label: 'All'}
    ];
    view: CaptureView = 'inbox';
    search: string | null = null;
    rows: CaptureRow[] = [];
    page = {skip: 0, take: 25, page: 1, count: 0};
    loading = false;
    error: string | null = null;

    uploadPurpose: CapturePurpose | null = null;
    uploading = false;
    dragging = false;
    providers: CaptureProvider[] = [];
    threshold = 90;
    taxes: TaxOption[] = [];
    modes: ModeOption[] = [];
    moneyAccounts: AccountOption[] = [];
    currency = 'USD';

    /** The capture under review. */
    current: Capture | null = null;
    edit: {model: Omit<CaptureInput, 'lines'>; lines: EditLine[]; partyLabel: string | null} | null = null;
    fileUrl: string | null = null;
    safeFileUrl: SafeResourceUrl | null = null;
    allowDuplicate = false;
    postBill = false;
    reprocessWith = 'auto';
    showText = false;
    busy = false;
    formError: string | null = null;
    converted: {voucherId: string; message: string} | null = null;
    private poll: Subscription | null = null;

    constructor(private api: CaptureApiService, private finance: FinanceApiService, private alerts: AlertService, private router: Router,
                private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

    ngOnInit() {
        this.api.settings().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: s => {
                this.providers = s.providers.filter(p => p.available);
                this.threshold = s.confidenceThreshold;
                this.maxFileMb = s.maxFileMb || 50;
                if (s.extensions?.length) { this.accept = s.extensions.join(','); }
            }, error: () => {}
        });
        this.finance.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: l => { this.taxes = l.taxCodes.filter(t => t.scope !== 'Sales'); this.modes = l.paymentModes; this.moneyAccounts = l.bankAccounts; this.currency = l.functionalCurrency; },
            error: () => {}
        });
        this.api.rejectReasons().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: r => this.rejectReasons = r, error: () => {}});
        this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(q => {
            const id = q.get('capture');
            if (id && id !== this.current?.row.id) { this.open(id); }
        });
        this.load();
    }

    ngOnDestroy() { this.revokeFile(); this.poll?.unsubscribe(); }

    // ---------- List ----------

    load(quiet = false) {
        if (!quiet) { this.loading = true; }
        this.error = null;
        this.api.list(this.view, this.search, this.page.skip, this.page.take).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.rows = r.entities; this.page.count = r.count; this.schedulePoll(); },
            error: e => this.error = financeErrorOf(e, 'The documents could not be loaded.')
        });
    }

    setView(v: CaptureView) { this.view = v; this.page = {...this.page, skip: 0, page: 1}; this.load(); }
    toPage(p: {skip: number; take: number; page?: number}) { this.page = {...this.page, skip: p.skip, take: p.take, page: p.page ?? Math.floor(p.skip / p.take) + 1}; this.load(); }

    get reading() { return this.rows.some(r => r.status === 'Queued' || r.status === 'Processing'); }

    /** While documents are being read, refresh the list (and the open one) until they are ready. */
    private schedulePoll() {
        const waiting = this.reading || this.current?.row.status === 'Queued' || this.current?.row.status === 'Processing';
        if (!waiting) { this.poll?.unsubscribe(); this.poll = null; return; }
        if (this.poll) { return; }
        this.poll = interval(POLL_MS).pipe(switchMap(() => this.api.list(this.view, this.search, this.page.skip, this.page.take)), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => {
                this.rows = r.entities;
                this.page.count = r.count;
                const c = this.current;
                const fresh = c ? r.entities.find(x => x.id === c.row.id) : null;
                if (c && fresh && fresh.status !== c.row.status) { this.open(c.row.id, true); }
                if (!this.reading && !(c && (c.row.status === 'Queued' || c.row.status === 'Processing'))) { this.poll?.unsubscribe(); this.poll = null; }
            },
            error: () => { this.poll?.unsubscribe(); this.poll = null; }
        });
    }

    confidenceClass(c: number | null) { return c === null ? '' : c >= this.threshold ? 'text-success' : c >= this.threshold - 20 ? 'text-warning' : 'text-danger'; }

    // ---------- Upload ----------

    pick(input: HTMLInputElement) {
        const files = Array.from(input.files ?? []);
        input.value = '';
        this.upload(files);
    }

    drop(e: DragEvent) {
        e.preventDefault();
        this.dragging = false;
        this.upload(Array.from(e.dataTransfer?.files ?? []));
    }

    upload(files: File[]) {
        if (!files.length) { return; }
        if (files.length > 20) { this.alerts.showMessage('Upload', 'Upload up to 20 files at a time.', MessageSeverity.warn); return; }
        const big = files.find(f => f.size > this.maxFileMb * 1024 * 1024);
        if (big) { this.alerts.showMessage('Upload', `${big.name} is larger than ${this.maxFileMb} MB.`, MessageSeverity.warn); return; }
        this.uploading = true;
        this.api.upload(files, this.uploadPurpose).pipe(finalize(() => this.uploading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => {
                const n = r.items.length;
                if (n) { this.alerts.showMessage('Upload', `${n} document${n === 1 ? '' : 's'} uploaded; reading them now.`, MessageSeverity.success); }
                r.problems.forEach(p => this.alerts.showMessage('Upload', p, MessageSeverity.warn));
                this.view = 'inbox';
                this.load();
            },
            error: e => this.alerts.showMessage('Upload', financeErrorOf(e, 'The files could not be uploaded.'), MessageSeverity.error)
        });
    }

    // ---------- Review ----------

    open(id: string, keepEdits = false) {
        this.formError = null;
        this.busy = true;
        this.api.capture(id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: c => {
                const sameFile = this.current?.row.id === c.row.id;
                this.current = c;
                if (!keepEdits || !this.edit || c.row.status !== 'Review') { this.fill(c); }
                if (!sameFile) {
                    this.converted = null; this.allowDuplicate = false; this.showText = false; this.tab = 'details'; this.runs = null; this.newParty = null;
                    this.rejecting = null; this.acceptChecks = false;
                    this.loadFile(c.row.id);
                }
                this.loadBooks(c);
                this.schedulePoll();
            },
            error: e => this.alerts.showMessage('Capture', financeErrorOf(e, 'The document could not be opened.'), MessageSeverity.error)
        });
    }

    private fill(c: Capture) {
        const r = c.row;
        this.details = Object.entries(c.details ?? {}).map(([label, value]) => ({label, value}));
        this.reprocessWith = r.provider;
        this.postBill = false;
        this.edit = {
            partyLabel: r.party,
            model: {
                purpose: r.purpose, vendorName: r.vendorName, vendorTaxId: c.vendorTaxId, documentNumber: r.documentNumber, documentDate: r.documentDate, dueDate: c.dueDate,
                currencyCode: r.currencyCode ?? this.currency, currencyRate: c.currencyRate, subTotal: c.subTotal, taxAmount: c.taxAmount, total: r.total,
                partyAccountId: c.partyAccountId, moneyAccountId: c.moneyAccountId, paymentModeId: c.paymentModeId, notes: c.notes,
                buyerName: c.buyerName, buyerTaxId: c.buyerTaxId, documentType: c.documentType, placeOfSupply: c.placeOfSupply, poNumber: c.poNumber,
                paymentTerms: c.paymentTerms
            },
            lines: c.lines.map(l => ({description: l.description, quantity: l.quantity, unitPrice: l.unitPrice, amount: l.amount, accountId: l.accountId,
                accountLabel: l.account, taxCodeId: l.taxCodeId, itemId: l.itemId, suggestedBy: l.suggestedBy, code: l.code, unit: l.unit, taxRate: l.taxRate,
                isExempt: l.isExempt}))
        };
    }

    private loadFile(id: string) {
        this.revokeFile();
        this.api.fileUrl(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: url => { this.fileUrl = url; this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url); },
            error: () => {}
        });
    }

    private revokeFile() {
        if (this.fileUrl) { URL.revokeObjectURL(this.fileUrl); }
        this.fileUrl = null;
        this.safeFileUrl = null;
    }

    get isPdf() { return (this.current?.row.fileName ?? '').toLowerCase().endsWith('.pdf'); }
    get isImage() { return /\.(png|jpe?g|gif|webp|bmp)$/i.test(this.current?.row.fileName ?? ''); }
    get editable() { const s = this.current?.row.status; return s === 'Review' || s === 'Failed'; }
    get linesTotal() { return (this.edit?.lines ?? []).reduce((t, l) => t + (+l.amount || 0), 0); }
    get computedTotal() { return Math.round((this.linesTotal + (+(this.edit?.model.taxAmount ?? 0) || 0)) * 100) / 100; }
    get totalGap() {
        const t = this.edit?.model.total;
        return t === null || t === undefined || (t as any) === '' ? 0 : Math.round((+t - this.computedTotal) * 100) / 100;
    }

    close() {
        this.current = null;
        this.edit = null;
        this.converted = null;
        this.revokeFile();
        this.router.navigate([], {relativeTo: this.route, queryParams: {capture: null}, queryParamsHandling: 'merge', replaceUrl: true});
    }

    openRow(r: CaptureRow) { this.router.navigate([], {relativeTo: this.route, queryParams: {capture: r.id}, queryParamsHandling: 'merge'}); }

    /** Vendors, or customers when the document is our own sales invoice. */
    searchVendors = (term: string | null): Observable<PickerOption[]> =>
        this.finance.parties(this.edit?.model.purpose === 'SalesInvoice' ? 'Invoice' : 'Bill', term)
            .pipe(map((list: PartyOption[]) => list.map(p => ({id: p.accountId, label: p.name, sub: p.number}))));

    get partyWord() { return this.edit?.model.purpose === 'SalesInvoice' ? 'customer' : 'vendor'; }

    // ---------- Parties, taxes and the log ----------

    /** Party candidates and the tax codes for this document (only while it can be changed). */
    private loadBooks(c: Capture) {
        if (c.row.status !== 'Review' && c.row.status !== 'Failed') { this.partyMatch = null; this.taxOptions = []; return; }
        this.api.parties(c.row.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: m => this.partyMatch = m, error: () => this.partyMatch = null});
        this.api.taxCodes(c.row.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: o => this.taxOptions = o, error: () => this.taxOptions = []});
    }

    /** The document as the server now has it (after linking, adding a party or changing taxes). */
    private applied(c: Capture, message: string) {
        this.current = c;
        this.fill(c);
        this.loadBooks(c);
        this.load(true);
        this.alerts.showMessage('Capture', message, MessageSeverity.success);
    }

    linkParty(accountId: string) {
        const c = this.current;
        if (!c) { return; }
        this.busy = true;
        this.api.linkParty(c.row.id, accountId).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => this.applied(r, `The ${this.partyWord} is linked.`),
            error: e => this.formError = financeErrorOf(e, 'It could not be linked.')
        });
    }

    /** Opens the form with the party as the document describes it. */
    startNewParty() {
        const p = this.partyMatch?.proposal;
        if (!p) { return; }
        this.allowDuplicateParty = false;
        this.newParty = {...p, addresses: p.addresses.length ? p.addresses.map(a => ({...a}))
                : [{line1: '', line2: null, city: '', region: null, postalCode: null, countryCode: p.countryCode, isPrimary: true}],
            taxIds: p.taxIds.map(t => ({...t}))};
    }

    saveNewParty() {
        const c = this.current;
        const p = this.newParty;
        if (!c || !p) { return; }
        if (!(p.displayName ?? '').trim()) { this.formError = `Enter the ${this.partyWord}'s name.`; return; }
        const body: PartyProposal = {
            ...p, displayName: p.displayName.trim(), countryCode: (p.countryCode ?? '').trim().toUpperCase(),
            addresses: p.addresses.filter(a => (a.line1 ?? '').trim() && (a.city ?? '').trim()),
            taxIds: p.taxIds.filter(t => (t.value ?? '').trim())
        };
        this.busy = true;
        this.formError = null;
        this.api.createParty(c.row.id, body, this.allowDuplicateParty).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.newParty = null; this.applied(r, `${body.displayName} added as a ${this.partyWord} and linked.`); },
            error: e => this.formError = financeErrorOf(e, `The ${this.partyWord} could not be added.`)
        });
    }

    setTaxCode(t: CaptureTaxLine, taxCodeId: string | null) {
        const c = this.current;
        if (!c) { return; }
        this.busy = true;
        this.api.setTaxCodes(c.row.id, [{id: t.id, taxCodeId}]).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => this.applied(r, 'Tax code changed; the lines follow it.'),
            error: e => this.formError = financeErrorOf(e, 'The tax code could not be changed.')
        });
    }

    remapTaxes() {
        const c = this.current;
        if (!c) { return; }
        this.busy = true;
        this.api.remapTaxes(c.row.id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => this.applied(r, 'Taxes mapped again.'),
            error: e => this.formError = financeErrorOf(e, 'The taxes could not be mapped.')
        });
    }

    showLog() {
        this.tab = 'log';
        const c = this.current;
        if (!c) { return; }
        this.api.documentLog(c.row.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.runs = l.entities, error: () => this.runs = []});
    }

    /** Line tax codes: the document's side (purchase or sales) once loaded, else the purchase codes. */
    get lineTaxOptions(): {id: string; code: string}[] { return this.taxOptions.length ? this.taxOptions : this.taxes; }

    taxOptionLabel(o: CaptureTaxCodeOption) { return `${o.code} · ${o.components || o.name}`; }
    trackTax = (_: number, t: CaptureTaxLine) => t.id;
    trackRun = (_: number, r: OcrRun) => r.id;

    searchAccounts = (term: string | null): Observable<PickerOption[]> =>
        this.finance.accountOptions('expense', term).pipe(map((list: AccountOption[]) => list.map(a => ({id: a.id, label: a.name, sub: [a.code, a.group].filter(Boolean).join(' · ')}))));

    addLine() {
        this.edit?.lines.push({description: '', quantity: 1, unitPrice: 0, amount: 0, accountId: null, accountLabel: null, taxCodeId: null, itemId: null, suggestedBy: null,
            code: null, unit: null, taxRate: null, isExempt: false});
    }
    removeLine(i: number) { this.edit?.lines.splice(i, 1); }
    recalc(l: EditLine) { l.amount = Math.round((+l.quantity || 0) * (+l.unitPrice || 0) * 100) / 100; }

    /** One line for the whole amount before tax, when the line items are not worth keeping. */
    collapseLines() {
        const e = this.edit;
        if (!e) { return; }
        const net = e.model.subTotal ?? ((e.model.total ?? 0) - (e.model.taxAmount ?? 0));
        const first = e.lines[0];
        e.lines = [{description: e.model.vendorName ? `Purchase from ${e.model.vendorName}` : 'Purchase', quantity: 1, unitPrice: +net, amount: +net,
            accountId: first?.accountId ?? null, accountLabel: first?.accountLabel ?? null, taxCodeId: first?.taxCodeId ?? null, itemId: null, suggestedBy: null,
            code: null, unit: null, taxRate: null, isExempt: false}];
    }

    private body(): CaptureInput {
        const e = this.edit!;
        const num = (v: any) => v === null || v === '' || v === undefined ? null : +v;
        return {
            ...e.model, subTotal: num(e.model.subTotal), taxAmount: num(e.model.taxAmount), total: num(e.model.total), currencyRate: num(e.model.currencyRate),
            currencyCode: (e.model.currencyCode ?? '').trim().toUpperCase() || null,
            lines: e.lines.filter(l => (l.description ?? '').trim() || +l.amount).map(l => ({
                description: (l.description ?? '').trim() || 'Line', quantity: +l.quantity || 1, unitPrice: +l.unitPrice || 0, amount: +l.amount || 0,
                accountId: l.accountId, taxCodeId: l.taxCodeId, itemId: l.itemId, code: (l.code ?? '').trim() || null, unit: l.unit, taxRate: l.taxRate, isExempt: l.isExempt
            }))
        };
    }

    save(then?: () => void) {
        const c = this.current;
        if (!c || !this.edit) { return; }
        this.formError = null;
        this.busy = true;
        this.api.update(c.row.id, this.body()).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.current = r; this.fill(r); this.load(true); if (then) { then(); } else { this.alerts.showMessage('Capture', 'Saved.', MessageSeverity.success); } },
            error: e => this.formError = financeErrorOf(e, 'The changes could not be saved.')
        });
    }

    convert() {
        this.save(() => {
            const c = this.current;
            if (!c) { return; }
            if (c.problems.length) { this.formError = c.problems.join(' '); return; }
            this.busy = true;
            if (this.checkErrors.length && !this.acceptChecks) { this.formError = 'Check the differences listed below against the original, then tick that you have.'; return; }
            this.api.convert(c.row.id, this.allowDuplicate, this.postBill, this.acceptChecks).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: r => {
                    this.current = r.capture;
                    this.converted = {voucherId: r.voucherId, message: r.message};
                    this.alerts.showMessage('Capture', r.message, MessageSeverity.success);
                    this.load(true);
                },
                error: e => this.formError = financeErrorOf(e, 'The document could not be converted.')
            });
        });
    }

    // ---------- Reject ----------

    startReject() { this.rejecting = {reason: null, note: ''}; this.formError = null; }

    get rejectNeedsNote() { return this.rejectReasons.find(r => r.code === this.rejecting?.reason)?.needsNote ?? false; }

    reject() {
        const c = this.current;
        const r = this.rejecting;
        if (!c || !r) { return; }
        if (!r.reason) { this.formError = 'Choose why the document is rejected.'; return; }
        if (this.rejectNeedsNote && !r.note.trim()) { this.formError = 'Say why the document is rejected.'; return; }
        this.busy = true;
        this.api.reject(c.row.id, r.reason, r.note.trim() || null).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { this.rejecting = null; this.current = d; this.fill(d); this.load(true); this.alerts.showMessage('Capture', `Rejected: ${d.rejectReasonLabel}.`, MessageSeverity.success); },
            error: e => this.formError = financeErrorOf(e, 'The document could not be rejected.')
        });
    }

    reopen() {
        const c = this.current;
        if (!c) { return; }
        this.busy = true;
        this.api.reopen(c.row.id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { this.current = d; this.fill(d); this.loadBooks(d); this.load(true); },
            error: e => this.formError = financeErrorOf(e, 'The document could not be reopened.')
        });
    }

    rejectLabel(code: string | null) { return this.rejectReasons.find(r => r.code === code)?.label ?? code ?? ''; }

    // ---------- Checks ----------

    get checkErrors(): CaptureCheck[] { return this.current?.checks.filter(x => x.severity === 'error') ?? []; }

    /** The worst check on a field, for highlighting its input. */
    fieldCheck(field: string): 'error' | 'warning' | null {
        const checks = this.current?.checks.filter(x => x.field === field) ?? [];
        return checks.some(x => x.severity === 'error') ? 'error' : checks.length ? 'warning' : null;
    }

    reprocess() {
        const c = this.current;
        if (!c) { return; }
        if (c.row.status === 'Review' && !confirm('Read the document again? Changes made here are replaced by what is read.')) { return; }
        this.busy = true;
        this.api.reprocess(c.row.id, this.reprocessWith).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.current = r; this.fill(r); this.load(true); },
            error: e => this.formError = financeErrorOf(e, 'The document could not be read again.')
        });
    }

    /** Values copied from the compared readings: the document as it now is. */
    onApplied(c: Capture) {
        this.current = c;
        this.fill(c);
        this.load(true);
    }

    providerLabel(code: string) { return this.providers.find(p => p.code === code)?.label ?? code; }

    /** Opens the bill, payment or journal made from the document. */
    openDocument(id: string) {
        this.finance.document(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => this.router.navigate(ROUTE_OF_KIND[d.kind].split('/'), {relativeTo: this.route.parent, queryParams: {doc: d.id}}),
            error: e => this.alerts.showMessage('Capture', financeErrorOf(e, 'The document could not be opened.'), MessageSeverity.error)
        });
    }

    openDuplicate() {
        const c = this.current;
        if (c?.duplicateOfVoucherId) { this.openDocument(c.duplicateOfVoucherId); }
        else if (c?.duplicateOfCaptureId) { this.router.navigate([], {relativeTo: this.route, queryParams: {capture: c.duplicateOfCaptureId}, queryParamsHandling: 'merge'}); }
    }
}
