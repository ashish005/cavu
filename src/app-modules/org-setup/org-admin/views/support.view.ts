import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, FullDateFormatCell, MessageSeverity, SupportApiService, SupportLookups, TicketAttachment, TicketDetail, ViewExtender, supportErrorOf} from "@app-global";
import {FeedbackQueryOptions, FeedbackRow, SupportStats, SupportTicketQueryOptions, SupportTicketRow} from "../domains/org-admin.models";
import {FeedbackGridService, OrgAdminApiService, OrgAdminGridEvents, SupportTicketGridService, errorMessageOf} from "../services/org-admin-api.service";
import {FeedbackMessageCell, TicketStatusCell, TicketSubjectCell} from "../grid-cells/org-admin-cells";

/** Parsed diagnostics of a ticket, for reading rather than raw JSON. */
interface Diagnostics {
    client?: {
        appVersion?: string; url?: string; language?: string; timeZone?: string; screen?: string; viewport?: string; online?: boolean;
        navigation?: string[]; errors?: {message: string; stack?: string; url?: string; at?: string}[];
        requests?: {method: string; url: string; status: number; correlationId?: string; message?: string; durationMs?: number; at?: string}[];
    };
    server?: {receivedAt?: string; branchId?: string; userType?: string; roles?: string[]; isAdmin?: boolean; correlationId?: string; clientIp?: string; userAgent?: string};
}

/**
 * Support console: every ticket of the organisation, most urgent first, with what is needed to find the root cause
 * (failed requests with their correlation ids, client errors, pages visited, similar reports).
 */
@Component({standalone: false, templateUrl: './templates/support-tickets.html'})
export class OrgSupportTicketsView extends ViewExtender<SupportTicketRow> implements OnInit {
    override coreState = new SupportTicketQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    stats: SupportStats | null = null;
    lookups: SupportLookups | null = null;
    detail: TicketDetail | null = null;
    diagnostics: Diagnostics | null = null;
    form = {status: '', severity: '', assigneeId: '', rootCause: '', resolution: ''};
    reply = '';
    internal = false;
    saving = false;
    editError: string | null = null;

    constructor(public override service: SupportTicketGridService, public override activatedRoute: ActivatedRoute,
                private api: OrgAdminApiService, private support: SupportApiService, private events: OrgAdminGridEvents, private alerts: AlertService) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: true, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Ticket', field: 'subject', cellTemplate: TicketSubjectCell},
            {headerName: 'State', field: 'status', cellTemplate: TicketStatusCell},
            {headerName: 'Assigned to', field: 'assigneeName', cellFn: (r: SupportTicketRow) => r.assigneeName ?? '— unassigned'},
            {headerName: 'Replies', field: 'replies', class: 'text-right'},
            {headerName: 'Last activity', field: 'lastActivityAt', cellTemplate: FullDateFormatCell}
        ];
    }

    get errorText() { return this.errorMsg ? errorMessageOf(this.errorMsg, 'The tickets could not be loaded.') : null; }

    ngOnInit() {
        this.support.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.lookups = l, error: () => {}});
        this.loadStats();
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => {
            if (a.action === 'open') { this.actionCb(a.row); }
            if (a.action === 'similar') { this.showSimilar(a.row.fingerprint); }
        });
        const open = this.activatedRoute.snapshot.queryParamMap.get('ticket');
        if (open) { this.openTicket(open); }
        this.populateGrid();
    }

    loadStats() {
        this.api.supportStats().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: s => this.stats = s, error: () => {}});
    }

    applyFilter() {
        this.coreState.skip = 0;
        this.coreState.page = 1;
        this.populateGrid();
    }

    quick(filter: 'open' | 'overdue' | 'mine' | 'unassigned' | 'all') {
        Object.assign(this.coreState, {status: null, severity: null, openOnly: filter !== 'all', overdue: filter === 'overdue', assignedToMe: filter === 'mine', fingerprint: null});
        this.applyFilter();
    }

    showSimilar(fingerprint: string) {
        Object.assign(this.coreState, {status: null, openOnly: false, overdue: false, assignedToMe: false, fingerprint});
        this.applyFilter();
    }

    actionCb(row: SupportTicketRow) { this.openTicket(row.id); }

    openTicket(id: string) {
        this.editError = null;
        this.support.ticket(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => this.apply(d),
            error: e => this.alerts.showMessage('Not found', supportErrorOf(e, 'The ticket could not be opened.'), MessageSeverity.error)
        });
    }

    private apply(d: TicketDetail) {
        this.detail = d;
        this.reply = '';
        this.internal = false;
        this.form = {status: d.ticket.status, severity: d.ticket.severity, assigneeId: d.ticket.assigneeId ?? '', rootCause: d.rootCause ?? '', resolution: d.resolution ?? ''};
        try { this.diagnostics = d.contextJson ? JSON.parse(d.contextJson) : null; } catch { this.diagnostics = null; }
    }

    save() {
        const d = this.detail;
        if (!d) { return; }
        this.run(this.support.update(d.ticket.id, {
            status: this.form.status, severity: this.form.severity,
            assigneeId: this.form.assigneeId || null, unassign: !this.form.assigneeId && !!d.ticket.assigneeId,
            rootCause: this.form.rootCause, resolution: this.form.resolution
        }), 'Saved.');
    }

    sendReply() {
        const d = this.detail;
        if (!d || !this.reply.trim()) { return; }
        this.run(this.support.comment(d.ticket.id, this.reply.trim(), this.internal), this.internal ? 'Internal note added.' : 'Reply sent; the reporter is notified.');
    }

    private run(call: ReturnType<SupportApiService['ticket']>, message: string) {
        this.saving = true;
        this.editError = null;
        call.pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { this.apply(d); this.alerts.showMessage('Saved', message, MessageSeverity.success); this.populateGrid(); this.loadStats(); },
            error: e => this.editError = supportErrorOf(e, 'The change could not be saved.')
        });
    }

    download(a: TicketAttachment) {
        this.support.download(a).subscribe({next: url => { window.open(url, '_blank'); setTimeout(() => URL.revokeObjectURL(url), 60_000); }});
    }

    copy(text: string) { navigator.clipboard?.writeText(text).then(() => this.alerts.showMessage('Copied', text, MessageSeverity.info)); }
    path(url: string) { try { return new URL(url).pathname; } catch { return url.split('?')[0]; } }
}

