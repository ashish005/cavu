import {Injectable, inject} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {NavigationEnd, Router} from "@angular/router";
import {Observable, filter, tap} from "rxjs";

export interface ClientError { message: string; stack?: string | null; url?: string | null; at: string; }
export interface ClientRequest { method: string; url: string; status: number; correlationId?: string | null; message?: string | null; durationMs?: number; at: string; }
export interface ClientContext {
    appVersion?: string | null; url: string; module?: string | null; referrer?: string | null; language: string; timeZone: string;
    screen: string; viewport: string; online: boolean; navigation: string[]; errors: ClientError[]; requests: ClientRequest[];
}

const MAX = 20;
const push = <T>(list: T[], item: T) => { list.push(item); if (list.length > MAX) { list.shift(); } };
/** Tokens and passwords never leave the browser in a report. */
const scrub = (url: string) => url.replace(/([?&](access_token|token|code|password|secret)=)[^&]*/gi, '$1***');

/**
 * Remembers the last client errors, failed API calls (with their X-Correlation-Id, which finds the server's log lines)
 * and pages visited, so a support ticket can say what went wrong without the member having to.
 */
@Injectable({providedIn: 'root'})
export class DiagnosticsService {
    private readonly errors: ClientError[] = [];
    private readonly requests: ClientRequest[] = [];
    private readonly navigation: string[] = [];
    appVersion: string | null = null;

    constructor() {
        try {
            inject(Router).events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => push(this.navigation, scrub((e as NavigationEnd).urlAfterRedirects)));
        } catch { /* no router (tests) */ }
    }

    recordError(error: any) {
        const e = error?.rejection ?? error;
        if (e instanceof HttpErrorResponse) { return; } // recorded by the interceptor
        const message = String(e?.message ?? e ?? 'Unknown error').slice(0, 500);
        push(this.errors, {message, stack: e?.stack ? String(e.stack).slice(0, 2000) : null, url: scrub(location.pathname), at: new Date().toISOString()});
    }

    recordRequest(r: ClientRequest) { push(this.requests, {...r, url: scrub(r.url)}); }

    /** The most recent failure, e.g. to pre-fill a report. */
    get lastFailure(): string | null {
        const req = this.requests[this.requests.length - 1];
        const err = this.errors[this.errors.length - 1];
        if (!req && !err) { return null; }
        return (err && (!req || err.at > req.at)) ? err.message : `${req.method} ${req.url.split('?')[0]} → ${req.status || 'no response'}${req.message ? ': ' + req.message : ''}`;
    }

    get failureCount() { return this.errors.length + this.requests.length; }

    snapshot(): ClientContext {
        return {
            appVersion: this.appVersion,
            url: scrub(location.href),
            referrer: document.referrer ? scrub(document.referrer) : null,
            language: navigator.language,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screen: `${screen.width}x${screen.height}`,
            viewport: `${innerWidth}x${innerHeight}`,
            online: navigator.onLine,
            navigation: [...this.navigation],
            errors: [...this.errors],
            requests: [...this.requests]
        };
    }
}

/** Records failed API calls (and very slow ones) for support tickets. */
@Injectable()
export class DiagnosticsInterceptor implements HttpInterceptor {
    private readonly diagnostics = inject(DiagnosticsService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const started = performance.now();
        return next.handle(req).pipe(tap({
            next: event => {
                if (event instanceof HttpResponse && performance.now() - started > 10000) {
                    this.diagnostics.recordRequest({
                        method: req.method, url: req.urlWithParams, status: event.status, correlationId: event.headers.get('X-Correlation-Id'),
                        message: 'Slow response', durationMs: Math.round(performance.now() - started), at: new Date().toISOString()
                    });
                }
            },
            error: (e: HttpErrorResponse) => this.diagnostics.recordRequest({
                method: req.method, url: req.urlWithParams, status: e?.status ?? 0, correlationId: e?.headers?.get?.('X-Correlation-Id') ?? e?.error?.correlationId ?? null,
                message: String(e?.error?.message ?? e?.error?.title ?? e?.message ?? '').slice(0, 500),
                durationMs: Math.round(performance.now() - started), at: new Date().toISOString()
            })
        }));
    }
}
