import {Component, DestroyRef, EventEmitter, Input, OnChanges, Output, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize, map} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {todayIso, addDaysIso, PartyOption} from "../../domains/finance.models";
import {FinanceApiService, financeErrorOf} from "../../services/finance-api.service";
import {PickerOption} from "../../views/finance-picker.component";
import {QuoteAction, QuoteApiService} from "../quote-api.service";
import {DECLINE_LABEL, QUOTE_STATUS_LABEL, QUOTE_STATUS_TONE, Quote, QuoteLookups} from "../quote.models";

type Panel = 'send' | 'approve' | 'accept' | 'decline' | 'convert' | 'revise' | 'cancel' | 'extend' | 'follow' | null;

/**
 * One quote: what it offers, its totals and margin, approval, sending and the customer's answer, the invoice made from it,
 * revisions and the timeline — with the actions its state allows.
 */
@Component({selector: 'fin-quote-detail', standalone: false, templateUrl: './templates/quote-detail.html'})
export class QuoteDetailComponent implements OnChanges {
    @Input({required: true}) quote!: Quote;
    @Input({required: true}) lookups!: QuoteLookups;
    @Output() closed = new EventEmitter<void>();
    @Output() edit = new EventEmitter<Quote>();
    @Output() changed = new EventEmitter<Quote | null>();
    @Output() openInvoice = new EventEmitter<string>();

    private readonly destroyRef = inject(DestroyRef);
    readonly statusLabel = QUOTE_STATUS_LABEL;
    readonly tone = QUOTE_STATUS_TONE;
    readonly declineLabel = DECLINE_LABEL;

    panel: Panel = null;
    busy = false;
    error: string | null = null;
    send = {email: true, to: '' as string | null, subject: null as string | null, message: null as string | null};
    approveNote = '';
    accept = {acceptedByName: '', customerPoNumber: '', note: '', optional: {} as Record<string, boolean>};
    decline = {reason: 'price', note: '', lostToCompetitor: ''};
    convert = {customerAccountId: null as string | null, customerLabel: null as string | null, invoiceDate: todayIso(), post: false};
    reason = '';
    extendTo = '';
    follow = {date: '' as string | null, note: ''};
    comment = '';

    constructor(private api: QuoteApiService, private finance: FinanceApiService, private alerts: AlertService) {}

    ngOnChanges() { this.panel = null; this.error = null; }

    get optionalLines() { return this.quote.lines.filter(l => l.isOptional); }

    open(panel: Panel) {
        this.error = null;
        this.panel = this.panel === panel ? null : panel;
        const q = this.quote;
        if (panel === 'send') { this.send = {email: !!q.contactEmail, to: q.contactEmail, subject: null, message: null}; }
        if (panel === 'accept') { this.accept = {acceptedByName: q.contactName ?? '', customerPoNumber: '', note: '', optional: Object.fromEntries(this.optionalLines.map(l => [l.id, l.isSelected]))}; }
        if (panel === 'extend') { this.extendTo = addDaysIso(todayIso(), this.lookups.settings.defaultValidityDays); }
        if (panel === 'follow') { this.follow = {date: q.followUpDate ?? addDaysIso(todayIso(), 3), note: ''}; }
        if (panel === 'convert') { this.convert = {customerAccountId: q.customerAccountId, customerLabel: null, invoiceDate: todayIso(), post: false}; }
        this.reason = '';
    }

    private run(call: Observable<QuoteAction>, after?: (a: QuoteAction) => void) {
        this.busy = true;
        this.error = null;
        call.pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.alerts.showMessage('Quotes', r.message, MessageSeverity.success); this.changed.emit(r.quote); after?.(r); },
            error: e => this.error = financeErrorOf(e, 'The action failed.')
        });
    }

    doSend() {
        const s = this.send;
        if (s.email && !(s.to ?? '').trim()) { this.error = 'Enter the email address.'; return; }
        this.run(this.api.send(this.quote.id, {email: s.email, to: (s.to ?? '').trim() || null, subject: s.subject, message: s.message}));
    }
    submit() { this.run(this.api.submit(this.quote.id)); }
    doApprove(approve: boolean) {
        if (!approve && !this.approveNote.trim()) { this.error = 'Say what should change.'; return; }
        this.run(this.api.approve(this.quote.id, approve, this.approveNote.trim() || null));
    }
    doAccept() {
        const a = this.accept;
        this.run(this.api.accept(this.quote.id, {acceptedByName: a.acceptedByName.trim() || null, customerPoNumber: a.customerPoNumber.trim() || null,
            selectedOptionalLineIds: this.optionalLines.length ? this.optionalLines.filter(l => a.optional[l.id]).map(l => l.id) : null, note: a.note.trim() || null}));
    }
    doDecline() {
        const d = this.decline;
        this.run(this.api.decline(this.quote.id, {reason: d.reason, note: d.note.trim() || null, lostToCompetitor: d.lostToCompetitor.trim() || null}));
    }
    doConvert() {
        const c = this.convert;
        if (!c.customerAccountId) { this.error = 'Choose the customer to invoice (this quote was for a prospect).'; return; }
        this.run(this.api.convert(this.quote.id, {customerAccountId: c.customerAccountId, invoiceDate: c.invoiceDate || null, post: c.post}),
            r => { if (r.quote.invoiceId) { this.openInvoice.emit(r.quote.invoiceId); } });
    }
    doRevise() { this.run(this.api.revise(this.quote.id, this.reason.trim() || null), r => this.edit.emit(r.quote)); }
    doCancel() { this.run(this.api.cancel(this.quote.id, this.reason.trim() || null)); }
    doExtend() { if (this.extendTo) { this.run(this.api.extend(this.quote.id, this.extendTo)); } }
    doFollow() { this.run(this.api.followUp(this.quote.id, this.follow.date || null, this.follow.note.trim() || null)); }
    addComment() {
        const text = this.comment.trim();
        if (!text) { return; }
        this.comment = '';
        this.run(this.api.comment(this.quote.id, text));
    }

    duplicate() {
        this.busy = true;
        this.api.duplicate(this.quote.id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: q => { this.alerts.showMessage('Quotes', `Copied as ${q.number}.`, MessageSeverity.success); this.changed.emit(q); this.edit.emit(q); },
            error: e => this.error = financeErrorOf(e, 'The quote could not be copied.')
        });
    }

    remove() {
        if (!confirm(`Delete ${this.quote.number}?`)) { return; }
        this.busy = true;
        this.api.delete(this.quote.id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.changed.emit(null),
            error: e => this.error = financeErrorOf(e, 'The quote could not be deleted.')
        });
    }

    file(fileId: string) {
        const tab = window.open('', '_blank');
        this.api.fileUrl(this.quote.id, fileId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: url => { if (tab) { tab.location.href = url; } setTimeout(() => URL.revokeObjectURL(url), 60_000); },
            error: e => { tab?.close(); this.alerts.showMessage('Quote', financeErrorOf(e, 'The file could not be opened.'), MessageSeverity.error); }
        });
    }

    searchCustomers = (term: string | null): Observable<PickerOption[]> =>
        this.finance.parties('Invoice', term).pipe(map((list: PartyOption[]) => list.map(p => ({id: p.accountId, label: p.name, sub: p.number}))));
}
