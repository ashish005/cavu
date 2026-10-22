import {Injectable, Injector} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {Observable, catchError, map} from "rxjs";
import {CoreEndpointBase} from "@app-global";
import {OcrConfigInput, OcrConfigList, OcrConfigRow} from "./ocr-config.models";

const unwrap = <T>(resp: any): T => {
    if (resp && resp.isSuccess === false) { throw {status: 200, error: resp, message: resp.message || 'The request was rejected.'}; }
    return resp?.data as T;
};

/** The API's message (validation, 403, 422 business rule) or a fallback. */
export const ocrErrorOf = (error: any, fallback: string): string => {
    const body = error?.error;
    const validation = body?.errors && typeof body.errors === 'object' ? Object.values(body.errors).flat().filter(Boolean).join(' ') : null;
    return validation || body?.detail || body?.message || (typeof error?.message === 'string' ? error.message : null) || fallback;
};

/** Platform API `api/v1/platform/ocr-providers` (root users). */
@Injectable()
export class OcrConfigApiService extends CoreEndpointBase {
    constructor(public override injector: Injector) { super(injector); }

    private get root() { return `${this.baseSectorAPIUrl}/v1/platform/ocr-providers`; }

    list(country: string | null): Observable<OcrConfigList> {
        const params = country ? new HttpParams().set('country', country) : new HttpParams();
        return this.httpClient.get(this.root, {...this.requestHeaders, params}).pipe(map(r => unwrap<OcrConfigList>(r)), catchError(e => this.handleError(e, () => this.list(country))));
    }

    save(body: OcrConfigInput): Observable<OcrConfigRow> {
        return this.httpClient.put(this.root, body, this.requestHeaders).pipe(map(r => unwrap<OcrConfigRow>(r)), catchError(e => this.handleError(e, () => this.save(body))));
    }

    remove(id: string): Observable<void> {
        return this.httpClient.delete(`${this.root}/${id}`, this.requestHeaders).pipe(map(r => unwrap<void>(r)), catchError(e => this.handleError(e, () => this.remove(id))));
    }
}
