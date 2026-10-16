import {Injectable, Injector, NgZone, OnDestroy} from "@angular/core";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable, Subscription, catchError, filter, map, of, switchMap, timer} from "rxjs";
import {CoreEndpointBase} from "../../services/endpoint-base.service";
import {BellSummary, InboxRow, SupportLookups, TicketAttachment, TicketDetail, TicketRow, TicketSeverity, TicketType, FeedbackKind} from "./support.models";
import {ClientContext} from "./diagnostics.service";

export const supportErrorOf = (e: any, fallback: string): string => {
    const body = e?.error;
    const validation = body?.errors && typeof body.errors === 'object' ? Object.values(body.errors).flat().filter(Boolean).join(' ') : null;
    return validation || body?.detail || body?.message || fallback;
};

const unwrap = <T>(r: any): T => {
    if (r?.isSuccess === false) { throw {error: r}; }
    return (r?.data ?? r) as T;
};

/** Tenant API: `v1/support/*` (tickets, feedback) and `v1/notifications/*` (the bell). */
@Injectable({providedIn: 'root'})
export class SupportApiService extends CoreEndpointBase {
    constructor(public override injector: Injector) { super(injector); }

    private url(path: string) { return `${this.baseSectorAPIUrl}/v1/${path}`; }
    private get<T>(path: string, params: Record<string, any> = {}): Observable<T> {
        const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== null && v !== undefined && v !== ''));
        return this.httpClient.get(this.url(path), {...this.requestHeaders, params: clean}).pipe(map(r => unwrap<T>(r)));
    }
    private send<T>(method: 'POST' | 'PUT' | 'DELETE', path: string, body: any = {}): Observable<T> {
        return this.httpClient.request(method, this.url(path), {...this.requestHeaders, body}).pipe(map(r => unwrap<T>(r)));
    }

    // Bell
    summary() { return this.get<BellSummary>('notifications/summary'); }
    inbox(skip: number, take: number, unreadOnly: boolean) {
        return this.httpClient.get<any>(this.url('notifications'), {...this.requestHeaders, params: {skip, take, unreadOnly}})
            .pipe(map(r => ({rows: (r?.entities ?? []) as InboxRow[], count: r?.count ?? 0})));
    }
    markRead(id: string, read = true) { return this.send<{unread: number}>('POST', `notifications/${id}/${read ? 'read' : 'unread'}`); }
    markAllRead() { return this.send<{unread: number}>('POST', 'notifications/read-all'); }
    dismiss(id: string) { return this.send<{unread: number}>('DELETE', `notifications/${id}`); }

    // Tickets
    lookups() { return this.get<SupportLookups>('support/lookups'); }
    createTicket(body: {type: TicketType; severity: TicketSeverity; subject: string; description: string; stepsToReproduce: string | null; context: ClientContext}) {
        return this.send<{ticket: TicketRow; similarOpen: number}>('POST', 'support/tickets', body);
    }
    myTickets(skip = 0, take = 25) {
        return this.httpClient.get<any>(this.url('support/tickets'), {...this.requestHeaders, params: {skip, take}})
            .pipe(map(r => ({rows: (r?.entities ?? []) as TicketRow[], count: r?.count ?? 0})));
    }
    ticket(id: string) { return this.get<TicketDetail>(`support/tickets/${id}`); }
    comment(id: string, body: string, internal = false) { return this.send<TicketDetail>('POST', `support/tickets/${id}/comments`, {body, internal}); }
    update(id: string, body: any) { return this.send<TicketDetail>('PUT', `support/tickets/${id}`, body); }
    reopen(id: string, body: string) { return this.send<TicketDetail>('POST', `support/tickets/${id}/reopen`, {body}); }
    rate(id: string, rating: number, comment: string | null) { return this.send<TicketDetail>('POST', `support/tickets/${id}/rate`, {rating, comment}); }
    attach(id: string, file: Blob, name: string, screenshot = false): Observable<TicketAttachment> {
        const form = new FormData();
        form.append('file', file, name);
        return this.httpClient.post(this.url(`support/tickets/${id}/attachments?screenshot=${screenshot}`), form, this.getMultipartFileUploadRequestHeaders)
            .pipe(map(r => unwrap<TicketAttachment>(r)));
    }
    /** Opens a file with the member's credentials (a plain link would lack the auth and tenant headers). */
    download(a: TicketAttachment) {
        return this.httpClient.get(this.url(`support/attachments/${a.id}/content`), {...this.getMultipartFileUploadRequestHeaders, responseType: 'blob'} as any)
            .pipe(map((blob: any) => URL.createObjectURL(blob)));
    }

    // Feedback
    feedback(body: {kind: FeedbackKind; rating: number | null; message: string | null; pageUrl: string; appVersion: string | null}) {
        return this.send<any>('POST', 'support/feedback', body);
    }
}

export type SupportPanel = 'bell' | 'report' | 'feedback' | null;

/**
 * Which support panel is open, and the bell's numbers. Polls the bell every minute while the tab is visible (and at
 * once when the member comes back to it), so the badge stays current without hammering the API.
 */
@Injectable({providedIn: 'root'})
export class SupportUiService implements OnDestroy {
    readonly panel$ = new BehaviorSubject<SupportPanel>(null);
    readonly summary$ = new BehaviorSubject<BellSummary | null>(null);
    /** A ticket to open in the report panel's "My tickets". */
    ticketId: string | null = null;
    private poll?: Subscription;
    private readonly onVisible = () => { if (!document.hidden) { this.refresh(); } };

    constructor(private api: SupportApiService, private router: Router, private zone: NgZone) {}

    get badge() { return this.summary$.value?.badgeCount ?? 0; }

    /** Starts polling; safe to call more than once. */
    start() {
        if (this.poll) { return; }
        document.addEventListener('visibilitychange', this.onVisible);
        this.poll = timer(0, 60_000).pipe(
            filter(() => !document.hidden && navigator.onLine),
            switchMap(() => this.api.summary().pipe(catchError(() => of(null))))
        ).subscribe(s => { if (s) { this.summary$.next(s); } });
    }

    refresh() { this.api.summary().pipe(catchError(() => of(null))).subscribe(s => { if (s) { this.summary$.next(s); } }); }

    open(panel: SupportPanel, ticketId: string | null = null) {
        this.ticketId = ticketId;
        this.panel$.next(panel);
    }

    close() { this.panel$.next(null); this.ticketId = null; }

    /** Follows a notification's link: app routes, or `support:ticket/{id}` to open the member's ticket. */
    follow(link: string | null) {
        if (!link) { return; }
        const ticket = /^support:ticket\/(.+)$/.exec(link);
        if (ticket) { this.open('report', ticket[1]); return; }
        this.close();
        this.zone.run(() => this.router.navigateByUrl(link));
    }

    ngOnDestroy() {
        this.poll?.unsubscribe();
        document.removeEventListener('visibilitychange', this.onVisible);
    }
}