/** Feedback: ratings and comments per page, reviewed and marked planned or done. */
@Component({standalone: false, templateUrl: './templates/support-feedback.html'})
export class OrgFeedbackView extends ViewExtender<FeedbackRow> implements OnInit {
    override coreState = new FeedbackQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    readonly statuses = ['New', 'Reviewed', 'Planned', 'Done', 'Dismissed'];
    stats: SupportStats | null = null;
    editing: {row: FeedbackRow; status: string; note: string} | null = null;
    saving = false;
    editError: string | null = null;

    constructor(public override service: FeedbackGridService, public override activatedRoute: ActivatedRoute,
                private api: OrgAdminApiService, private events: OrgAdminGridEvents, private alerts: AlertService) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: true, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Feedback', field: 'message', cellTemplate: FeedbackMessageCell},
            {headerName: 'Area', field: 'module'},
            {headerName: 'From', field: 'userName'},
            {headerName: 'Status', field: 'status'},
            {headerName: 'When', field: 'createdAt', cellTemplate: FullDateFormatCell}
        ];
    }

    get errorText() { return this.errorMsg ? errorMessageOf(this.errorMsg, 'The feedback could not be loaded.') : null; }

    ngOnInit() {
        this.api.supportStats().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: s => this.stats = s, error: () => {}});
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'open') { this.actionCb(a.row); } });
        this.populateGrid();
    }

    applyFilter() {
        this.coreState.skip = 0;
        this.coreState.page = 1;
        this.populateGrid();
    }

    actionCb(row: FeedbackRow) {
        this.editError = null;
        this.editing = {row, status: row.status === 'New' ? 'Reviewed' : row.status, note: row.reviewNote ?? ''};
    }

    save() {
        const e = this.editing;
        if (!e) { return; }
        this.saving = true;
        this.api.reviewFeedback(e.row.id, e.status, e.note.trim() || null).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.alerts.showMessage('Saved', 'Feedback updated.', MessageSeverity.success); this.editing = null; this.populateGrid(); },
            error: err => this.editError = errorMessageOf(err, 'The feedback could not be updated.')
        });
    }
}
