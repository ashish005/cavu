import {CanActivateFn, Router, Routes} from '@angular/router';
import {PricingInfoView} from "./views/pricing-info.view";
import {TrialBusinessView} from "./views/trial.component";
import {TrialBusinessAPIResolver} from "./services";
import {CoreLayout} from "./layouts/core.layout";
import {inject} from "@angular/core";
import {AuthService} from "@app-third-party";
import {map, take} from "rxjs";
import {HomeView} from "./views/home.view";
import {AppSetupService} from "@app-global";
import {AboutView} from "./views/about.view";
import {VisionView} from "./views/vision.view";
import {WhyweView} from "./views/whywe.view";
import {ContactView} from "./views/contact.view";

export const APP_COMPONENT = [
  HomeView, AboutView, VisionView, WhyweView, ContactView, PricingInfoView, TrialBusinessView
];

export const appLoggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated$.pipe(
      take(1), // Important: take only the first value and complete the observable.
      map(isAuthenticated => {
        if (!isAuthenticated) { return true; }
        else {
          // Optional: Redirect the user if they are not authenticated.
          return router.createUrlTree(['/app']);
        }
      })
    );
};

export const companyRouteGuard: CanActivateFn = (route, state) => {
  const setupService = inject(AppSetupService);
  return setupService.appSetup?.sectorMasterType === 'COMPANY';
};

export const routes: Routes = [
    {
        path: '', component: CoreLayout, canActivate: [ appLoggedInGuard ],
        children: [
          { path: '', redirectTo: 'home', pathMatch: 'full'},
            {path: 'home', component: HomeView},
            {path: 'about', component: AboutView},
            {path: 'vision', component: VisionView},
            {path: 'whywe', component: WhyweView},
            {path: 'contact', component: ContactView},
            {path: 'pricing', canActivate: [ companyRouteGuard ], resolve: {items: TrialBusinessAPIResolver}, component: PricingInfoView},
            {path: 'trial', canActivate: [ companyRouteGuard ], resolve: {items: TrialBusinessAPIResolver}, component: TrialBusinessView}
        ]
    }
];
