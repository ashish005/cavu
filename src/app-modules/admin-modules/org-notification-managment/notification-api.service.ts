import {Injectable, Injector} from "@angular/core";
import {Observable, Subject, catchError, map} from "rxjs";
import {CoreEndpointBase, OrgResourceService} from "@app-global";
import {
    ChannelStatus, MyPreference, NOTIFY_LOG_SERIALIZER, NotifyChannel, NotifyKind, NotifyKindInput, NotifyLogRow, NotifyOverview, NotifyPreview, NotifyTemplate,
    NotifyTemplateInput
} from "./notification.models";

const unwrap = <T>(resp: any): T => {
    if (resp && resp.isSuccess === false) { throw {status: 200, error: resp, message: resp.message || 'The request was rejected.'}; }
    return resp?.data as T;
};

/** The API's message (validation, 403 "ask an administrator", 422 business rule) or a fallback. */
export const notifyErrorOf = (error: any, fallback: string): string => {
    const body = error?.error;
    const validation = body?.errors && typeof body.errors === 'object' ? Object.values(body.errors).flat().filter(Boolean).join(' ') : null;
    return validation || body?.detail || body?.message || (typeof error?.message === 'string' ? error.message : null) || fallback;
};

/** Tenant API `api/v1/notification-settings/*`. */
@Injectable()
export class NotificationApiService extends CoreEndpointBase {
    constructor(public override injector: Injector) { super(injector); }

    private get root() { return `${this.baseSectorAPIUrl}/v1/notification-settings`; }

    private get<T>(path: string): Observable<T> {
        return this.httpClient.get(`${this.root}/${path}`, this.requestHeaders).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.get<T>(path))));
    }

    private send<T>(method: 'POST' | 'PUT', path: string, body: any = {}): Observable<T> {
        return this.httpClient.request(method, `${this.root}/${path}`, {...this.requestHeaders, body}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.send<T>(method, path, body))));
    }

    /** The server's message (test sends, retries). */
    private message(path: string): Observable<string> {
        return this.httpClient.post(`${this.root}/${path}`, {}, this.requestHeaders).pipe(
            map((r: any) => { unwrap(r); return r.message as string; }), catchError(e => this.handleError(e, () => this.message(path))));
    }

    overview() { return this.get<NotifyOverview>('overview'); }
    kinds() { return this.get<NotifyKind[]>('kinds'); }
    channels() { return this.get<ChannelStatus[]>('channels'); }
    saveKind(code: string, body: NotifyKindInput) { return this.send<NotifyKind>('PUT', `kinds/${encodeURIComponent(code)}`, body); }
    template(code: string, channel: NotifyChannel) { return this.get<NotifyTemplate>(`kinds/${encodeURIComponent(code)}/templates/${channel}`); }
    saveTemplate(code: string, channel: NotifyChannel, body: NotifyTemplateInput) {
        return this.send<NotifyTemplate>('PUT', `kinds/${encodeURIComponent(code)}/templates/${channel}`, body);
    }
    resetTemplate(code: string, channel: NotifyChannel) { return this.send<NotifyTemplate>('POST', `kinds/${encodeURIComponent(code)}/templates/${channel}/reset`); }
    preview(code: string, channel: NotifyChannel, body: NotifyTemplateInput) {
        return this.send<NotifyPreview>('POST', `kinds/${encodeURIComponent(code)}/templates/${channel}/preview`, body);
    }
    test(code: string, channel: NotifyChannel) { return this.message(`kinds/${encodeURIComponent(code)}/test/${channel}`); }
    retry(id: string) { return this.message(`log/${id}/retry`); }
    myPreferences() { return this.get<MyPreference[]>('me/preferences'); }
    saveMyPreferences(items: {code: string; channel: NotifyChannel; isEnabled: boolean}[]) { return this.send<MyPreference[]>('PUT', 'me/preferences', {items}); }
}

/** Paged `GET v1/notification-settings/log` for the delivery log grid. */
@Injectable()
export class NotifyLogGridService extends OrgResourceService<NotifyLogRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/notification-settings/log', NOTIFY_LOG_SERIALIZER); }
}

/** A button pressed inside a grid cell; the view listening does the work. */
@Injectable()
export class NotifyGridEvents {
    readonly actions$ = new Subject<{action: string; row: NotifyLogRow}>();
    emit(action: string, row: NotifyLogRow) { this.actions$.next({action, row}); }
}

export const NOTIFICATION_SERVICES = [NotificationApiService, NotifyLogGridService, NotifyGridEvents];
