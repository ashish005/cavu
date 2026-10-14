import {inject} from "@angular/core";
import {CanMatchFn, Route, Router} from "@angular/router";
import {map} from "rxjs";
import {EntitlementService} from "./entitlement.service";
import {isModuleEnabled} from "./entitlement.model";

/**
 * Lets a route match only when the plan includes `data.module` (an application module code such as 'FIN').
 * Routes without `data.module` always match. If entitlements cannot be loaded the route matches and the API decides.
 */
export const moduleGuard: CanMatchFn = (route: Route) => {
    const moduleCode: string | undefined = route.data?.['module'];
    if (!moduleCode) {
        return true;
    }

    const router = inject(Router);
    return inject(EntitlementService).load().pipe(
        map(result => isModuleEnabled(result?.entitlements ?? null, moduleCode)
            || router.createUrlTree(['/admin', 'subscription', 'payment'], {queryParams: {module: moduleCode}}))
    );
};
