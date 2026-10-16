import {Component, DestroyRef, Input, OnInit, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AsidePanelComponent} from "../aside-panel/aside-panel.component";
import {AppSetupService} from "../../services/app-setup.service";
import {DiagnosticsService} from "./diagnostics.service";
import {SupportApiService, SupportPanel, SupportUiService, supportErrorOf} from "./support.service";
import {
    BellSummary, FeedbackKind, InboxRow, STATUS_LABELS, STATUS_TONES, SEVERITY_TONES, TYPE_LABELS, TicketAttachment, TicketDetail,
    TicketRow, TicketSeverity, TicketType
} from "./support.models";

const ago = (iso: string | null): string => {
    if (!iso) { return ''; }
    const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) { return 'just now'; }
    if (s < 3600) { return `${Math.floor(s / 60)} min ago`; }
    if (s < 86400) { return `${Math.floor(s / 3600)} h ago`; }
    if (s < 7 * 86400) { return `${Math.floor(s / 86400)} d ago`; }
    return new Date(iso).toLocaleDateString();
};

/** The bell: notifications, reminders and (administrators) setup checks. */
@Component({
    selector: 'support-bell-panel',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="btn-group btn-group-sm mb-3 d-flex">
            <button type="button" class="btn flex" [ngClass]="tab === 'inbox' ? 'theme' : 'white'" (click)="tab = 'inbox'">
                Notifications <span *ngIf="s?.unread" class="badge danger ml-1">{{ s?.unread }}</span></button>
            <button type="button" class="btn flex" [ngClass]="tab === 'due' ? 'theme' : 'white'" (click)="tab = 'due'">
                Reminders <span *ngIf="s?.reminders?.length" class="badge warn ml-1">{{ s?.reminders?.length }}</span></button>
            <button *ngIf="s?.setupChecks?.length" type="button" class="btn flex" [ngClass]="tab === 'setup' ? 'theme' : 'white'" (click)="tab = 'setup'">
                Setup <span class="badge ml-1" [ngClass]="hasCritical ? 'danger' : 'grey'">{{ s?.setupChecks?.length }}</span></button>
        </div>
        <div *ngIf="error" class="alert alert-danger text-sm">{{ error }}</div>

        <ng-container *ngIf="tab === 'inbox'">
            <div class="d-flex align-items-center mb-2 text-sm">
                <label class="mb-0 flex"><input type="checkbox" class="mr-1" [checked]="unreadOnly" (change)="unreadOnly = !unreadOnly; load(true)">Unread only</label>
                <a role="button" *ngIf="s?.unread" (click)="readAll()">Mark all as read</a>
            </div>
            <div *ngFor="let n of rows" class="d-flex align-items-start p-2 mb-1 rounded" [style.background]="n.isRead ? 'transparent' : 'rgba(37,99,235,.06)'"
                 style="border: 1px solid rgba(120,130,140,.2)">
                <i class="mr-2 mt-1" [ngClass]="(n.icon || 'fa fa-bell') + (n.priority === 'High' || n.priority === 'Critical' ? ' text-danger' : ' text-muted')"></i>
                <div class="flex" role="button" (click)="open(n)">
                    <div class="text-sm" [class._600]="!n.isRead">{{ n.title }}</div>
                    <div class="text-xs text-muted" style="white-space: pre-wrap; max-height: 3.2em; overflow: hidden">{{ n.body }}</div>
                    <div class="text-xs text-muted">{{ ago(n.createdAt) }}</div>
                </div>
                <div class="d-flex flex-column ml-1">
                    <button type="button" class="btn btn-xs white mb-1" (click)="toggle(n)" [title]="n.isRead ? 'Mark as unread' : 'Mark as read'">
                        <i class="fa" [ngClass]="n.isRead ? 'fa-envelope' : 'fa-envelope-open-o'"></i></button>
                    <button type="button" class="btn btn-xs white" (click)="dismiss(n)" title="Remove"><i class="fa fa-times"></i></button>
                </div>
            </div>
            <div *ngIf="!loading && !rows.length" class="text-center text-muted text-sm p-4"><i class="fa fa-bell-slash-o fa-2x d-block mb-2"></i>You're all caught up.</div>
            <div class="text-center" *ngIf="rows.length < count">
                <button type="button" class="btn btn-sm white" [disabled]="loading" (click)="load(false)">Show more</button>
            </div>
            <div *ngIf="loading" class="text-center text-muted text-sm p-2"><i class="fa fa-spinner fa-spin"></i></div>
        </ng-container>

        <ng-container *ngIf="tab === 'due'">
            <a *ngFor="let r of s?.reminders" role="button" class="d-flex align-items-start p-2 mb-1 rounded" style="border: 1px solid rgba(120,130,140,.2)" (click)="ui.follow(r.link)">
                <i class="fa mr-2 mt-1" [ngClass]="r.kind === 'ticket' ? 'fa-life-ring' : 'fa-check-square-o'" [class.text-danger]="r.isOverdue"></i>
                <div class="flex">
                    <div class="text-sm _500">{{ r.title }}</div>
                    <div class="text-xs text-muted">{{ r.subtitle }}</div>
                </div>
                <span *ngIf="r.dueAt" class="text-xs" [class.text-danger]="r.isOverdue">{{ r.isOverdue ? 'overdue' : 'due' }} {{ r.dueAt | date:'MMM d, h:mm a' }}</span>
            </a>
            <div *ngIf="!s?.reminders?.length" class="text-center text-muted text-sm p-4">Nothing due in the next 24 hours.</div>
        </ng-container>

        <ng-container *ngIf="tab === 'setup'">
            <p class="text-xs text-muted">Things in your organisation's setup that need attention.</p>
            <div *ngFor="let c of s?.setupChecks" class="p-2 mb-2 rounded" style="border: 1px solid rgba(120,130,140,.2)"
                 [style.border-left]="'3px solid ' + (c.severity === 'critical' ? '#dc2626' : c.severity === 'warning' ? '#d97706' : '#2563eb')">
                <div class="text-sm _600">{{ c.title }}</div>
                <div class="text-xs text-muted">{{ c.body }}</div>
                <a *ngIf="c.link" role="button" class="text-xs" (click)="ui.follow(c.link)">{{ c.linkLabel || 'Open' }} <i class="fa fa-angle-right"></i></a>
            </div>
        </ng-container>`
})
export class SupportBellPanelComponent implements OnInit {
    readonly ui = inject(SupportUiService);
    private readonly api = inject(SupportApiService);
    private readonly destroyRef = inject(DestroyRef);
    readonly ago = ago;
    tab: 'inbox' | 'due' | 'setup' = 'inbox';
    s: BellSummary | null = null;
    rows: InboxRow[] = [];
    count = 0;
    unreadOnly = false;
    loading = false;
    error: string | null = null;

    get hasCritical() { return !!this.s?.setupChecks.some(c => c.severity === 'critical'); }

    ngOnInit() {
        this.ui.summary$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(s => this.s = s);
        this.ui.refresh();
        this.load(true);
    }

    load(reset: boolean) {
        this.loading = true;
        this.api.inbox(reset ? 0 : this.rows.length, 20, this.unreadOnly).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.rows = reset ? r.rows : [...this.rows, ...r.rows]; this.count = r.count; },
            error: e => this.error = supportErrorOf(e, 'Notifications could not be loaded.')
        });
    }

    open(n: InboxRow) {
        if (!n.isRead) { this.toggle(n); }
        this.ui.follow(n.actionUrl);
    }

    toggle(n: InboxRow) {
        this.api.markRead(n.id, !n.isRead).subscribe({next: () => { n.isRead = !n.isRead; this.ui.refresh(); }});
    }

    dismiss(n: InboxRow) {
        this.api.dismiss(n.id).subscribe({next: () => { this.rows = this.rows.filter(r => r.id !== n.id); this.count--; this.ui.refresh(); }});
    }

    readAll() {
        this.api.markAllRead().subscribe({next: () => { this.rows.forEach(r => r.isRead = true); this.ui.refresh(); }});
    }
}

/** Report a problem (with a screenshot and the page's diagnostics), and follow one's own tickets. */
@Component({
    selector: 'support-report-panel',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="btn-group btn-group-sm mb-3 d-flex" *ngIf="!detail">
            <button type="button" class="btn flex" [ngClass]="tab === 'new' ? 'theme' : 'white'" (click)="tab = 'new'">Report a problem</button>
            <button type="button" class="btn flex" [ngClass]="tab === 'mine' ? 'theme' : 'white'" (click)="tab = 'mine'; loadMine()">My tickets</button>
        </div>
        <div *ngIf="error" class="alert alert-danger text-sm">{{ error }}</div>

        <!-- New ticket -->
        <ng-container *ngIf="tab === 'new' && !detail">
            <div *ngIf="created" class="alert alert-success text-sm">
                <b>{{ created.number }}</b> sent. We'll notify you when support replies.
                <span *ngIf="similar"> {{ similar }} other report(s) describe the same failure, so it is already being looked at.</span>
                <a role="button" class="d-block mt-1" (click)="openTicket(created.id)">View the ticket</a>
            </div>
            <div class="text-sm">
                <label class="text-xs mb-1">What is it about?</label>
                <div class="d-flex flex-wrap mb-2">
                    <button *ngFor="let t of types" type="button" class="btn btn-xs mr-1 mb-1" [ngClass]="type === t ? 'theme' : 'white'" (click)="type = t">{{ typeLabels[t] }}</button>
                </div>
                <div class="form-group">
                    <label class="text-xs">Subject *</label>
                    <input class="form-control form-control-sm" [(ngModel)]="subject" maxlength="200" placeholder="e.g. Customer page shows a blank screen">
                </div>
                <div class="form-group">
                    <label class="text-xs">What happened? *</label>
                    <textarea class="form-control form-control-sm" rows="4" [(ngModel)]="description" maxlength="8000"
                              placeholder="What you were doing, what you expected, and what you saw instead."></textarea>
                </div>
                <div class="form-group" *ngIf="type === 'Bug' || type === 'Data'">
                    <label class="text-xs">Steps to see it again</label>
                    <textarea class="form-control form-control-sm" rows="2" [(ngModel)]="steps" maxlength="4000" placeholder="1. Open… 2. Click…"></textarea>
                </div>
                <div class="form-group">
                    <label class="text-xs">How much does it affect your work?</label>
                    <select class="form-control form-control-sm" [(ngModel)]="severity">
                        <option value="Low">A little — it can wait</option>
                        <option value="Normal">Somewhat — I have a workaround</option>
                        <option value="High">A lot — I am blocked</option>
                        <option value="Critical">Critical — many people are blocked or data is at risk</option>
                    </select>
                </div>

                <label class="d-flex align-items-center mb-1"><input type="checkbox" class="mr-2" [(ngModel)]="includeScreenshot" (change)="capture()">Include a screenshot of this page</label>
                <div *ngIf="includeScreenshot" class="mb-2 rounded p-1" style="border: 1px solid rgba(120,130,140,.2)">
                    <div *ngIf="capturing" class="text-xs text-muted p-2"><i class="fa fa-spinner fa-spin mr-1"></i>Taking the screenshot…</div>
                    <img *ngIf="screenshot" [src]="screenshot" alt="Screenshot" class="w-100 rounded">
                </div>
                <label class="btn btn-xs white mb-2">
                    <i class="fa fa-paperclip mr-1"></i>Attach files
                    <input #files type="file" hidden multiple accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.txt,.log,.csv,.json,.xlsx,.xls,.docx,.doc,.zip" (change)="addFiles(files)">
                </label>
                <div *ngFor="let f of extraFiles; let i = index" class="text-xs d-flex align-items-center">
                    <span class="flex text-truncate">{{ f.name }}</span><a role="button" class="ml-2 text-danger" (click)="extraFiles.splice(i, 1)">&times;</a>
                </div>

                <details class="text-xs text-muted mt-2">
                    <summary role="button">What else is sent with your report</summary>
                    The page address, app version, browser and screen size, your time zone, the last pages you opened,
                    and {{ diagnostics.failureCount ? diagnostics.failureCount + ' recent error(s) on this page' : 'any recent errors' }}
                    — so support can find the cause without asking. Passwords and sign-in tokens are never included.
                    <div *ngIf="diagnostics.lastFailure" class="mt-1">Last error: <code>{{ diagnostics.lastFailure }}</code></div>
                </details>
            </div>
        </ng-container>

        <!-- My tickets -->
        <ng-container *ngIf="tab === 'mine' && !detail">
            <a *ngFor="let t of mine" role="button" class="d-block p-2 mb-1 rounded text-sm" style="border: 1px solid rgba(120,130,140,.2)" (click)="openTicket(t.id)">
                <div class="d-flex align-items-center">
                    <span class="_600 flex text-truncate">{{ t.subject }}</span>
                    <span class="badge ml-1" [ngClass]="statusTones[t.status]">{{ statusLabels[t.status] }}</span>
                </div>
                <div class="text-xs text-muted">{{ t.number }} · {{ typeLabels[t.type] }} · updated {{ ago(t.lastActivityAt) }}</div>
            </a>
            <div *ngIf="!loading && !mine.length" class="text-center text-muted text-sm p-4">You have not reported anything yet.</div>
            <div *ngIf="loading" class="text-center text-muted p-2"><i class="fa fa-spinner fa-spin"></i></div>
        </ng-container>

        <!-- One ticket -->
        <ng-container *ngIf="detail as d">
            <a role="button" class="text-sm d-block mb-2" (click)="detail = null; tab = 'mine'; loadMine()"><i class="fa fa-angle-left mr-1"></i>My tickets</a>
            <div class="d-flex align-items-center">
                <h6 class="mb-0 flex">{{ d.ticket.subject }}</h6>
                <span class="badge" [ngClass]="statusTones[d.ticket.status]">{{ statusLabels[d.ticket.status] }}</span>
            </div>
            <div class="text-xs text-muted mb-2">{{ d.ticket.number }} · {{ typeLabels[d.ticket.type] }} · reported {{ d.ticket.createdAt | date:'medium' }}</div>
            <div class="text-sm p-2 rounded light lt mb-2" style="white-space: pre-wrap">{{ d.description }}</div>
            <div *ngIf="d.resolution" class="alert alert-success text-sm"><b>Resolution:</b> {{ d.resolution }}</div>
            <div class="mb-2">
                <a *ngFor="let a of d.attachments" role="button" class="badge white mr-1" (click)="download(a)"><i class="fa fa-paperclip mr-1"></i>{{ a.fileName }}</a>
            </div>

            <div *ngFor="let c of d.comments" class="mb-2" [class.text-center]="c.kind === 'System'">
                <div *ngIf="c.kind === 'System'" class="text-xs text-muted">{{ c.body }} · {{ ago(c.createdAt) }}</div>
                <div *ngIf="c.kind !== 'System'" class="p-2 rounded text-sm" [style.background]="c.authorId === d.ticket.reporterId ? 'rgba(37,99,235,.06)' : 'rgba(16,185,129,.07)'">
                    <div class="text-xs"><b>{{ c.authorId === d.ticket.reporterId ? 'You' : c.authorName }}</b> <span class="text-muted">· {{ ago(c.createdAt) }}</span></div>
                    <div style="white-space: pre-wrap">{{ c.body }}</div>
                    <a *ngFor="let a of c.attachments" role="button" class="badge white mr-1" (click)="download(a)"><i class="fa fa-paperclip mr-1"></i>{{ a.fileName }}</a>
                </div>
            </div>

            <ng-container *ngIf="d.ticket.status !== 'Closed' && !d.canReopen">
                <textarea class="form-control form-control-sm mb-1" rows="3" [(ngModel)]="reply" maxlength="8000" placeholder="Write a reply…"></textarea>
                <label class="btn btn-xs white mb-1 mr-1"><i class="fa fa-paperclip mr-1"></i>File
                    <input #rf type="file" hidden (change)="replyFile = rf.files?.[0] ?? null"></label>
                <span *ngIf="replyFile" class="text-xs">{{ replyFile.name }}</span>
            </ng-container>
            <div *ngIf="d.canRate" class="p-2 rounded mb-2" style="border: 1px solid rgba(120,130,140,.2)">
                <div class="text-sm mb-1">Was this resolved well?</div>
                <a *ngFor="let n of [1,2,3,4,5]" role="button" class="mr-1" (click)="rating = n"><i class="fa fa-lg" [ngClass]="n <= rating ? 'fa-star text-warning' : 'fa-star-o text-muted'"></i></a>
                <input class="form-control form-control-sm mt-1" [(ngModel)]="ratingComment" maxlength="1000" placeholder="Anything to add? (optional)">
                <button type="button" class="btn btn-xs theme mt-1" [disabled]="!rating || saving" (click)="rate()">Send rating</button>
            </div>
            <div *ngIf="d.canReopen && !d.canRate" class="mb-2">
                <textarea class="form-control form-control-sm mb-1" rows="2" [(ngModel)]="reply" placeholder="Not fixed? Tell us what still happens."></textarea>
            </div>
        </ng-container>

        <div class="d-flex w-100 pt-2 mt-2 white" style="position: sticky; bottom: -1rem; border-top: 1px solid rgba(120,130,140,.2); padding-bottom: .5rem">
            <span class="flex"></span>
            <ng-container *ngIf="!detail && tab === 'new'">
                <button type="button" class="btn btn-sm white mr-1" (click)="ui.close()">Cancel</button>
                <button type="button" class="btn btn-sm theme" [disabled]="saving || !canSend" (click)="send()">
                    <i *ngIf="saving" class="fa fa-spinner fa-spin mr-1"></i>Send report</button>
            </ng-container>
            <ng-container *ngIf="detail as d">
                <button *ngIf="d.canReopen && !d.canRate" type="button" class="btn btn-sm white" [disabled]="saving || reply.trim().length < 3" (click)="reopen()">Reopen</button>
                <button *ngIf="d.ticket.status !== 'Closed' && !d.canReopen" type="button" class="btn btn-sm theme" [disabled]="saving || !reply.trim()" (click)="sendReply()">Send reply</button>
            </ng-container>
        </div>`
})
export class SupportReportPanelComponent implements OnInit {
    @Input() ticketId: string | null = null;
    readonly ui = inject(SupportUiService);
    readonly diagnostics = inject(DiagnosticsService);
    private readonly api = inject(SupportApiService);
    private readonly destroyRef = inject(DestroyRef);
    readonly ago = ago;
    readonly typeLabels = TYPE_LABELS;
    readonly statusLabels = STATUS_LABELS;
    readonly statusTones = STATUS_TONES;
    readonly severityTones = SEVERITY_TONES;
    readonly types: TicketType[] = ['Bug', 'Question', 'FeatureRequest', 'Data', 'Access', 'Billing', 'Other'];

