import {Injectable, Injector} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {Observable, catchError, map} from "rxjs";
import {CoreEndpointBase} from "@app-global";
import {GridPage} from "../banking/banking.models";
import {
    Capture, CaptureConvertResult, CaptureInput, CapturePurpose, CaptureRow, CaptureSettings, CaptureUploadResult, CaptureView
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
    convert(id: string, allowDuplicate: boolean, post: boolean) { return this.send<CaptureConvertResult>('POST', `${id}/convert`, {allowDuplicate, post}); }
    discard(id: string) { return this.send<Capture>('POST', `${id}/discard`); }
    reprocess(id: string, provider: string | null) { return this.send<Capture>('POST', `${id}/reprocess`, {}, {provider}); }

    /** The original file as an object URL (a plain link would lack the auth and tenant headers); revoke it when done. */
    fileUrl(id: string): Observable<string> {
        return this.httpClient.get(`${this.root}/${id}/file`, this.getFileDownloadRequestHeaders).pipe(
            map((blob: any) => URL.createObjectURL(blob as Blob)), catchError(e => this.handleError(e, () => this.fileUrl(id))));
    }

    settings() { return this.get<CaptureSettings>('settings'); }
    saveSettings(body: CaptureSettings) { return this.send<CaptureSettings>('PUT', 'settings', body); }
}
