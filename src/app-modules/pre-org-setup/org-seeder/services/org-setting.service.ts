import {Injectable, Injector} from "@angular/core";
import {Observable, catchError, map} from "rxjs";
import {OrgResourceService} from "@app-global";
import {OrgSetting, OrgSettingSerializer} from "../domains/org-setting.serializer";

export interface TenantSeedRequest {
    orgId: string;
    orgBranchId: string;
    applyMasterSeed: boolean;
    applyDemoSeed: boolean;
}

export type SeedStatus = 'Pending' | 'Queued' | 'Processing' | 'Completed' | 'Failed';

export interface BranchSeedStatus {
    orgBranchId: string;
    status: SeedStatus;
    applyMasterSeed: boolean;
    applyDemoSeed: boolean;
    attemptCount: number;
    requestedAt: string | null;
    completedAt: string | null;
    nextAttemptAt: string | null;
    lastError: string | null;
}

/**
 * The APIs answer HTTP 200 with `isSuccess: false` on validation failures,
 * so a 200 alone does not mean the call worked.
 */
const ensureSuccess = <T = any>(resp: any): T => {
    if (resp && resp.isSuccess === false) {
        throw {status: 200, error: resp, message: resp.message || 'Request was rejected by the server.'};
    }
    return resp;
};

@Injectable()
export class OrgSettingService extends OrgResourceService<OrgSetting> {
    constructor(public override injector: Injector) {
        // Tenant API (environment.tenantUrl): api/v1/orgSetting
        super(injector, 'v1/orgSetting', new OrgSettingSerializer());
    }

    updateGeneralOrgConfig(unitConfigId: number, data: any): Observable<any> {
        return this.httpClient.patch(`${this.viewUrl}/${unitConfigId}/general`, data, this.requestHeaders).pipe(
            map(ensureSuccess),
            catchError(error => this.handleError(error, () => this.updateGeneralOrgConfig(unitConfigId, data)))
        );
    }

    updateUnitConfigSetup(unitConfigId: number, data: any): Observable<any> {
        return this.httpClient.patch(`${this.viewUrl}/${unitConfigId}/setup`, data, this.requestHeaders).pipe(
            map(ensureSuccess),
            catchError(error => this.handleError(error, () => this.updateUnitConfigSetup(unitConfigId, data)))
        );
    }

    /** Queues the branch for seeding; the worker applies it asynchronously. */
    queueTenantSeed(req: TenantSeedRequest): Observable<any> {
        return this.httpClient.post(`${this.baseSectorAPIUrl}/v1/seed/tenant`, req, this.requestHeaders).pipe(
            map(ensureSuccess),
            catchError(error => this.handleError(error, () => this.queueTenantSeed(req)))
        );
    }

    /** Current seed state of a branch, as written by the API and the seed worker. */
    getSeedStatus(orgBranchId: string): Observable<BranchSeedStatus> {
        return this.httpClient.get(`${this.baseSectorAPIUrl}/v1/seed/${orgBranchId}/status`, this.requestHeaders).pipe(
            map(ensureSuccess),
            map((r: any) => r.data as BranchSeedStatus),
            catchError(error => this.handleError(error, () => this.getSeedStatus(orgBranchId)))
        );
    }

    /**
     * Marks the branch seed as Completed. Only call this when seeding was skipped: the worker
     * only picks up `Pending` branches, so calling it after queueing would cancel the seed.
     */
    markSeedSuccess(orgBranchId: string): Observable<any> {
        return this.httpClient.put(`${this.baseSectorAPIUrl}/v1/seed/success`, {orgBranchId}, this.requestHeaders).pipe(
            map(ensureSuccess),
            catchError(error => this.handleError(error, () => this.markSeedSuccess(orgBranchId)))
        );
    }
}

export const errorMessageOf = (error: any, fallback: string): string =>
    error?.error?.message || error?.error?.Message || error?.message || fallback;
