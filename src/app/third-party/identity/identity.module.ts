import { ModuleWithProviders, NgModule, Optional, SkipSelf, inject, provideAppInitializer } from '@angular/core';
import {CanActivateFn, Router, RouterModule, Routes} from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {AuthConfig, OAuthModule, OAuthModuleConfig, OAuthStorage} from "angular-oauth2-oidc";
import {LoginCallbackView} from "./views/login-callback.view";
import {LogoutCallbackView} from "./views/logout-callback.view";
import {getAuthConfig} from "./auth-config";
import {AuthService} from "./auth.service";
import {AuthGuard} from "./guard/auth-guard.service";

export const AUTH_VIEWS = [];
export const AUTH_ROUTES: Routes = [
  { path: 'login-callback', component: LoginCallbackView },
  { path: 'logout-callback', component: LogoutCallbackView }
];

// We need a factory since localStorage is not available at AOT build time
export function storageFactory(): OAuthStorage { return localStorage; }
export function authAppInitializerFactory(authService: AuthService): () => Promise<void> { return () => authService.runInitialLoginSequence(); }

export const authModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    sendAccessToken: true,
  }
};

@NgModule({
  declarations: [AUTH_VIEWS],
  imports: [OAuthModule.forRoot(), RouterModule.forRoot(AUTH_ROUTES) ],
  providers: [AuthService, AuthGuard, provideHttpClient(withInterceptorsFromDi())],
  exports: []
})
export class IdentityModule {
  static forRoot(): ModuleWithProviders<IdentityModule> {
    return {
      ngModule: IdentityModule,
      providers: [
        provideAppInitializer(() => {
          const initializerFn = (authAppInitializerFactory)(inject(AuthService));
          return initializerFn();
        }),
        { provide: AuthConfig, useValue: getAuthConfig() },
        { provide: OAuthModuleConfig, useValue: authModuleConfig },
        { provide: OAuthStorage, useFactory: storageFactory },
      ]
    };
  }
  constructor(@Optional() @SkipSelf() parentModule: IdentityModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
