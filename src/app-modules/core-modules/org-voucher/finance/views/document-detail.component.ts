import {Component, DestroyRef, EventEmitter, Input, OnChanges, Output, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {FinanceActionRes, FinanceDoc, FinanceLookups, Frequency, KINDS, KindInfo, todayIso} from "../domains/finance.models";
import {FinanceApiService, financeErrorOf} from "../services/finance-api.service";
import {formatMoney} from "../grid-cells/finance-cells";

type Panel = 'pay' | 'void' | 'send' | 'repeat' | 'approve' | null;

/**
 * One document: what it says, what paid it, its ledger entries, and the actions its state allows (post, approve,
 * record a payment, email, print, duplicate, repeat, void, delete).
 */
@Component({
    selector: 'fin-document-detail',
    standalone: false,
    templateUrl: './templates/document-detail.html'
})
export class FinanceDocumentDetailComponent implements OnChanges {
    @Input({required: true}) doc!: FinanceDoc;
    @Output() changed = new EventEmitter<FinanceDoc>();
    @Output() edit = new EventEmitter<FinanceDoc>();
    @Output() deleted = new EventEmitter<void>();
    @Output() openDoc = new EventEmitter<string>();

    private readonly destroyRef = inject(DestroyRef);
    info!: KindInfo;
    lookups: FinanceLookups | null = null;
    panel: Panel = null;
    busy = false;
    error: string | null = null;
    showJournal = false;

    pay = {date: todayIso(), amount: 0, paymentModeId: null as number | null, bankAccountId: null as string | null, reference: null as string | null};
    voidForm = {reason: '', date: null as string | null};
    send = {to: '' as string | null, subject: null as string | null, message: null as string | null};
    repeat = {name: '', frequency: 'Monthly' as Frequency, interval: 1, nextRunDate: todayIso(), endDate: null as string | null, remainingCount: null as number | null, autoPost: false};
    approvalNote = '';

    constructor(private api: FinanceApiService, private alerts: AlertService) {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.lookups = l, error: () => {}});
    }

    ngOnChanges() {
        this.info = KINDS[this.doc.kind];
        this.panel = null;
        this.error = null;
    }

    get settleable() { return this.doc.kind === 'Invoice' || this.doc.kind === 'Bill'; }
    get canPay() { return this.settleable && ['open', 'overdue', 'partially_paid'].includes(this.doc.status); }
    get canRepeat() { return this.settleable && this.doc.status !== 'void'; }
    get partyLabel() { return this.info.party === 'customer' ? 'Customer' : this.info.party === 'vendor' ? 'Vendor' : this.doc.kind === 'Contra' ? 'From' : ''; }

    open(panel: Panel) {
        this.error = null;
        this.panel = this.panel === panel ? null : panel;
        if (panel === 'pay') {
            this.pay = {date: todayIso(), amount: this.doc.balance, reference: null, bankAccountId: null,
                paymentModeId: this.lookups?.paymentModes.find(m => m.code === 'ach' || m.code === 'wire')?.id ?? this.lookups?.paymentModes[0]?.id ?? null};
        }
        if (panel === 'send') { this.send = {to: this.doc.partyEmail, subject: null, message: null}; }
        if (panel === 'repeat') { this.repeat = {...this.repeat, name: `${this.doc.partyName} — ${this.info.label.toLowerCase()}`, nextRunDate: todayIso()}; }
    }

    // ---------- Actions ----------

    post() { this.act(this.api.post(this.doc.id)); }
    approve(approved: boolean) { this.act(this.api.approve(this.doc.id, approved, this.approvalNote || null)); }
    recordPayment() {
        if (!(this.pay.amount > 0) || !this.pay.paymentModeId) { this.error = 'Enter the amount and how it was paid.'; return; }
        this.act(this.api.recordPayment(this.doc.id, {date: this.pay.date, amount: +this.pay.amount, paymentModeId: this.pay.paymentModeId, bankAccountId: this.pay.bankAccountId, reference: this.pay.reference}));
    }
    doVoid() {
        if ((this.voidForm.reason || '').trim().length < 3) { this.error = 'Give a reason for voiding.'; return; }
        this.act(this.api.void(this.doc.id, this.voidForm.reason.trim(), this.voidForm.date || null));
    }
    doSend() { this.act(this.api.sendDocument(this.doc.id, {to: this.send.to || null, subject: this.send.subject, message: this.send.message})); }

    duplicate() {
        this.busy = true;
        this.api.duplicate(this.doc.id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { this.alerts.showMessage('Duplicated', 'A new draft was created.', MessageSeverity.success); this.changed.emit(d); },
            error: e => this.error = financeErrorOf(e, 'It could not be duplicated.')
        });
    }

    saveRepeat() {
        this.busy = true;
        this.api.saveRecurring(null, {templateVoucherId: this.doc.id, name: this.repeat.name, frequency: this.repeat.frequency, interval: +this.repeat.interval || 1,
            nextRunDate: this.repeat.nextRunDate, endDate: this.repeat.endDate || null, remainingCount: this.repeat.remainingCount || null, autoPost: this.repeat.autoPost, isPaused: false})
            .pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: r => { this.panel = null; this.alerts.showMessage('Scheduled', `Next copy on ${r.nextRunDate}.`, MessageSeverity.success); },
                error: e => this.error = financeErrorOf(e, 'The schedule could not be saved.')
            });
    }

    deleteDraft() {
        if (!confirm('Delete this draft?')) { return; }
        this.busy = true;
        this.api.deleteDraft(this.doc.id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.deleted.emit(),
            error: e => this.error = financeErrorOf(e, 'The draft could not be deleted.')
        });
    }

    private act(call: Observable<FinanceActionRes>) {
        this.busy = true;
        this.error = null;
        call.pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.panel = null; this.alerts.showMessage('Done', r.message, MessageSeverity.success); this.changed.emit(r.document); },
            error: e => this.error = financeErrorOf(e, 'That did not work.')
        });
    }

    // ---------- Print ----------

    /** Opens a print-ready copy (save as PDF from the browser's print dialog). */
    print() {
        const d = this.doc;
        const e = (s: any) => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]!));
        const m = (v: number) => e(formatMoney(v, d.currencyCode));
        const lines = d.lines.length
            ? `<table class="lines"><tr><th>Description</th><th class="r">Qty</th><th class="r">Price</th><th class="r">Disc</th><th class="r">Tax</th><th class="r">Amount</th></tr>${
                d.lines.map(l => `<tr><td>${e(l.description)}</td><td class="r">${l.quantity}</td><td class="r">${m(l.unitPrice)}</td><td class="r">${l.discountRate ? l.discountRate + '%' : ''}</td><td class="r">${e(l.taxCode ?? '')}</td><td class="r">${m(l.lineTotal ?? 0)}</td></tr>`).join('')}</table>
               <table class="totals"><tr><td>Subtotal</td><td class="r">${m(d.subTotal)}</td></tr>${d.taxes.filter(t => t.tax !== 0 || t.kind !== 'Standard').map(t => `<tr><td>${e(t.component)} ${t.rate}%${t.jurisdiction ? ' (' + e(t.jurisdiction) + ')' : ''}${t.kind === 'ReverseCharge' ? ' — reverse charge' : t.kind === 'Exempt' ? ' — exempt' : t.kind === 'ZeroRated' ? ' — zero-rated' : ''}</td><td class="r">${t.kind === 'Withholding' ? '−' : ''}${m(t.tax)}</td></tr>`).join('')}${
                d.adjustment ? `<tr><td>Adjustment</td><td class="r">${m(d.adjustment)}</td></tr>` : ''}<tr class="b"><td>Total</td><td class="r">${m(d.total)}</td></tr>${
                d.settled ? `<tr><td>Paid</td><td class="r">${m(d.settled)}</td></tr><tr class="b"><td>Balance due</td><td class="r">${m(d.balance)}</td></tr>` : ''}</table>`
            : `<table class="lines"><tr><th>Account</th><th class="r">Debit</th><th class="r">Credit</th></tr>${
                (d.journal.length ? d.journal : d.ledgerLines).map(l => `<tr><td>${e(l.accountName)}<div class="s">${e(l.description)}</div></td><td class="r">${l.debit ? m(l.debit) : ''}</td><td class="r">${l.credit ? m(l.credit) : ''}</td></tr>`).join('')}</table>
               <p><b>Amount ${m(d.total)}</b>${d.paymentMode ? ' · ' + e(d.paymentMode) : ''}</p>${d.allocations.map(a => `<div>Applied to ${e(a.number)}: ${m(a.amount)}</div>`).join('')}`;
        const html = `<!doctype html><html><head><meta charset="utf-8"><title>${e(this.info.label)} ${e(d.number)}</title><style>
            body{font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#222;margin:32px}h1{font-size:22px;margin:0}.muted{color:#666}.s{color:#888;font-size:11px}
            .head{display:flex;justify-content:space-between;margin-bottom:24px}.lines{width:100%;border-collapse:collapse;margin-top:16px}
            .lines th{background:#f3f4f6;text-align:left;padding:6px;border-bottom:1px solid #ddd}.lines td{padding:6px;border-bottom:1px solid #eee;vertical-align:top}
            .r{text-align:right}.totals{margin-left:auto;margin-top:8px}.totals td{padding:3px 8px}.b td{font-weight:bold}.void{color:#c00;font-size:18px;font-weight:bold}
            @media print{body{margin:12mm}}</style></head><body>
            <div class="head"><div><h1>${e(this.info.label)} ${e(d.number)}</h1>${d.status === 'void' ? '<div class="void">VOID</div>' : ''}
              <div class="muted">Date ${e(d.date)}${d.dueDate ? ' · Due ' + e(d.dueDate) : ''}${d.reference ? ' · Ref ' + e(d.reference) : ''}</div></div>
              <div class="r"><b>${e(d.partyName)}</b><div class="muted">${e(d.partyAddress ?? '')}</div><div class="muted">${e(d.partyEmail ?? '')}</div></div></div>
            ${lines}
            ${d.notes ? `<p style="white-space:pre-wrap">${e(d.notes)}</p>` : ''}
            ${d.paymentInstructions ? `<p style="white-space:pre-wrap"><b>How to pay</b><br>${e(d.paymentInstructions)}</p>` : ''}
            ${d.footer ? `<p class="muted" style="white-space:pre-wrap;font-size:11px">${e(d.footer)}</p>` : ''}
            <script>window.onload=function(){window.print();}</script></body></html>`;
        const w = window.open('', '_blank', 'noopener=no');
        if (!w) { this.error = 'Allow pop-ups to print.'; return; }
        w.document.open();
        w.document.write(html);
        w.document.close();
    }
}
