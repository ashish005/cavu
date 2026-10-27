import {Injectable, Injector} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {Observable, catchError, map, shareReplay} from "rxjs";
import {CoreEndpointBase, OrgResourceService} from "@app-global";
import {
    QUOTE_SERIALIZER, Quote, QuoteCustomer, QuoteInput, QuoteLookups, QuoteRow, QuoteSettings, QuoteSummary, VENDOR_QUOTE_SERIALIZER, VendorLinesToQuoteInput,
    VendorQuote, VendorQuoteComparison, VendorQuoteInput, VendorQuoteRow
} from "./quote.models";

const unwrap = <T>(resp: any): T => {
    if (resp && resp.isSuccess === false) { throw {status: 200, error: resp, message: resp.message || 'The request was rejected.'}; }
    return resp?.data as T;
};

const params = (obj: Record<string, any>) =>
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== '').reduce((p, [k, v]) => p.set(k, String(v)), new HttpParams());

export interface QuoteAction { quote: Quote; message: string; }

/** Tenant API `api/v1/sales/quotes/*`. Errors read with `financeErrorOf`. */
@Injectable()
export class QuoteApiService extends CoreEndpointBase {
    private lookups$: Observable<QuoteLookups> | null = null;

    constructor(public override injector: Injector) { super(injector); }

    private get root() { return `${this.baseSectorAPIUrl}/v1/sales/quotes`; }

    private get<T>(path: string, query: Record<string, any> = {}): Observable<T> {
        return this.httpClient.get(`${this.root}${path ? '/' + path : ''}`, {...this.requestHeaders, params: params(query)}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.get<T>(path, query))));
    }

    private request<T>(method: 'POST' | 'PUT' | 'DELETE', path: string, body: any = {}): Observable<T> {
        return this.httpClient.request(method, `${this.root}${path ? '/' + path : ''}`, {...this.requestHeaders, body}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.request<T>(method, path, body))));
    }

    private act(path: string, body: any = {}): Observable<QuoteAction> {
        return this.httpClient.post(`${this.root}/${path}`, body, this.requestHeaders).pipe(
            map((r: any) => ({quote: unwrap<Quote>(r), message: r.message as string})), catchError(e => this.handleError(e, () => this.act(path, body))));
    }

    lookups(refresh = false) {
        if (refresh || !this.lookups$) { this.lookups$ = this.get<QuoteLookups>('lookups').pipe(shareReplay({bufferSize: 1, refCount: false})); }
        return this.lookups$;
    }
    summary() { return this.get<QuoteSummary>('summary'); }
    customers(search: string | null) { return this.get<QuoteCustomer[]>('customers', {search}); }
    taxSuggestion(customerAccountId: string) { return this.get<{taxCodeId: string | null}>('tax-suggestion', {customerAccountId}); }
    quote(id: string) { return this.get<Quote>(id); }
    save(id: string | null, body: QuoteInput) { return id ? this.request<Quote>('PUT', id, body) : this.request<Quote>('POST', '', body); }
    delete(id: string) { return this.request<void>('DELETE', id); }
    duplicate(id: string) { return this.request<Quote>('POST', `${id}/duplicate`); }
    submit(id: string) { return this.act(`${id}/submit`); }
    approve(id: string, approve: boolean, note: string | null) { return this.act(`${id}/approve`, {approve, note}); }
    send(id: string, body: {email: boolean; to: string | null; subject: string | null; message: string | null}) { return this.act(`${id}/send`, body); }
    revise(id: string, reason: string | null) { return this.act(`${id}/revise`, {reason}); }
    accept(id: string, body: {acceptedByName: string | null; customerPoNumber: string | null; selectedOptionalLineIds: string[] | null; note: string | null}) {
        return this.act(`${id}/accept`, body);
    }
    decline(id: string, body: {reason: string; note: string | null; lostToCompetitor: string | null}) { return this.act(`${id}/decline`, body); }
    convert(id: string, body: {customerAccountId: string | null; invoiceDate: string | null; post: boolean}) { return this.act(`${id}/convert`, body); }
    cancel(id: string, reason: string | null) { return this.act(`${id}/cancel`, {reason}); }
    extend(id: string, validUntil: string) { return this.act(`${id}/extend`, {validUntil}); }
    followUp(id: string, followUpDate: string | null, note: string | null) { return this.act(`${id}/follow-up`, {followUpDate, note}); }
    comment(id: string, note: string) { return this.act(`${id}/comments`, {note}); }
    upload(file: File): Observable<{id: string; fileName: string}> {
        const form = new FormData();
        form.append('file', file, file.name);
        return this.httpClient.post(`${this.root}/files`, form, this.getMultipartFileUploadRequestHeaders).pipe(
            map(r => unwrap<{id: string; fileName: string}>(r)), catchError(e => this.handleError(e, () => this.upload(file))));
    }
    /** An attached file as an object URL (fetched with the member's headers); revoke it when done. */
    fileUrl(quoteId: string, fileId: string): Observable<string> {
        return this.httpClient.get(`${this.root}/${quoteId}/files/${fileId}`, this.getFileDownloadRequestHeaders).pipe(
            map((blob: any) => URL.createObjectURL(blob as Blob)), catchError(e => this.handleError(e, () => this.fileUrl(quoteId, fileId))));
    }
    /** Draft quotes (new vendor lines can be priced into them). */
    drafts(search: string | null): Observable<QuoteRow[]> {
        return this.httpClient.get(this.root, {...this.requestHeaders, params: params({status: 'draft', search, take: 30})}).pipe(
            map((r: any) => ((r?.entities ?? []) as any[]).map(j => QUOTE_SERIALIZER.fromJson(j) as QuoteRow)),
            catchError(e => this.handleError(e, () => this.drafts(search))));
    }
    settings() { return this.get<QuoteSettings>('settings'); }
    saveSettings(body: QuoteSettings) { return this.request<QuoteSettings>('PUT', 'settings', body); }
}