    tab: 'new' | 'mine' = 'new';
    type: TicketType = 'Bug';
    severity: TicketSeverity = 'Normal';
    subject = '';
    description = '';
    steps = '';
    includeScreenshot = true;
    screenshot: string | null = null;
    capturing = false;
    extraFiles: File[] = [];
    saving = false;
    loading = false;
    error: string | null = null;
    created: TicketRow | null = null;
    similar = 0;
    mine: TicketRow[] = [];
    detail: TicketDetail | null = null;
    reply = '';
    replyFile: File | null = null;
    rating = 0;
    ratingComment = '';

    get canSend() { return this.subject.trim().length >= 5 && this.description.trim().length >= 10; }

    ngOnInit() {
        if (this.ticketId) { this.openTicket(this.ticketId); return; }
        const last = this.diagnostics.lastFailure;
        if (last) { this.description = `I got an error: ${last}\n\n`; }
        this.capture();
    }

    /** The page as it looks now (the support panel itself is left out). */
    capture() {
        if (!this.includeScreenshot || this.screenshot) { return; }
        this.capturing = true;
        import('html2canvas').then(m => m.default(document.body, {
            logging: false, useCORS: true, scale: Math.min(1, 1600 / Math.max(1, window.innerWidth)),
            windowWidth: window.innerWidth, windowHeight: window.innerHeight, height: window.innerHeight, y: window.scrollY,
            ignoreElements: el => el.tagName === 'APP-ASIDE' || el.classList?.contains('support-ignore')
        })).then(canvas => this.screenshot = canvas.toDataURL('image/jpeg', 0.8))
            .catch(() => { this.includeScreenshot = false; })
            .finally(() => this.capturing = false);
    }

