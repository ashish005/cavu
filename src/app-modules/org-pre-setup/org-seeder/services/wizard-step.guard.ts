import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, Router} from "@angular/router";
import {OrgWizardService, WizardStepKey} from "./org-wizard.service";

/**
 * Blocks deep links / manual URL edits to steps whose prerequisites are not done,
 * redirecting to the furthest step the user can actually work on.
 */
export const wizardStepGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const wizard = inject(OrgWizardService);
    const router = inject(Router);
    const key = route.routeConfig?.path as WizardStepKey;

    if (wizard.isAccessible(key)) {
        wizard.setCurrent(key);
        return true;
    }

    const parentSegments = route.pathFromRoot
        .slice(0, -1)
        .flatMap(r => r.url.map(s => s.path));
    return router.createUrlTree(['/', ...parentSegments, wizard.firstOpenStep]);
};
