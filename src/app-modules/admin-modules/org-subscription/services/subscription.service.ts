import {Injectable, Injector} from "@angular/core";
import {Observable, catchError, map, shareReplay} from "rxjs";
import {CoreEndpointBase} from "@app-global";
import {
    Checkout, CheckoutStartRequest, PurchaseQuote, SoftwareInvoiceDetail, SubscriptionChangePreview, SubscriptionChangeRequest, SubscriptionChangeResult,
    SubscriptionOverview, SubscriptionPurchaseRequest, SubscriptionPurchaseResult, SubscriptionSummary
} from "../domains/subscription.models";
import {ensureSuccess} from "./api-response";

/**
 * Tenant API (environment.tenantUrl): api/v1/subscription. The tenant is taken from the X-Tenant-Id header
 * added by the auth interceptor, so no org or software id is sent from here.
 */
@Injectable()
export class SubscriptionService extends CoreEndpointBase {
    private overview$: Observable<SubscriptionOverview> | null = null;

    constructor(public override injector: Injector) { super(injector); }

    private get url() { return `${this.baseSectorAPIUrl}/v1/subscription`; }

    /** License, settings, priced plans and the comparison matrix. Cached for the module until `refresh` or a purchase. */
    getOverview(refresh = false): Observable<SubscriptionOverview> {
        if (refresh || !this.overview$) {
            this.overview$ = this.httpClient.get(this.url, this.requestHeaders).pipe(
                map(ensureSuccess),
                map((r: any) => r.data as SubscriptionOverview),
                catchError(error => this.handleError(error, () => this.getOverview(true))),
                // A failed request is not cached: the next subscriber retries.
                shareReplay({bufferSize: 1, refCount: false})
            );
        }
        return this.overview$;
    }

    /**
     * Not retried automatically: a payment must only be resubmitted by the user, with the same idempotency key.
     * The 401 path in handleError replays this exact request, so the key is reused there too.
     */
    purchase(req: SubscriptionPurchaseRequest): Observable<SubscriptionPurchaseResult> {
        return this.httpClient.post(`${this.url}/payment`, req, this.requestHeaders).pipe(
            map(ensureSuccess),
            map((r: any) => {
                this.overview$ = null;
                return r.data as SubscriptionPurchaseResult;
            }),
            catchError(error => this.handleError(error, () => this.purchase(req)))
        );
    }

    /** Price and term of paying for a plan now (new term, extension, or upgrade with credit). Not cached: it depends on today. */
    getQuote(planId: number): Observable<PurchaseQuote> {
        return this.httpClient.get(`${this.url}/quote`, {...this.requestHeaders, params: {planId}}).pipe(
            map(ensureSuccess),
            map((r: any) => r.data as PurchaseQuote),
            catchError(error => this.handleError(error, () => this.getQuote(planId)))
        );
    }

    /** What a change would do; saves nothing. */
    previewChange(req: SubscriptionChangeRequest): Observable<SubscriptionChangePreview> {
        return this.httpClient.post(`${this.url}/changes/preview`, req, this.requestHeaders).pipe(
            map(ensureSuccess),
            map((r: any) => r.data as SubscriptionChangePreview),
            catchError(error => this.handleError(error, () => this.previewChange(req)))
        );
    }

    /** Applies or schedules a change. Resent with the same idempotency key on retry, so it is never applied twice. */
    requestChange(req: SubscriptionChangeRequest): Observable<SubscriptionChangeResult> {
        return this.httpClient.post(`${this.url}/changes`, req, this.requestHeaders).pipe(
            map(ensureSuccess),
            map((r: any) => {
                this.overview$ = null;
                return r.data as SubscriptionChangeResult;
            }),
            catchError(error => this.handleError(error, () => this.requestChange(req)))
        );
    }

    /** Withdraws a scheduled change. */
    cancelChange(changeId: string): Observable<SubscriptionSummary> {
        return this.httpClient.delete(`${this.url}/changes/${changeId}`, this.requestHeaders).pipe(
            map(ensureSuccess),
            map((r: any) => {
                this.overview$ = null;
                return r.data as SubscriptionSummary;
            }),
            catchError(error => this.handleError(error, () => this.cancelChange(changeId)))
        );
    }

    /** Starts an online payment and returns the gateway page to redirect to. Same key on retry returns the same checkout. */
    startCheckout(req: CheckoutStartRequest): Observable<Checkout> {
        return this.httpClient.post(`${this.url}/checkout`, req, this.requestHeaders).pipe(
            map(ensureSuccess),
            map((r: any) => r.data as Checkout),
            catchError(error => this.handleError(error, () => this.startCheckout(req)))
        );
    }

    /** Checkout status; the server re-checks a pending one with the gateway. */
    getCheckout(checkoutId: string): Observable<Checkout> {
        return this.httpClient.get(`${this.url}/checkout/${checkoutId}`, this.requestHeaders).pipe(
            map(ensureSuccess),
            map((r: any) => r.data as Checkout),
            catchError(error => this.handleError(error, () => this.getCheckout(checkoutId)))
        );
    }

    getInvoice(invoiceId: number): Observable<SoftwareInvoiceDetail> {
        return this.httpClient.get(`${this.url}/invoices/${invoiceId}`, this.requestHeaders).pipe(
            map(ensureSuccess),
            map((r: any) => r.data as SoftwareInvoiceDetail),
            catchError(error => this.handleError(error, () => this.getInvoice(invoiceId)))
        );
    }
}