    addFiles(input: HTMLInputElement) {
        const files = Array.from(input.files ?? []);
        input.value = '';
        const tooBig = files.find(f => f.size > 10 * 1024 * 1024);
        if (tooBig) { this.error = `${tooBig.name} is over 10 MB.`; return; }
        this.extraFiles = [...this.extraFiles, ...files].slice(0, 8);
    }

    send() {
        this.saving = true;
        this.error = null;
        this.api.createTicket({
            type: this.type, severity: this.severity, subject: this.subject.trim(), description: this.description.trim(),
            stepsToReproduce: this.steps.trim() || null, context: this.diagnostics.snapshot()
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: async r => {
                // Files after the ticket exists; a failed upload does not lose the ticket.
                try {
                    if (this.includeScreenshot && this.screenshot) {
                        const blob = await (await fetch(this.screenshot)).blob();
                        await this.api.attach(r.ticket.id, blob, 'screenshot.jpg', true).toPromise();
                    }
                    for (const f of this.extraFiles) { await this.api.attach(r.ticket.id, f, f.name).toPromise(); }
                } catch (e) {
                    this.error = `${r.ticket.number} was sent, but a file could not be attached: ${supportErrorOf(e, 'upload failed')}`;
                }
                this.created = r.ticket;
                this.similar = r.similarOpen;
                this.subject = ''; this.description = ''; this.steps = ''; this.extraFiles = [];
                this.saving = false;
            },
            error: e => { this.error = supportErrorOf(e, 'The report could not be sent. Please try again.'); this.saving = false; }
        });
    }

