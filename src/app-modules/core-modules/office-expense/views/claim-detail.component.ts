import {Component, DestroyRef, EventEmitter, Input, OnChanges, Output, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {ClaimAction, ExpenseApiService, expenseErrorOf} from "../expense-api.service";
import {Claim, ExpenseLine, ExpenseLookups, FLAG_LABEL, LineDecision, PAID_BY_LABEL, STATUS_LABEL, STATUS_TONE, todayIso} from "../expense.models";

type Panel = 'review' | 'return' | 'cancel' | 'reimburse' | null;

/**
 * One claim: its expenses with receipts and policy flags, totals, approvals, payments and timeline, and what the
 * caller may do now — edit and submit (employee), approve (manager), post (finance, optionally leaving expenses out or
 * moving them to another account), return, cancel, reimburse (from the bank or against an advance), comment.
 */
@Component({selector: 'expense-claim-detail', standalone: false, templateUrl: './templates/claim-detail.html'})
export class ExpenseClaimDetailComponent implements OnChanges {
    @Input({required: true}) claim!: Claim;
    @Input({required: true}) lookups!: ExpenseLookups;
    @Output() closed = new EventEmitter<void>();
    @Output() edit = new EventEmitter<Claim>();
    @Output() changed = new EventEmitter<Claim | null>();

    private readonly destroyRef = inject(DestroyRef);
    readonly statusLabel = STATUS_LABEL;
    readonly tone = STATUS_TONE;
    readonly flagLabel = FLAG_LABEL;
    readonly paidByLabel = PAID_BY_LABEL;

    panel: Panel = null;
    busy = false;
    error: string | null = null;
    /** Review (approve or post): per-line decisions. */
    decisions: Record<string, {reject: boolean; reason: string; accountId: string | null}> = {};
    note = '';
    postingDate = todayIso();
    reason = '';
    pay = {date: todayIso(), amount: 0, bankAccountId: null as string | null, againstAdvance: false, reference: '', note: ''};
    comment = '';

    constructor(private api: ExpenseApiService, private alerts: AlertService) {}

    ngOnChanges() {
        this.panel = null;
        this.error = null;
        this.decisions = Object.fromEntries(this.claim.lines.map(l => [l.id, {reject: l.isRejected, reason: l.rejectReason ?? '', accountId: null}]));
    }

    get reviewing() { return this.claim.canManagerApprove || this.claim.canPost; }
    get reviewTotal() { return this.claim.lines.filter(l => !this.decisions[l.id]?.reject).reduce((t, l) => t + l.amount, 0); }
    flagsOf(l: ExpenseLine) { return l.flags.map(f => this.flagLabel[f] || f); }

    open(panel: Panel) {
        this.error = null;
        this.panel = this.panel === panel ? null : panel;
        if (panel === 'reimburse') {
            this.pay = {date: todayIso(), amount: this.claim.outstanding, bankAccountId: this.lookups.policy.reimbursementBankAccountId, againstAdvance: false, reference: '', note: ''};
        }
    }

    receipt(l: ExpenseLine) {
        if (!l.receiptFileId) { return; }
        const tab = window.open('', '_blank');
        this.api.fileUrl(this.claim.id, l.receiptFileId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: url => { if (tab) { tab.location.href = url; } setTimeout(() => URL.revokeObjectURL(url), 60_000); },
            error: e => { tab?.close(); this.alerts.showMessage('Receipt', expenseErrorOf(e, 'The receipt could not be opened.'), MessageSeverity.error); }
        });
    }

    private run(call: Observable<ClaimAction>) {
        this.busy = true;
        this.error = null;
        call.pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.alerts.showMessage('Expenses', r.message, MessageSeverity.success); this.changed.emit(r.claim); },
            error: e => this.error = expenseErrorOf(e, 'The action failed.')
        });
    }

    private lineDecisions(): LineDecision[] | null {
        const out: LineDecision[] = [];
        for (const l of this.claim.lines) {
            const d = this.decisions[l.id];
            if (!d) { continue; }
            if (d.reject && !d.reason.trim()) { this.error = `Say why line ${l.lineNo} is left out.`; return null; }
            if (d.reject !== l.isRejected || d.accountId) { out.push({lineId: l.id, reject: d.reject, reason: d.reject ? d.reason.trim() : null, accountId: d.accountId}); }
        }
        return out;
    }

    approve() {
        const lines = this.lineDecisions();
        if (!lines) { return; }
        this.run(this.claim.canPost
            ? this.api.post(this.claim.id, this.note.trim() || null, lines, this.postingDate || null)
            : this.api.approve(this.claim.id, this.note.trim() || null, lines));
    }

    submit() { this.run(this.api.submit(this.claim.id)); }

    returnClaim() {
        if (this.reason.trim().length < 3) { this.error = 'Say what needs to change.'; return; }
        this.run(this.api.returnClaim(this.claim.id, this.reason.trim()));
    }

    cancel() {
        if (this.reason.trim().length < 3) { this.error = 'Give a reason.'; return; }
        this.run(this.api.cancel(this.claim.id, this.reason.trim()));
    }

    reimburse() {
        const p = this.pay;
        if (!(+p.amount > 0)) { this.error = 'Enter the amount paid.'; return; }
        if (!p.againstAdvance && !p.bankAccountId) { this.error = 'Choose the account it is paid from.'; return; }
        this.run(this.api.reimburse(this.claim.id, {date: p.date || null, amount: +p.amount, bankAccountId: p.againstAdvance ? null : p.bankAccountId,
            againstAdvance: p.againstAdvance, reference: p.reference.trim() || null, note: p.note.trim() || null}));
    }

    addComment() {
        if (!this.comment.trim()) { return; }
        const text = this.comment.trim();
        this.comment = '';
        this.run(this.api.comment(this.claim.id, text));
    }

    remove() {
        if (!confirm(`Delete ${this.claim.number}? This cannot be undone.`)) { return; }
        this.busy = true;
        this.api.delete(this.claim.id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.alerts.showMessage('Expenses', 'Claim deleted.', MessageSeverity.success); this.changed.emit(null); },
            error: e => this.error = expenseErrorOf(e, 'The claim could not be deleted.')
        });
    }
}
