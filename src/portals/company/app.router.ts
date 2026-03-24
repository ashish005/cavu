import {CanActivateFn, Router, Routes} from '@angular/router';
import {PricingInfoView} from "./views/pricing-info.view";
import {TrialBusinessView} from "./views/trial.view";
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
            {path: 'home', component: HomeView, data: { title: 'Home - EnRator | Digital Transformation & IT Solutions' }},
            {path: 'about', component: AboutView, data: { title: 'About Us - EnRator | Our Company & Team' }},
            {path: 'vision', component: VisionView, data: { title: 'Vision & Mission - EnRator | Our Core Values' }},
            {path: 'whywe', component: WhyweView, data: { title: 'Why Choose Us - EnRator | Excellence & Expertise' }},
            {path: 'contact', component: ContactView, data: { title: 'Contact Us - EnRator | Get In Touch' }},
            {path: 'pricing', canActivate: [ companyRouteGuard ], resolve: {items: TrialBusinessAPIResolver}, component: PricingInfoView, data: { title: 'Pricing - EnRator | Plans & Pricing' }},
            {path: 'trial', canActivate: [ companyRouteGuard ], resolve: {items: TrialBusinessAPIResolver}, component: TrialBusinessView, data: { title: 'Free Trial - EnRator | Start Your Journey' }}
        ]
    }
];
