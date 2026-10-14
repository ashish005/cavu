import {Injectable, Injector} from "@angular/core";
import {Observable, catchError, map, shareReplay} from "rxjs";
import {CoreEndpointBase} from "@app-global";
import {
    SoftwareInvoiceDetail, SubscriptionOverview, SubscriptionPurchaseRequest, SubscriptionPurchaseResult
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

    getInvoice(invoiceId: number): Observable<SoftwareInvoiceDetail> {
        return this.httpClient.get(`${this.url}/invoices/${invoiceId}`, this.requestHeaders).pipe(
            map(ensureSuccess),
            map((r: any) => r.data as SoftwareInvoiceDetail),
            catchError(error => this.handleError(error, () => this.getInvoice(invoiceId)))
        );
    }
}
