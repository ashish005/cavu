import {Injectable, Injector} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {Observable, Subject, catchError, map, shareReplay} from "rxjs";
import {CoreEndpointBase, OrgResourceService} from "@app-global";
import {
    CLAIM_SERIALIZER, Claim, ClaimInput, ClaimRow, DocFile, EmployeeOption, ExpenseCategory, ExpenseLookups, ExpensePayment, ExpensePolicy, ExpenseSummary,
    LineDecision, PAYMENT_SERIALIZER, PaymentRow, SpendReport
} from "./expense.models";

const unwrap = <T>(resp: any): T => {
    if (resp && resp.isSuccess === false) { throw {status: 200, error: resp, message: resp.message || 'The request was rejected.'}; }
    return resp?.data as T;
};

const params = (obj: Record<string, any>) =>
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== '').reduce((p, [k, v]) => p.set(k, String(v)), new HttpParams());

/** The API's message (validation, 403, 422 business rule) or a fallback. */
export const expenseErrorOf = (error: any, fallback: string): string => {
    const body = error?.error;
    const validation = body?.errors && typeof body.errors === 'object' ? Object.values(body.errors).flat().filter(Boolean).join(' ') : null;
    return validation || body?.detail || body?.message || (typeof error?.message === 'string' ? error.message : null) || fallback;
};

export interface ClaimAction { claim: Claim; message: string; }

/** Tenant API `api/v1/expenses/*`. */
@Injectable()
export class ExpenseApiService extends CoreEndpointBase {
    private lookups$: Observable<ExpenseLookups> | null = null;

    constructor(public override injector: Injector) { super(injector); }

    private get root() { return `${this.baseSectorAPIUrl}/v1/expenses`; }

    private get<T>(path: string, query: Record<string, any> = {}): Observable<T> {
        return this.httpClient.get(`${this.root}/${path}`, {...this.requestHeaders, params: params(query)}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.get<T>(path, query))));
    }

    private send<T>(method: 'POST' | 'PUT' | 'DELETE', path: string, body: any = {}): Observable<T> {
        return this.httpClient.request(method, `${this.root}/${path}`, {...this.requestHeaders, body}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.send<T>(method, path, body))));
    }

    /** Workflow actions return the claim and a message. */
    private act(path: string, body: any = {}): Observable<ClaimAction> {
        return this.httpClient.post(`${this.root}/${path}`, body, this.requestHeaders).pipe(
            map((r: any) => ({claim: unwrap<Claim>(r), message: r.message as string})), catchError(e => this.handleError(e, () => this.act(path, body))));
    }

    lookups(refresh = false) {
        if (refresh || !this.lookups$) { this.lookups$ = this.get<ExpenseLookups>('lookups').pipe(shareReplay({bufferSize: 1, refCount: false})); }
        return this.lookups$;
    }
    summary() { return this.get<ExpenseSummary>('summary'); }
    claim(id: string) { return this.get<Claim>(`claims/${id}`); }
    save(id: string | null, body: ClaimInput) { return id ? this.send<Claim>('PUT', `claims/${id}`, body) : this.send<Claim>('POST', 'claims', body); }
    delete(id: string) { return this.send<void>('DELETE', `claims/${id}`); }
    submit(id: string) { return this.act(`claims/${id}/submit`); }
    approve(id: string, note: string | null, lines: LineDecision[]) { return this.act(`claims/${id}/approve`, {note, lines}); }
    post(id: string, note: string | null, lines: LineDecision[], postingDate: string | null) { return this.act(`claims/${id}/post`, {note, lines, postingDate}); }
    returnClaim(id: string, reason: string) { return this.act(`claims/${id}/return`, {reason}); }
    cancel(id: string, reason: string) { return this.act(`claims/${id}/cancel`, {reason}); }
    reimburse(id: string, body: {date: string | null; amount: number; bankAccountId: string | null; againstAdvance: boolean; reference: string | null; note: string | null}) {
        return this.act(`claims/${id}/reimburse`, body);
    }
    comment(id: string, note: string) { return this.act(`claims/${id}/comments`, {note}); }

    upload(file: File): Observable<DocFile> {
        const form = new FormData();
        form.append('file', file, file.name);
        return this.httpClient.post(`${this.root}/files`, form, this.getMultipartFileUploadRequestHeaders).pipe(
            map(r => unwrap<DocFile>(r)), catchError(e => this.handleError(e, () => this.upload(file))));
    }
    /** A file as an object URL (a plain link would lack the auth and tenant headers); revoke it when done. */
    fileUrl(claimId: string, fileId: string): Observable<string> {
        return this.httpClient.get(`${this.root}/claims/${claimId}/files/${fileId}`, this.getFileDownloadRequestHeaders).pipe(
            map((blob: any) => URL.createObjectURL(blob as Blob)), catchError(e => this.handleError(e, () => this.fileUrl(claimId, fileId))));
    }

    advance(body: {employeePartyId: string; date: string | null; amount: number; bankAccountId: string | null; reference: string | null; note: string | null}) {
        return this.send<ExpensePayment>('POST', 'advances', body);
    }
    voidPayment(id: string, reason: string) { return this.send<ExpensePayment>('POST', `payments/${id}/void`, {reason}); }
    employees(search: string | null) { return this.get<EmployeeOption[]>('employees', {search}); }
    spend(from: string | null, to: string | null, groupBy: string) { return this.get<SpendReport>('reports/spend', {from, to, groupBy}); }
    categories() { return this.get<ExpenseCategory[]>('categories'); }
    saveCategory(c: ExpenseCategory) { return c.id ? this.send<ExpenseCategory>('PUT', `categories/${c.id}`, c) : this.send<ExpenseCategory>('POST', 'categories', c); }
    policy() { return this.get<ExpensePolicy>('policy'); }
    savePolicy(p: ExpensePolicy) { return this.send<ExpensePolicy>('PUT', 'policy', p); }
    /** Accounts for category and policy pickers (finance workspace API). */
    accountOptions(purpose: string, search: string | null): Observable<{id: string; name: string; code: string | null; group: string}[]> {
        return this.httpClient.get(`${this.baseSectorAPIUrl}/v1/finance/account-options`, {...this.requestHeaders, params: params({purpose, search})}).pipe(
            map(r => unwrap<{id: string; name: string; code: string | null; group: string}[]>(r)), catchError(e => this.handleError(e, () => this.accountOptions(purpose, search))));
    }
}

/** Paged `GET v1/expenses/claims` (scope and filters in the query options). */
@Injectable()
export class ClaimGridService extends OrgResourceService<ClaimRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/expenses/claims', CLAIM_SERIALIZER); }
}

/** Paged `GET v1/expenses/payments`. */
@Injectable()
export class PaymentGridService extends OrgResourceService<PaymentRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/expenses/payments', PAYMENT_SERIALIZER); }
}

/** Buttons pressed in grid cells; the view listening does the work. */
@Injectable()
export class ExpenseGridEvents {
    readonly actions$ = new Subject<{action: string; row: any}>();
    emit(action: string, row: any) { this.actions$.next({action, row}); }
}

export const EXPENSE_SERVICES = [ExpenseApiService, ClaimGridService, PaymentGridService, ExpenseGridEvents];