    loadMine() {
        this.loading = true;
        this.api.myTickets().pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => this.mine = r.rows,
            error: e => this.error = supportErrorOf(e, 'Your tickets could not be loaded.')
        });
    }

    openTicket(id: string) {
        this.error = null;
        this.loading = true;
        this.api.ticket(id).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => { this.detail = d; this.reply = ''; this.rating = 0; },
            error: e => this.error = supportErrorOf(e, 'The ticket could not be opened.')
        });
    }

    sendReply() {
        const d = this.detail;
        if (!d) { return; }
        this.saving = true;
        this.api.comment(d.ticket.id, this.reply.trim()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: async res => {
                if (this.replyFile) {
                    try { await this.api.attach(d.ticket.id, this.replyFile, this.replyFile.name).toPromise(); } catch (e) { this.error = supportErrorOf(e, 'The file could not be attached.'); }
                    this.replyFile = null;
                    res = await this.api.ticket(d.ticket.id).toPromise() ?? res;
                }
                this.detail = res;
                this.reply = '';
                this.saving = false;
            },
            error: e => { this.error = supportErrorOf(e, 'The reply could not be sent.'); this.saving = false; }
        });
    }

    reopen() {
        const d = this.detail;
        if (!d) { return; }
        this.saving = true;
        this.api.reopen(d.ticket.id, this.reply.trim()).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: res => { this.detail = res; this.reply = ''; },
            error: e => this.error = supportErrorOf(e, 'The ticket could not be reopened.')
        });
    }

    rate() {
        const d = this.detail;
        if (!d) { return; }
        this.saving = true;
        this.api.rate(d.ticket.id, this.rating, this.ratingComment.trim() || null).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: res => { this.detail = res; this.ui.refresh(); },
            error: e => this.error = supportErrorOf(e, 'The rating could not be sent.')
        });
    }

    download(a: TicketAttachment) {
        this.api.download(a).subscribe({
            next: url => { window.open(url, '_blank'); setTimeout(() => URL.revokeObjectURL(url), 60_000); },
            error: e => this.error = supportErrorOf(e, 'The file could not be opened.')
        });
    }
}

