import {Injectable, Injector} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {Observable, catchError, map, shareReplay} from "rxjs";
import {CoreEndpointBase} from "@app-global";
import {
    AgingReport, CountryRules, Duplicate, Form1099Report, OrgLookup, Page, Party, PartyLookups, PartyPick, PartyRole, PartyRow, PartySummary, PaymentTerm, Statement
} from "../domains/party.models";

export const errorMessageOf = (error: any, fallback: string): string => {
    const body = error?.error;
    const validation = body?.errors && typeof body.errors === 'object' ? Object.values(body.errors).flat().filter(Boolean).join(' ') : null;
    return validation || body?.detail || body?.message || error?.message || fallback;
};

const unwrap = <T>(resp: any): T => {
    if (resp && resp.isSuccess === false) { throw {status: 200, error: resp, message: resp.message || 'The request was rejected.'}; }
    return resp?.data as T;
};

const toParams = (query: object): HttpParams => {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(query)) {
        if (v !== null && v !== undefined && v !== '') { params = params.set(k, String(v)); }
    }
    return params;
};

const ROLE_PATH: Record<PartyRole, string> = {customer: 'customers', vendor: 'vendors', employee: 'employees'};

/** Tenant API `api/v1/parties/*`. */
@Injectable()
export class PartyApiService extends CoreEndpointBase {
    private lookups$: Observable<PartyLookups> | null = null;

    constructor(public override injector: Injector) { super(injector); }

    private get url() { return `${this.baseSectorAPIUrl}/v1/parties`; }

    private get<T>(path: string, query: object = {}): Observable<T> {
        return this.httpClient.get(`${this.url}/${path}`, {...this.requestHeaders, params: toParams(query)}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.get<T>(path, query))));
    }

    private send<T>(method: 'POST' | 'PUT' | 'DELETE', path: string, body: any = {}, query: object = {}): Observable<T> {
        return this.httpClient.request(method, `${this.url}/${path}`, {...this.requestHeaders, body, params: toParams(query)}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.send<T>(method, path, body, query))));
    }

    lookups(refresh = false) {
        if (refresh || !this.lookups$) { this.lookups$ = this.get<PartyLookups>('lookups').pipe(shareReplay({bufferSize: 1, refCount: false})); }
        return this.lookups$;
    }

    list(role: PartyRole, query: {search?: string | null; status?: string | null; withBalance?: boolean; sort?: string; departmentId?: string | null; skip?: number; take?: number}) {
        return this.get<Page<PartyRow>>(ROLE_PATH[role], query);
    }
    get1(role: PartyRole, id: string) { return this.get<Party>(`${ROLE_PATH[role]}/${id}`); }
    create(role: PartyRole, party: Party, opts: {existingPartyId?: string | null; allowDuplicate?: boolean} = {}) {
        return this.send<Party>('POST', ROLE_PATH[role], party, opts);
    }
    update(role: PartyRole, id: string, party: Party) { return this.send<Party>('PUT', `${ROLE_PATH[role]}/${id}`, party); }
    setStatus(role: PartyRole, id: string, status: string, reason?: string | null) { return this.send<Party>('POST', `${ROLE_PATH[role]}/${id}/status`, {status, reason}); }
    portalAccess(role: PartyRole, id: string, roleCode?: string | null) { return this.send<Party>('POST', `${ROLE_PATH[role]}/${id}/portal-access`, {roleCode}); }
    summary(role: PartyRole, id: string) { return this.get<PartySummary>(`${ROLE_PATH[role]}/${id}/summary`); }
    statement(role: PartyRole, id: string, from: string, to: string) { return this.get<Statement>(`${ROLE_PATH[role]}/${id}/statement`, {from, to}); }
    aging(role: PartyRole, asOf?: string | null, search?: string | null) { return this.get<AgingReport>(`${ROLE_PATH[role]}/aging`, {asOf, search}); }
    form1099(year: number) { return this.get<Form1099Report>('vendors/1099', {year}); }

    countryRules(country: string) { return this.get<CountryRules>(`country-rules/${country}`); }
    search(q: string, role?: string | null) { return this.get<PartyPick[]>('search', {q, role, take: 15}); }
    duplicates(q: {email?: string | null; taxIdType?: string | null; taxIdValue?: string | null; country?: string | null; excludePartyId?: string | null}) {
        return this.get<Duplicate[]>('duplicates', q);
    }
    reveal(partyId: string, kind: 'taxId' | 'bankAccount', itemId: string) {
        return this.send<{value: string}>('POST', `${partyId}/reveal`, {kind, itemId}).pipe(map(r => r.value));
    }

    paymentTerms() { return this.get<PaymentTerm[]>('payment-terms'); }
    saveTerm(term: PaymentTerm) { this.lookups$ = null; return term.id ? this.send<PaymentTerm>('PUT', `payment-terms/${term.id}`, term) : this.send<PaymentTerm>('POST', 'payment-terms', term); }
    deleteTerm(id: string) { this.lookups$ = null; return this.send<void>('DELETE', `payment-terms/${id}`); }
    orgLookups(category: string) { return this.get<OrgLookup[]>(`lookups/${category}`); }
    saveLookup(category: string, row: OrgLookup) {
        this.lookups$ = null;
        return row.id ? this.send<OrgLookup>('PUT', `lookups/${category}/${row.id}`, row) : this.send<OrgLookup>('POST', `lookups/${category}`, row);
    }
    deleteLookup(category: string, id: string) { this.lookups$ = null; return this.send<void>('DELETE', `lookups/${category}/${id}`); }
}
