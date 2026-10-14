import {Injectable, Injector} from "@angular/core";
import {BehaviorSubject, Observable, catchError, map, of, shareReplay, tap} from "rxjs";
import {CoreEndpointBase} from "../../endpoint-base.service";
import {TenantEntitlements, TenantEntitlementsResponse, isModuleEnabled} from "./entitlement.model";

/**
 * Plan modules, seat usage and access level of the signed-in organisation (tenant API, api/v1/subscription/entitlements).
 * The UI uses it to hide what the plan does not include; the API enforces the same rules on its side.
 */
@Injectable({ providedIn: 'root' })
export class EntitlementService extends CoreEndpointBase {
    private request$: Observable<TenantEntitlementsResponse | null> | null = null;
    private readonly current = new BehaviorSubject<TenantEntitlementsResponse | null>(null);

    /** Emits after every load; null until the first load and when loading failed. */
    readonly changes$ = this.current.asObservable();

    constructor(protected override injector: Injector) { super(injector); }

    get snapshot(): TenantEntitlementsResponse | null { return this.current.value; }

    /** Cached until `refresh` is passed, e.g. after a purchase. A failed load resolves to null and is retried next time. */
    load(refresh = false): Observable<TenantEntitlementsResponse | null> {
        if (refresh || !this.request$) {
            this.request$ = this.httpClient.get(`${this.baseSectorAPIUrl}/v1/subscription/entitlements`, this.requestHeaders).pipe(
                map((r: any) => (r?.isSuccess === false ? null : r?.data ?? null) as TenantEntitlementsResponse | null),
                catchError(error => this.handleError(error, () => this.load(true))),
                catchError(() => {
                    this.request$ = null;
                    return of(null);
                }),
                tap(result => this.current.next(result)),
                shareReplay({bufferSize: 1, refCount: false})
            );
        }
        return this.request$;
    }

    hasModule(moduleCode: string): boolean {
        return isModuleEnabled(this.entitlements, moduleCode);
    }

    /** True once the API reported no valid license; writes are refused until renewal. */
    get isReadOnly(): boolean {
        return this.entitlements?.access === 'ReadOnly';
    }

    private get entitlements(): TenantEntitlements | null {
        return this.current.value?.entitlements ?? null;
    }
}
