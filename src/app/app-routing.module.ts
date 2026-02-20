import {APP_INITIALIZER, inject, NgModule} from '@angular/core';
import {CanActivateFn, Router, RouterModule, Routes} from '@angular/router';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {THIRD_PARTY_ROUTES, THIRD_PARTY_SERVICES, THIRD_PARTY_VIEWS, AuthGuard} from "./third-party/index";
import {NotFoundComponent} from "./not-found.component";
import {AppSetupService, GlobalModule} from "@app-global";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "./auth.interceptor";

function StartupServiceFactory(setupService: AppSetupService) { return () => setupService.loadApp(); }

export const appSetupGuard: CanActivateFn = (route, state) => {
  const setupService = inject(AppSetupService);
  const router = inject(Router);
  if (setupService.hasAppSetup()) {
    return true;
  }
  // Redirect to the login page if not authenticated
  return router.createUrlTree(['/company/trial']);
};

const routes: Routes = [
  //{ path: '', redirectTo: 'docusign-sign', pathMatch: 'full' },
  {
    path: 'app',
    canActivate: [ AuthGuard, appSetupGuard ],
    //canLoad: [ AuthGuard, appSetupGuard ],
    loadChildren: () => import('portals/portal-module').then(m => m.PortalModule)
  },
  {
    path: '',
    loadChildren: () => import('portals/company').then(m => m.SetupModule)
  },
  ...THIRD_PARTY_ROUTES,
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [NotFoundComponent],
  exports: [RouterModule],
  imports: [
    THIRD_PARTY_VIEWS,
    RouterModule.forRoot(routes),
    FormsModule, ReactiveFormsModule, CommonModule
  ],
  providers: [
    THIRD_PARTY_SERVICES,
    { provide: APP_INITIALIZER, useFactory: StartupServiceFactory, deps: [AppSetupService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true   // ✅ ensures multiple interceptors can coexist
    }
  ]
})
export class AppRoutingModule {
}
