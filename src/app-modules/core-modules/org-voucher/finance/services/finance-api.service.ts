import {Injectable, Injector} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {Observable, Subject, catchError, map, shareReplay} from "rxjs";
import {CoreEndpointBase, OrgResourceService} from "@app-global";
import {
    AccountOption, AccountingSettings, BalanceSheet, Chart, CoaAccount, CoaAccountInput, CoaGroup, DOCUMENT_TYPE_SERIALIZER, DocumentTypeInput, DocumentTypeRow,
    FINANCE_DOC_SERIALIZER, FinanceActionRes, FinanceDashboard, FinanceDoc, FinanceDocInput, FinanceDocRow, FinanceKind, FinanceKindSummary, FinanceLookups,
    InvoiceSettings, JOURNAL_SERIALIZER, JournalRow, LedgerReport, OpenDoc, POSTING_JOB_SERIALIZER, PartyOption, PostingJobRow, PostingSummary, ProfitLoss,
    RECURRING_SERIALIZER, RecurringInput, RecurringRow, TAX_CODE_SERIALIZER, TaxCodeInput, TaxCodeRow, TrialBalance
} from "../domains/finance.models";

/** The API's message (validation, 403 "you need … permission", 409 conflicts) or a fallback. */
export const financeErrorOf = (error: any, fallback: string): string => {
    const body = error?.error;
    const validation = body?.errors && typeof body.errors === 'object' ? Object.values(body.errors).flat().filter(Boolean).join(' ') : null;
    return validation || body?.detail || body?.message || (typeof error?.message === 'string' ? error.message : null) || fallback;
};

const unwrap = <T>(resp: any): T => {
    if (resp && resp.isSuccess === false) { throw {status: 200, error: resp, message: resp.message || 'The request was rejected.'}; }
    return resp?.data as T;
};

const params = (obj: Record<string, any>) =>
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== '').reduce((p, [k, v]) => p.set(k, String(v)), new HttpParams());

/** Tenant API `api/v1/finance/*` (and the accounting defaults / posting queue endpoints). */
@Injectable()
export class FinanceApiService extends CoreEndpointBase {
    private lookups$: Observable<FinanceLookups> | null = null;

    constructor(public override injector: Injector) { super(injector); }

    private get root() { return `${this.baseSectorAPIUrl}/v1`; }

