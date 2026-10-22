import {Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {ExpenseApiService, expenseErrorOf} from "../expense-api.service";
import {Claim, ClaimInput, EmployeeOption, ExpenseCategory, ExpenseLookups, FLAG_LABEL, LineInput, PAID_BY_LABEL, PaidBy, todayIso} from "../expense.models";

/** An editor row: the request plus what the screen shows (receipt name, policy flags from the last save). */
interface EditLine extends LineInput { receiptName: string | null; uploading: boolean; flags: string[]; showMore: boolean; }

/**
 * Create or change a claim (draft or returned): title, purpose, cost centre and the expenses — date, category,
 * merchant, amount (or distance / days for mileage and per diem), tax, who paid, receipt. Policy exceptions from the
 * last save are shown on each line with a place to explain them. "Save and submit" sends it for approval.
 */
@Component({selector: 'expense-claim-editor', standalone: false, templateUrl: './templates/claim-editor.html'})
export class ExpenseClaimEditorComponent implements OnInit {
    @Input() claim: Claim | null = null;
    @Input({required: true}) lookups!: ExpenseLookups;
    @Output() closed = new EventEmitter<void>();
    @Output() saved = new EventEmitter<Claim>();

    private readonly destroyRef = inject(DestroyRef);
    readonly paidByLabel = PAID_BY_LABEL;
    readonly paidBy = Object.keys(PAID_BY_LABEL) as PaidBy[];
    readonly flagLabel = FLAG_LABEL;
    readonly today = todayIso();

    model!: Omit<ClaimInput, 'lines'>;
    lines: EditLine[] = [];
    employees: EmployeeOption[] = [];
    employeeName = '';
    busy = false;
    error: string | null = null;

    constructor(private api: ExpenseApiService, private alerts: AlertService) {}

    get currency() { return (this.model.currencyCode || this.lookups.branchCurrency).toUpperCase(); }
    get categories() { return this.lookups.categories; }
    category(id: string | null): ExpenseCategory | undefined { return this.lookups.categories.find(c => c.id === id); }

    ngOnInit() {
        const c = this.claim;
        this.model = {
            employeePartyId: c?.employeePartyId ?? null, title: c?.title ?? '', purpose: c?.purpose ?? null, costCenter: c?.costCenter ?? null,
            currencyCode: c?.currencyCode ?? this.lookups.branchCurrency, currencyRate: c && c.currencyRate !== 1 ? c.currencyRate : null, fileIds: []
        };
        this.employeeName = c?.employeeName ?? this.lookups.me?.name ?? '';
        this.lines = c ? c.lines.map(l => ({
            id: l.id, date: l.date, categoryId: l.categoryId, merchant: l.merchant, description: l.description, paidBy: l.paidBy, quantity: l.quantity, rate: l.rate,
            currency: l.originalCurrency, amount: l.originalAmount, exchangeRate: l.exchangeRate !== 1 ? l.exchangeRate : null, taxCodeId: l.taxCodeId,
            isBillable: l.isBillable, billableCustomerAccountId: l.billableCustomerAccountId, attendees: l.attendees, receiptFileId: l.receiptFileId,
            noReceiptReason: l.noReceiptReason, justification: l.justification, receiptName: l.receiptFileName, uploading: false, flags: l.flags,
            showMore: l.flags.length > 0 || !!l.attendees || !!l.noReceiptReason || !!l.justification
        })) : [this.blank()];
        if (!c && this.lookups.canCreateForOthers) {
            this.api.employees(null).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: e => this.employees = e, error: () => {}});
        }
    }

    private blank(): EditLine {
        const last = this.lines[this.lines.length - 1];
        return {
            id: null, date: last?.date ?? this.today, categoryId: null, merchant: null, description: '', paidBy: last?.paidBy ?? 'Employee', quantity: null, rate: null,
            currency: null, amount: 0, exchangeRate: null, taxCodeId: null, isBillable: false, billableCustomerAccountId: null, attendees: null, receiptFileId: null,
            noReceiptReason: null, justification: null, receiptName: null, uploading: false, flags: [], showMore: false
        };
    }

    addLine() { this.lines.push(this.blank()); }
    removeLine(i: number) { this.lines.splice(i, 1); }

    categoryChanged(l: EditLine) {
        const c = this.category(l.categoryId);
        if (!c) { return; }
        if (c.kind !== 'Standard') { l.taxCodeId = null; l.rate = null; }
        else if (!l.taxCodeId && c.defaultTaxCodeId) { l.taxCodeId = c.defaultTaxCodeId; }
        if (!l.description) { l.description = c.name; }
        if (c.requiresAttendees) { l.showMore = true; }
    }

    /** The amount shown for mileage and per diem: quantity × rate. */
    computed(l: EditLine) {
        const c = this.category(l.categoryId);
        const rate = +(l.rate ?? c?.rate ?? 0);
        return Math.round((+(l.quantity ?? 0)) * rate * 100) / 100;
    }

    lineAmount(l: EditLine) {
        const c = this.category(l.categoryId);
        if (c && c.kind !== 'Standard') { return this.computed(l); }
        const rate = l.currency && l.currency.toUpperCase() !== this.currency ? +(l.exchangeRate ?? 0) : 1;
        return Math.round((+l.amount || 0) * rate * 100) / 100;
    }

    get total() { return this.lines.reduce((t, l) => t + this.lineAmount(l), 0); }
    get reimbursable() { return this.lines.filter(l => l.paidBy === 'Employee').reduce((t, l) => t + this.lineAmount(l), 0); }

    upload(l: EditLine, input: HTMLInputElement) {
        const file = input.files?.[0];
        input.value = '';
        if (!file) { return; }
        if (file.size > 10 * 1024 * 1024) { this.alerts.showMessage('Receipt', 'The file is larger than 10 MB.', MessageSeverity.warn); return; }
        l.uploading = true;
        this.api.upload(file).pipe(finalize(() => l.uploading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: f => { l.receiptFileId = f.id; l.receiptName = f.fileName; l.flags = l.flags.filter(x => x !== 'receipt_missing'); },
            error: e => this.alerts.showMessage('Receipt', expenseErrorOf(e, 'The receipt could not be uploaded.'), MessageSeverity.error)
        });
    }

    removeReceipt(l: EditLine) { l.receiptFileId = null; l.receiptName = null; }

    private body(): ClaimInput | null {
        const m = this.model;
        if (!(m.title ?? '').trim()) { this.error = 'Give the claim a title (e.g. "Client visit, Pune").'; return null; }
        const lines = this.lines.filter(l => l.categoryId || l.description || +l.amount || +(l.quantity ?? 0));
        for (const [i, l] of lines.entries()) {
            const c = this.category(l.categoryId);
            if (!c) { this.error = `Line ${i + 1}: choose a category.`; return null; }
            if (!(l.description ?? '').trim()) { this.error = `Line ${i + 1}: describe the expense.`; return null; }
            if (c.kind === 'Standard' && !(+l.amount > 0)) { this.error = `Line ${i + 1}: enter the amount.`; return null; }
            if (c.kind !== 'Standard' && !(+(l.quantity ?? 0) > 0)) { this.error = `Line ${i + 1}: enter the ${c.kind === 'Mileage' ? 'distance' : 'number of days'}.`; return null; }
        }
        const num = (v: any) => v === null || v === '' || v === undefined ? null : +v;
        return {
            ...m, title: m.title.trim(), currencyCode: (m.currencyCode ?? '').trim().toUpperCase() || null, currencyRate: num(m.currencyRate),
            lines: lines.map(l => ({
                id: l.id, date: l.date, categoryId: l.categoryId, merchant: l.merchant, description: l.description.trim(), paidBy: l.paidBy, quantity: num(l.quantity),
                rate: num(l.rate), currency: (l.currency ?? '').trim().toUpperCase() || null, amount: +l.amount || 0, exchangeRate: num(l.exchangeRate), taxCodeId: l.taxCodeId,
                isBillable: l.isBillable, billableCustomerAccountId: l.billableCustomerAccountId, attendees: l.attendees, receiptFileId: l.receiptFileId,
                noReceiptReason: l.noReceiptReason, justification: l.justification
            }))
        };
    }

    save(submit: boolean) {
        this.error = null;
        const body = this.body();
        if (!body) { return; }
        if (submit && !body.lines.length) { this.error = 'Add at least one expense.'; return; }
        this.busy = true;
        this.api.save(this.claim?.id ?? null, body).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: c => {
                this.claim = c;
                // Show the policy checks the server ran.
                c.lines.forEach((r, i) => { const l = this.lines.filter(x => x.categoryId || x.description)[i]; if (l) { l.id = r.id; l.flags = r.flags; if (r.flags.length) { l.showMore = true; } } });
                if (!submit) { this.busy = false; this.alerts.showMessage('Expenses', `${c.number} saved.`, MessageSeverity.success); this.saved.emit(c); return; }
                this.api.submit(c.id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                    next: r => { this.alerts.showMessage('Expenses', r.message, MessageSeverity.success); this.saved.emit(r.claim); },
                    // Saved but not submitted (e.g. exceptions to explain): stay in the editor with the flags shown.
                    error: e => this.error = expenseErrorOf(e, 'The claim was saved but could not be submitted.')
                });
            },
            error: e => { this.busy = false; this.error = expenseErrorOf(e, 'The claim could not be saved.'); }
        });
    }
}
