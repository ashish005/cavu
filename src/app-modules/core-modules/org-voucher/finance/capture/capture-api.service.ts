import {Injectable, Injector} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {Observable, catchError, map} from "rxjs";
import {CoreEndpointBase} from "@app-global";
import {GridPage} from "../banking/banking.models";
import {
    Capture, CaptureComparison, CaptureTaxCodeOption, OcrLog, PartyMatch, PartyProposal, RejectReason, CaptureConvertResult, CaptureInput, CapturePurpose, CaptureRow, CaptureSettings, CaptureUploadResult, CaptureView, ProviderReport
} from "./capture.models";

const unwrap = <T>(resp: any): T => {
    if (resp && resp.isSuccess === false) { throw {status: 200, error: resp, message: resp.message || 'The request was rejected.'}; }
    return resp?.data as T;
};

const params = (obj: Record<string, any>) =>
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== '').reduce((p, [k, v]) => p.set(k, String(v)), new HttpParams());

/** Tenant API `api/v1/finance/capture/*`. Errors read with `financeErrorOf`. */
@Injectable()
export class CaptureApiService extends CoreEndpointBase {
    constructor(public override injector: Injector) { super(injector); }

    private get root() { return `${this.baseSectorAPIUrl}/v1/finance/capture`; }

    private get<T>(path: string, query: Record<string, any> = {}): Observable<T> {
        return this.httpClient.get(`${this.root}${path ? '/' + path : ''}`, {...this.requestHeaders, params: params(query)}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.get<T>(path, query))));
    }

    private send<T>(method: 'POST' | 'PUT', path: string, body: any = {}, query: Record<string, any> = {}): Observable<T> {
        return this.httpClient.request(method, `${this.root}/${path}`, {...this.requestHeaders, body, params: params(query)}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.send<T>(method, path, body, query))));
    }

    list(view: CaptureView, search: string | null, skip: number, take: number): Observable<GridPage<CaptureRow>> {
        const query = {view, search, skip, take};
        return this.httpClient.get<GridPage<CaptureRow>>(this.root, {...this.requestHeaders, params: params(query)}).pipe(
            catchError(e => this.handleError(e, () => this.list(view, search, skip, take))));
    }
    capture(id: string) { return this.get<Capture>(id); }

    /** Up to 20 files; `purpose` null uses the organisation's default. */
    upload(files: File[], purpose: CapturePurpose | null): Observable<CaptureUploadResult> {
        const form = new FormData();
        files.forEach(f => form.append('files', f, f.name));
        if (purpose) { form.append('purpose', purpose); }
        return this.httpClient.post(this.root, form, this.getMultipartFileUploadRequestHeaders).pipe(
            map(r => unwrap<CaptureUploadResult>(r)), catchError(e => this.handleError(e, () => this.upload(files, purpose))));
    }
    update(id: string, body: CaptureInput) { return this.send<Capture>('PUT', id, body); }
    /** `acceptChecks`: convert although checks failed (the reviewer has looked at them). */
    convert(id: string, allowDuplicate: boolean, post: boolean, acceptChecks = false) {
        return this.send<CaptureConvertResult>('POST', `${id}/convert`, {allowDuplicate, post, acceptChecks});
    }
    rejectReasons() { return this.get<RejectReason[]>('reject-reasons'); }
    /** Rejects the document with a reason (a note is needed for "other"). */
    reject(id: string, reason: string, note: string | null) { return this.send<Capture>('POST', `${id}/reject`, {reason, note}); }
    reopen(id: string) { return this.send<Capture>('POST', `${id}/reopen`); }
    discard(id: string) { return this.send<Capture>('POST', `${id}/discard`); }
    reprocess(id: string, provider: string | null) { return this.send<Capture>('POST', `${id}/reprocess`, {}, {provider}); }

    /** The original file as an object URL (a plain link would lack the auth and tenant headers); revoke it when done. */
    fileUrl(id: string): Observable<string> {
        return this.httpClient.get(`${this.root}/${id}/file`, this.getFileDownloadRequestHeaders).pipe(
            map((blob: any) => URL.createObjectURL(blob as Blob)), catchError(e => this.handleError(e, () => this.fileUrl(id))));
    }

    /** Every reader's result side by side with the consensus. */
    readings(id: string) { return this.get<CaptureComparison>(`${id}/readings`); }
    /** Read with more providers (none: the comparison set); they run in the background. */
    compare(id: string, providers: string[], again = false) { return this.send<CaptureComparison>('POST', `${id}/readings`, {providers, again}); }
    /** Copy fields (none: all) from `consensus` or one provider into the document. */
    applyReading(id: string, source: string, fields: string[] = []) { return this.send<Capture>('POST', `${id}/readings/apply`, {source, fields}); }
    providerReport(from: string | null, to: string | null) { return this.get<ProviderReport>('providers/report', {from, to}); }

    /** Vendors (customers for sales invoices) that could be the party, and a new one prefilled from the document. */
    parties(id: string) { return this.get<PartyMatch>(`${id}/parties`); }
    linkParty(id: string, accountId: string) { return this.send<Capture>('POST', `${id}/parties/link`, {accountId}); }
    createParty(id: string, party: PartyProposal, allowDuplicate = false) { return this.send<Capture>('POST', `${id}/parties/new`, {party, allowDuplicate}); }

    taxCodes(id: string) { return this.get<CaptureTaxCodeOption[]>(`${id}/tax-codes`); }
    /** Codes chosen per tax line. */
    setTaxCodes(id: string, lines: {id: string; taxCodeId: string | null}[]) { return this.send<Capture>('PUT', `${id}/taxes`, {lines}); }
    /** Map every tax again (choices made by hand are replaced). */
    remapTaxes(id: string) { return this.send<Capture>('POST', `${id}/taxes/remap`); }

    /** The OCR log (every provider call) with totals per provider. */
    log(query: {provider?: string | null; status?: string | null; from?: string | null; to?: string | null; search?: string | null; skip: number; take: number}) {
        return this.get<OcrLog>('log', query);
    }
    documentLog(id: string) { return this.get<OcrLog>(`${id}/log`); }

    settings() { return this.get<CaptureSettings>('settings'); }
    saveSettings(body: CaptureSettings) { return this.send<CaptureSettings>('PUT', 'settings', body); }
}
