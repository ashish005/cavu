import {Injectable, Injector} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {Observable, catchError, map, shareReplay} from "rxjs";
import {CoreEndpointBase} from "@app-global";
import {
    BulkResult, CalendarDay, CatalogRow, ComplianceCategory, ComplianceFile, ComplianceLookups, Dashboard, ManualTaskInput, ObligationDetail, ObligationInput,
    ObligationRow, ObligationStatus, Page, Period, Profile, ProfileInput, RegistrationDetail, RegistrationInput, RegistrationRow, Report, TaskActionInput, TaskDetail,
    TaskQuery, TaskRow, TaskUpdateInput
} from "../domains/compliance.models";

/** The API's message (validation errors, 403 "you need … permission", business rules) or a fallback. */
export const errorMessageOf = (error: any, fallback: string): string => {
    const body = error?.error;
    const validation = body?.errors && typeof body.errors === 'object' ? Object.values(body.errors).flat().filter(Boolean).join(' ') : null;
    return validation || body?.detail || body?.message || error?.message || fallback;
};

const unwrap = <T>(resp: any): T => {
    if (resp && resp.isSuccess === false) { throw {status: 200, error: resp, message: resp.message || 'The request was rejected.'}; }
    return resp?.data as T;
};

const toParams = (query: object): HttpParams =>
    Object.entries(query).filter(([, v]) => v !== null && v !== undefined && v !== '').reduce((p, [k, v]) => p.set(k, String(v)), new HttpParams());

/** Tenant API `api/v1/compliance/*`. Provided once on the module so lookups are fetched once per visit. */
@Injectable()
export class ComplianceApiService extends CoreEndpointBase {
    private lookups$: Observable<ComplianceLookups> | null = null;

    constructor(public override injector: Injector) { super(injector); }

    private get url() { return `${this.baseSectorAPIUrl}/v1/compliance`; }

    private get<T>(path: string, query: object = {}): Observable<T> {
        return this.httpClient.get(`${this.url}/${path}`, {...this.requestHeaders, params: toParams(query)}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.get<T>(path, query))));
    }

    /** Grids answer {entities, count, hasNext, hasPrevious} without a data envelope. */
    private page<T>(path: string, query: object = {}): Observable<Page<T>> {
        return this.httpClient.get<Page<T>>(`${this.url}/${path}`, {...this.requestHeaders, params: toParams(query)}).pipe(
            catchError(e => this.handleError(e, () => this.page<T>(path, query))));
    }

    private send<T>(method: 'POST' | 'PUT' | 'DELETE', path: string, body: any = {}): Observable<T> {
        return this.httpClient.request(method, `${this.url}/${path}`, {...this.requestHeaders, body}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.send<T>(method, path, body))));
    }

    // Lookups, dashboard, report
    lookups(refresh = false) {
        if (refresh || !this.lookups$) { this.lookups$ = this.get<ComplianceLookups>('lookups').pipe(shareReplay({bufferSize: 1, refCount: false})); }
        return this.lookups$;
    }
    dashboard() { return this.get<Dashboard>('dashboard'); }
    report(query: {from?: string | null; to?: string | null; category?: ComplianceCategory | null; branchId?: string | null}) { return this.get<Report>('report', query); }

    // Setup
    profile() { return this.get<Profile>('profile'); }
    saveProfile(body: ProfileInput) { return this.send<Profile>('PUT', 'profile', body); }
    catalog(query: {scope?: string | null; country?: string | null; category?: ComplianceCategory | null; search?: string | null}) { return this.get<CatalogRow[]>('catalog', query); }
    adopt(body: {templateIds: number[]; activate: boolean; ownerId?: string | null; reviewerId?: string | null; branchId?: string | null; startDate?: string | null}) {
        return this.send<BulkResult>('POST', 'catalog/adopt', body);
    }
    suggest() { return this.send<BulkResult>('POST', 'catalog/suggest'); }

    // Obligations
    obligations(query: {status?: ObligationStatus | null; category?: ComplianceCategory | null; country?: string | null; ownerId?: string | null; search?: string | null; skip?: number; take?: number}) {
        return this.page<ObligationRow>('obligations', query);
    }
    obligation(id: string) { return this.get<ObligationDetail>(`obligations/${id}`); }
    saveObligation(id: string | null, body: ObligationInput) { return id ? this.send<ObligationDetail>('PUT', `obligations/${id}`, body) : this.send<ObligationDetail>('POST', 'obligations', body); }
    obligationAction(id: string, action: 'activate' | 'pause' | 'resume' | 'retire' | 'refresh', note: string | null = null) {
        return this.send<ObligationDetail>('POST', `obligations/${id}/action`, {action, note});
    }
    bulkObligations(body: {ids: string[]; ownerId?: string | null; action: 'activate' | 'dismiss'}) { return this.send<BulkResult>('POST', 'obligations/bulk', body); }
    previewSchedule(body: ObligationInput) { return this.send<Period[]>('POST', 'obligations/preview', body); }
    deleteObligation(id: string) { return this.send<void>('DELETE', `obligations/${id}`); }

    // Tasks
    tasks(query: TaskQuery) { return this.page<TaskRow>('tasks', query); }
    calendar(from: string, to: string) { return this.get<CalendarDay[]>('tasks/calendar', {from, to}); }
    task(id: string) { return this.get<TaskDetail>(`tasks/${id}`); }
    taskAction(id: string, body: TaskActionInput) { return this.send<TaskDetail>('POST', `tasks/${id}/action`, body); }
    updateTask(id: string, body: TaskUpdateInput) { return this.send<TaskDetail>('PUT', `tasks/${id}`, body); }
    addTask(body: ManualTaskInput) { return this.send<TaskDetail>('POST', 'tasks', body); }
    /** Downloads with the user's credentials (a plain link would lack the auth and tenant headers). */
    download(owner: 'tasks' | 'registrations', ownerId: string, file: ComplianceFile) {
        return this.httpClient.get(`${this.url}/${owner}/${ownerId}/files/${file.id}/content`, {...this.getMultipartFileUploadRequestHeaders, responseType: 'blob'} as any).pipe(
            map((blob: any) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = file.fileName;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            }),
            catchError(e => this.handleError(e, () => this.download(owner, ownerId, file))));
    }
    upload(file: File): Observable<ComplianceFile> {
        const form = new FormData();
        form.append('file', file, file.name);
        return this.httpClient.post(`${this.url}/files`, form, this.getMultipartFileUploadRequestHeaders).pipe(
            map(r => unwrap<ComplianceFile>(r)), catchError(e => this.handleError(e, () => this.upload(file))));
    }

    // Registrations
    registrations(query: {state?: string | null; search?: string | null; skip?: number; take?: number}) { return this.page<RegistrationRow>('registrations', query); }
    registration(id: string) { return this.get<RegistrationDetail>(`registrations/${id}`); }
    saveRegistration(id: string | null, body: RegistrationInput) {
        return id ? this.send<RegistrationDetail>('PUT', `registrations/${id}`, body) : this.send<RegistrationDetail>('POST', 'registrations', body);
    }
    deleteRegistration(id: string) { return this.send<void>('DELETE', `registrations/${id}`); }
    revealSecret(id: string) { return this.send<string>('POST', `registrations/${id}/reveal`); }
}
