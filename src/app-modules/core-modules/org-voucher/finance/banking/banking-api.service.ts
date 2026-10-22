import {Injectable, Injector} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {Observable, catchError, map} from "rxjs";
import {CoreEndpointBase} from "@app-global";
import {
    BankCreateInput, BankFeedLine, BankFeedStatus, BankRule, BankRuleInput, GridPage, MoneyAccount, MoneyAccountInput, MoneyAccountRow, PaymentModeInput,
    PaymentModeSetting, Reconciliation, StatementColumns, StatementImport
} from "./banking.models";

const unwrap = <T>(resp: any): T => {
    if (resp && resp.isSuccess === false) { throw {status: 200, error: resp, message: resp.message || 'The request was rejected.'}; }
    return resp?.data as T;
};

const params = (obj: Record<string, any>) =>
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== '').reduce((p, [k, v]) => p.set(k, String(v)), new HttpParams());

/** Tenant API `api/v1/finance/banking/*`. Errors read with `financeErrorOf`. */
@Injectable()
export class BankingApiService extends CoreEndpointBase {
    constructor(public override injector: Injector) { super(injector); }

    private get root() { return `${this.baseSectorAPIUrl}/v1/finance/banking`; }

    private get<T>(path: string, query: Record<string, any> = {}): Observable<T> {
        return this.httpClient.get(`${this.root}/${path}`, {...this.requestHeaders, params: params(query)}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.get<T>(path, query))));
    }

    private send<T>(method: 'POST' | 'PUT' | 'DELETE', path: string, body: any = {}): Observable<T> {
        return this.httpClient.request(method, `${this.root}/${path}`, {...this.requestHeaders, body}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.send<T>(method, path, body))));
    }

    // Money accounts
    accounts() { return this.get<MoneyAccountRow[]>('accounts'); }
    account(id: string) { return this.get<MoneyAccount>(`accounts/${id}`); }
    saveAccount(id: string | null, body: MoneyAccountInput) { return id ? this.send<MoneyAccount>('PUT', `accounts/${id}`, body) : this.send<MoneyAccount>('POST', 'accounts', body); }

    /** Statement CSV; `columns` only when the automatic detection got them wrong. */
    importStatement(id: string, file: File, columns: StatementColumns | null): Observable<StatementImport> {
        const form = new FormData();
        form.append('file', file, file.name);
        if (columns) { form.append('columns', JSON.stringify(columns)); }
        return this.httpClient.post(`${this.root}/accounts/${id}/import`, form, this.getMultipartFileUploadRequestHeaders).pipe(
            map(r => unwrap<StatementImport>(r)), catchError(e => this.handleError(e, () => this.importStatement(id, file, columns))));
    }

    // Statement lines
    feed(id: string, status: BankFeedStatus | null, search: string | null, skip: number, take: number): Observable<GridPage<BankFeedLine>> {
        const query = {status, search, skip, take};
        return this.httpClient.get<GridPage<BankFeedLine>>(`${this.root}/accounts/${id}/feed`, {...this.requestHeaders, params: params(query)}).pipe(
            catchError(e => this.handleError(e, () => this.feed(id, status, search, skip, take))));
    }
    match(lineId: string, valueIds: string[]) { return this.send<BankFeedLine>('POST', `feed/${lineId}/match`, {valueIds}); }
    createFromLine(lineId: string, body: BankCreateInput) { return this.send<BankFeedLine>('POST', `feed/${lineId}/create`, body); }
    exclude(lineId: string, note: string | null) { return this.send<BankFeedLine>('POST', `feed/${lineId}/exclude`, {note}); }
    undo(lineId: string) { return this.send<BankFeedLine>('POST', `feed/${lineId}/undo`); }

    // Reconciliation
    reconciliation(id: string, asOf: string | null) { return this.get<Reconciliation>(`accounts/${id}/reconciliation`, {asOf}); }
    closeReconciliation(id: string, asOf: string, statementBalance: number) {
        return this.send<Reconciliation>('POST', `accounts/${id}/reconciliation/close`, {asOf, statementBalance});
    }

    // Rules and payment modes
    rules() { return this.get<BankRule[]>('rules'); }
    saveRule(id: string | null, body: BankRuleInput) { return id ? this.send<BankRule>('PUT', `rules/${id}`, body) : this.send<BankRule>('POST', 'rules', body); }
    deleteRule(id: string) { return this.send<void>('DELETE', `rules/${id}`); }
    paymentModes() { return this.get<PaymentModeSetting[]>('payment-modes'); }
    savePaymentModes(modes: PaymentModeInput[]) { return this.send<PaymentModeSetting[]>('PUT', 'payment-modes', {modes}); }
}