    private get<T>(path: string, query: Record<string, any> = {}): Observable<T> {
        return this.httpClient.get(`${this.root}/${path}`, {...this.requestHeaders, params: params(query)}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.get<T>(path, query))));
    }

    private raw<T>(path: string, query: Record<string, any> = {}): Observable<T> {
        return this.httpClient.get<T>(`${this.root}/${path}`, {...this.requestHeaders, params: params(query)}).pipe(
            catchError(e => this.handleError(e, () => this.raw<T>(path, query))));
    }

    private send<T>(method: 'POST' | 'PUT' | 'DELETE', path: string, body: any = {}): Observable<T> {
        return this.httpClient.request(method, `${this.root}/${path}`, {...this.requestHeaders, body}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.send<T>(method, path, body))));
    }

    /** Message and document of a workflow action (post, approve, void, payment, send). */
    private action(path: string, body: any = {}): Observable<FinanceActionRes> {
        return this.httpClient.post(`${this.root}/${path}`, body, this.requestHeaders).pipe(
            map((r: any) => { unwrap(r); return {document: r.data as FinanceDoc, message: r.message as string}; }),
            catchError(e => this.handleError(e, () => this.action(path, body))));
    }

    // Lookups
    lookups(refresh = false) {
        if (refresh || !this.lookups$) { this.lookups$ = this.get<FinanceLookups>('finance/lookups').pipe(shareReplay({bufferSize: 1, refCount: false})); }
        return this.lookups$;
    }
    parties(kind: FinanceKind, search: string | null) { return this.get<PartyOption[]>('finance/parties', {kind, search}); }
    accountOptions(purpose: string | null, search: string | null) { return this.get<AccountOption[]>('finance/account-options', {purpose, search}); }
    openDocuments(kind: FinanceKind, partyAccountId: string) { return this.get<OpenDoc[]>('finance/documents/open', {kind, partyAccountId}); }
    dashboard() { return this.get<FinanceDashboard>('finance/dashboard'); }

    // Documents
    summary(kind: FinanceKind) { return this.get<FinanceKindSummary>('finance/documents/summary', {kind}); }
    document(id: string) { return this.get<FinanceDoc>(`finance/documents/${id}`); }
    create(body: FinanceDocInput) { return this.send<FinanceDoc>('POST', 'finance/documents', body); }
    update(id: string, body: FinanceDocInput) { return this.send<FinanceDoc>('PUT', `finance/documents/${id}`, body); }
    deleteDraft(id: string) { return this.send<void>('DELETE', `finance/documents/${id}`); }
    post(id: string) { return this.action(`finance/documents/${id}/post`); }
    approve(id: string, approve: boolean, note: string | null) { return this.action(`finance/documents/${id}/approve`, {approve, note}); }
    void(id: string, reason: string, date: string | null) { return this.action(`finance/documents/${id}/void`, {reason, date}); }
    duplicate(id: string) { return this.send<FinanceDoc>('POST', `finance/documents/${id}/duplicate`); }
    recordPayment(id: string, body: {date: string; amount: number; paymentModeId: number; bankAccountId: string | null; reference: string | null}) {
        return this.action(`finance/documents/${id}/payments`, body);
    }
    sendDocument(id: string, body: {to: string | null; subject: string | null; message: string | null}) { return this.action(`finance/documents/${id}/send`, body); }

    // Reports
    trialBalance(from: string | null, to: string | null) { return this.get<TrialBalance>('finance/reports/trial-balance', {from, to}); }
    profitLoss(from: string | null, to: string | null) { return this.get<ProfitLoss>('finance/reports/profit-loss', {from, to}); }
    balanceSheet(asOf: string | null) { return this.get<BalanceSheet>('finance/reports/balance-sheet', {asOf}); }
    ledger(accountId: string, from: string | null, to: string | null, skip: number, take: number) {
        return this.get<LedgerReport>('finance/reports/ledger', {accountId, from, to, skip, take});
    }

    // Chart of accounts
    chart() { return this.get<Chart>('finance/chart'); }
    createAccount(body: CoaAccountInput) { return this.send<CoaAccount>('POST', 'finance/chart/accounts', body); }
    updateAccount(id: string, body: CoaAccountInput) { return this.send<CoaAccount>('PUT', `finance/chart/accounts/${id}`, body); }
    deleteAccount(id: string) { return this.send<void>('DELETE', `finance/chart/accounts/${id}`); }
    createGroup(body: {name: string; code: string | null; parentId: string}) { return this.send<CoaGroup>('POST', 'finance/chart/groups', body); }
    renameGroup(id: string, body: {name: string; code: string | null; parentId: string}) { return this.send<CoaGroup>('PUT', `finance/chart/groups/${id}`, body); }

    // Settings
    saveTaxCode(id: string | null, body: TaxCodeInput) { return id ? this.send<TaxCodeRow>('PUT', `finance/settings/tax-codes/${id}`, body) : this.send<TaxCodeRow>('POST', 'finance/settings/tax-codes', body); }
    deleteTaxCode(id: string) { return this.send<void>('DELETE', `finance/settings/tax-codes/${id}`); }
    invoiceSettings() { return this.get<InvoiceSettings>('finance/settings/invoicing'); }
    saveInvoiceSettings(body: InvoiceSettings) { return this.send<InvoiceSettings>('PUT', 'finance/settings/invoicing', body); }
    saveDocumentType(id: number, body: DocumentTypeInput) { return this.send<DocumentTypeRow>('PUT', `finance/settings/document-types/${id}`, body); }
    accountingSettings() { return this.get<AccountingSettings>('org-admin/accounting'); }
    saveAccountingSettings(body: {functionalCurrency: string | null; accounts: Record<string, string | null>}) { return this.send<AccountingSettings>('PUT', 'org-admin/accounting', body); }

    // Posting queue
    postingSummary() { return this.get<PostingSummary>('vouchers/posting/summary'); }
    retryPosting(jobId: string) { return this.send<PostingJobRow>('POST', `vouchers/posting/jobs/${jobId}/retry`); }
    retryAllPostings() { return this.send<{requeued: number}>('POST', 'vouchers/posting/jobs/retry-failed'); }
    queueUnposted(voucherType: string | null) { return this.send<{queued: number}>('POST', 'vouchers/posting/unposted', {voucherType}); }

    // Recurring
    saveRecurring(id: string | null, body: RecurringInput) { return id ? this.send<RecurringRow>('PUT', `finance/recurring/${id}`, body) : this.send<RecurringRow>('POST', 'finance/recurring', body); }
    deleteRecurring(id: string) { return this.send<void>('DELETE', `finance/recurring/${id}`); }
    runRecurring(id: string) { return this.send<RecurringRow>('POST', `finance/recurring/${id}/run`); }
}

/** Paged `GET v1/finance/documents` (kind and filters in the query options). */
@Injectable()
export class FinanceDocGridService extends OrgResourceService<FinanceDocRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/finance/documents', FINANCE_DOC_SERIALIZER); }
}

/** Paged `GET v1/finance/reports/journals`. */
@Injectable()
export class JournalGridService extends OrgResourceService<JournalRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/finance/reports/journals', JOURNAL_SERIALIZER); }
}

/** Paged `GET v1/finance/settings/tax-codes`. */
@Injectable()
export class TaxCodeGridService extends OrgResourceService<TaxCodeRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/finance/settings/tax-codes', TAX_CODE_SERIALIZER); }
}

/** `GET v1/finance/settings/document-types`. */
@Injectable()
export class DocumentTypeGridService extends OrgResourceService<DocumentTypeRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/finance/settings/document-types', DOCUMENT_TYPE_SERIALIZER); }
}

/** Paged `GET v1/vouchers/posting/jobs`. */
@Injectable()
export class PostingJobGridService extends OrgResourceService<PostingJobRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/vouchers/posting/jobs', POSTING_JOB_SERIALIZER); }
}

/** Paged `GET v1/finance/recurring`. */
@Injectable()
export class RecurringGridService extends OrgResourceService<RecurringRow> {
    constructor(public override injector: Injector) { super(injector, 'v1/finance/recurring', RECURRING_SERIALIZER); }
}

/** A button pressed inside a grid cell (org-grid has no output for cells, so cells report here and the view listens). */
export interface FinanceCellAction { action: string; row: any; }

@Injectable()
export class FinanceGridEvents {
    readonly actions$ = new Subject<FinanceCellAction>();
    emit(action: string, row: any) { this.actions$.next({action, row}); }
}

export const FINANCE_SERVICES = [
    FinanceApiService, FinanceDocGridService, JournalGridService, TaxCodeGridService, DocumentTypeGridService, PostingJobGridService,
    RecurringGridService, FinanceGridEvents
];