/** A quick rating of the app or the current page. */
@Component({
    selector: 'support-feedback-panel',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div *ngIf="sent" class="text-center p-4">
            <i class="fa fa-heart fa-2x text-danger mb-2 d-block"></i>
            <div class="_600">Thank you!</div>
            <div class="text-sm text-muted">Your feedback goes straight to the people who improve the app.</div>
        </div>
        <ng-container *ngIf="!sent">
            <div class="text-sm mb-2">How is your experience with this page?</div>
            <div class="mb-3 text-center">
                <a *ngFor="let n of [1,2,3,4,5]" role="button" class="mx-1" (click)="rating = n" [title]="labels[n - 1]">
                    <i class="fa fa-2x" [ngClass]="n <= rating ? 'fa-star text-warning' : 'fa-star-o text-muted'"></i></a>
                <div class="text-xs text-muted mt-1">{{ rating ? labels[rating - 1] : 'Tap a star' }}</div>
            </div>
            <div class="d-flex flex-wrap mb-2">
                <button *ngFor="let k of kinds" type="button" class="btn btn-xs mr-1 mb-1" [ngClass]="kind === k.value ? 'theme' : 'white'" (click)="kind = k.value">{{ k.label }}</button>
            </div>
            <textarea class="form-control form-control-sm" rows="4" [(ngModel)]="message" maxlength="2000"
                      [placeholder]="kind === 'Suggestion' ? 'What would make this better?' : kind === 'Praise' ? 'What do you like?' : 'Tell us more (optional)'"></textarea>
            <div class="text-xs text-muted mt-1">Something broken? <a role="button" (click)="ui.open('report')">Report a problem</a> instead, so support can follow it up.</div>
            <div *ngIf="error" class="alert alert-danger text-sm mt-2">{{ error }}</div>
        </ng-container>
        <div class="d-flex w-100 pt-2 mt-2 white" style="position: sticky; bottom: -1rem; border-top: 1px solid rgba(120,130,140,.2); padding-bottom: .5rem">
            <span class="flex"></span>
            <button *ngIf="!sent" type="button" class="btn btn-sm theme" [disabled]="saving || (!rating && !message.trim())" (click)="send()">Send feedback</button>
            <button *ngIf="sent" type="button" class="btn btn-sm white" (click)="ui.close()">Close</button>
        </div>`
})
export class SupportFeedbackPanelComponent {
    readonly ui = inject(SupportUiService);
    private readonly api = inject(SupportApiService);
    private readonly diagnostics = inject(DiagnosticsService);
    readonly labels = ['Poor', 'Not great', 'Okay', 'Good', 'Great'];
    readonly kinds: {value: FeedbackKind; label: string}[] = [
        {value: 'General', label: 'General'}, {value: 'Suggestion', label: 'Suggestion'}, {value: 'Praise', label: 'Praise'}, {value: 'Problem', label: 'Something is off'}
    ];
    rating = 0;
    kind: FeedbackKind = 'General';
    message = '';
    saving = false;
    sent = false;
    error: string | null = null;

    send() {
        this.saving = true;
        this.error = null;
        this.api.feedback({kind: this.kind, rating: this.rating || null, message: this.message.trim() || null, pageUrl: location.pathname, appVersion: this.diagnostics.appVersion})
            .pipe(finalize(() => this.saving = false)).subscribe({
                next: () => this.sent = true,
                error: e => this.error = supportErrorOf(e, 'Your feedback could not be sent.')
            });
    }
}

/**
 * Hosts the support panels (bell, report a problem, feedback) as right-hand panels, opened through SupportUiService.
 * Placed once in the app header.
 */
@Component({
    selector: 'support-center',
    standalone: true,
    imports: [CommonModule, AsidePanelComponent, SupportBellPanelComponent, SupportReportPanelComponent, SupportFeedbackPanelComponent],
    template: `
        <ng-container [ngSwitch]="panel">
            <app-aside *ngSwitchCase="'bell'" title="Notifications" subtitle="What's new, what's due, and setup that needs attention" (closed)="ui.close()">
                <support-bell-panel></support-bell-panel>
            </app-aside>
            <app-aside *ngSwitchCase="'report'" title="Help & support" subtitle="Tell us what went wrong — we'll take it from there" (closed)="ui.close()">
                <support-report-panel [ticketId]="ui.ticketId"></support-report-panel>
            </app-aside>
            <app-aside *ngSwitchCase="'feedback'" title="Feedback" subtitle="Help us make the app better" (closed)="ui.close()">
                <support-feedback-panel></support-feedback-panel>
            </app-aside>
        </ng-container>`
})
export class SupportCenterComponent implements OnInit {
    readonly ui = inject(SupportUiService);
    private readonly destroyRef = inject(DestroyRef);
    panel: SupportPanel = null;

    private readonly diagnostics = inject(DiagnosticsService);
    private readonly appSetup = inject(AppSetupService);

    ngOnInit() {
        this.diagnostics.appVersion = this.appSetup.appVersion;
        this.ui.panel$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(p => this.panel = p);
        this.ui.start();
    }
}