/** Paged `GET v1/sales/quotes`. */
@Injectable()
export class QuoteGridService extends OrgResourceService<QuoteRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/sales/quotes', QUOTE_SERIALIZER); }
}

/** Tenant API `api/v1/sales/vendor-quotes/*`: third parties' quotations. Errors read with `financeErrorOf`. */
@Injectable()
export class VendorQuoteApiService extends CoreEndpointBase {
    constructor(public override injector: Injector) { super(injector); }

    private get root() { return `${this.baseSectorAPIUrl}/v1/sales/vendor-quotes`; }

    private get<T>(path: string, query: HttpParams = new HttpParams()): Observable<T> {
        return this.httpClient.get(`${this.root}${path ? '/' + path : ''}`, {...this.requestHeaders, params: query}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.get<T>(path, query))));
    }

    private request<T>(method: 'POST' | 'PUT' | 'DELETE', path: string, body: any = {}): Observable<T> {
        return this.httpClient.request(method, `${this.root}${path ? '/' + path : ''}`, {...this.requestHeaders, body}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.request<T>(method, path, body))));
    }

    /** Open vendor quotes (for pickers), optionally of one client quote. */
    open(salesQuoteId: string | null = null, search: string | null = null) {
        const query = params({status: 'open', salesQuoteId, search, take: 100});
        return this.httpClient.get(this.root, {...this.requestHeaders, params: query}).pipe(
            map((r: any) => ((r?.entities ?? []) as any[]).map(j => VENDOR_QUOTE_SERIALIZER.fromJson(j) as VendorQuoteRow)),
            catchError(e => this.handleError(e, () => this.open(salesQuoteId, search))));
    }
    quote(id: string) { return this.get<VendorQuote>(id); }
    save(id: string | null, body: VendorQuoteInput) { return id ? this.request<VendorQuote>('PUT', id, body) : this.request<VendorQuote>('POST', '', body); }
    delete(id: string) { return this.request<void>('DELETE', id); }
    setStatus(id: string, status: string, reason: string | null = null) { return this.request<VendorQuote>('POST', `${id}/status`, {status, reason}); }
    fromCapture(captureId: string, salesQuoteId: string | null, subject: string | null) {
        return this.request<VendorQuote>('POST', 'from-capture', {captureId, salesQuoteId, subject});
    }
    toClientQuote(id: string, body: VendorLinesToQuoteInput) { return this.request<Quote>('POST', `${id}/to-client-quote`, body); }
    compare(salesQuoteId: string | null, ids: string[]) {
        let q = params({salesQuoteId});
        ids.forEach(i => q = q.append('ids', i));
        return this.get<VendorQuoteComparison>('compare', q);
    }
    attach(id: string, fileIds: string[]) { return this.request<VendorQuote>('POST', `${id}/files`, fileIds); }
    fileUrl(id: string, fileId: string): Observable<string> {
        return this.httpClient.get(`${this.root}/${id}/files/${fileId}`, this.getFileDownloadRequestHeaders).pipe(
            map((blob: any) => URL.createObjectURL(blob as Blob)), catchError(e => this.handleError(e, () => this.fileUrl(id, fileId))));
    }
}

/** Paged `GET v1/sales/vendor-quotes`. */
@Injectable()
export class VendorQuoteGridService extends OrgResourceService<VendorQuoteRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/sales/vendor-quotes', VENDOR_QUOTE_SERIALIZER); }
}

export const QUOTE_SERVICES = [QuoteApiService, QuoteGridService, VendorQuoteApiService, VendorQuoteGridService];
