import {Injectable, Injector} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {Observable, catchError, map} from "rxjs";
import {CoreEndpointBase} from "@app-global";
import {Page, Team, TeamLookups, TeamMemberRow, TeamSummary} from "./team.models";

const unwrap = <T>(resp: any): T => {
    if (resp && resp.isSuccess === false) { throw {status: 200, error: resp, message: resp.message || 'The request was rejected.'}; }
    return resp?.data as T;
};

const params = (obj: Record<string, any>) =>
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== '').reduce((p, [k, v]) => p.set(k, String(v)), new HttpParams());

/** The API's message (validation, 403, 422 business rule) or a fallback. */
export const teamErrorOf = (error: any, fallback: string): string => {
    const body = error?.error;
    const validation = body?.errors && typeof body.errors === 'object' ? Object.values(body.errors).flat().filter(Boolean).join(' ') : null;
    return validation || body?.detail || body?.message || (typeof error?.message === 'string' ? error.message : null) || fallback;
};

/** Tenant API `api/v1/teams` (organisation-wide; administrators edit). */
@Injectable()
export class TeamApiService extends CoreEndpointBase {
    constructor(public override injector: Injector) { super(injector); }

    private get root() { return `${this.baseSectorAPIUrl}/v1/teams`; }

    private get<T>(path: string, query: Record<string, any> = {}): Observable<T> {
        return this.httpClient.get(`${this.root}${path ? '/' + path : ''}`, {...this.requestHeaders, params: params(query)}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.get<T>(path, query))));
    }

    private send<T>(method: 'POST' | 'PUT' | 'DELETE', path: string, body: any = {}, query: Record<string, any> = {}): Observable<T> {
        return this.httpClient.request(method, `${this.root}${path ? '/' + path : ''}`, {...this.requestHeaders, body, params: params(query)}).pipe(
            map(r => unwrap<T>(r)), catchError(e => this.handleError(e, () => this.send<T>(method, path, body, query))));
    }

    lookups() { return this.get<TeamLookups>('lookups'); }
    teams() { return this.get<TeamSummary[]>(''); }
    team(id: string) { return this.get<Team>(id); }
    save(team: Team) { return team.id ? this.send<Team>('PUT', team.id, team) : this.send<Team>('POST', '', team); }
    delete(id: string) { return this.send<void>('DELETE', id); }
    /** Who a (possibly unsaved) definition includes right now. */
    preview(team: Team, query: {skip: number; take: number; search: string | null}) { return this.send<Page<TeamMemberRow>>('POST', 'preview', team, query); }
}
