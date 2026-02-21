import { AuthConfig } from 'angular-oauth2-oidc';
import {environment} from "@app-environments";
import {Injector} from "@angular/core";
//import {AppSetupService} from "@app-global";

export function getAuthConfig(injector: Injector): AuthConfig {
  //const setup= injector.get(AppSetupService);
  //const { id } = appSetupSvc.appSetup;
  let issuer = environment.identityServer.issuer;// IdentityServer URL
  const origin = window.location.origin;
  const authCodeFlowConfig: AuthConfig = {
    issuer: issuer,
    redirectUri: origin,// `${origin}/login-callback`,
    postLogoutRedirectUri: origin,
    clientId: `localhost-spa`,
    responseType: 'code',
    scope: 'openid profile email offline_access api',

    showDebugInformation: !environment.production,
    clearHashAfterLogin: true,
    skipIssuerCheck: false,

    disableAtHashCheck: true,
    timeoutFactor: 0.90,
    oidc: true,
    sessionChecksEnabled: false,
    silentRefreshRedirectUri: `${origin}/silent-refresh.html`,
    useSilentRefresh: true,
    requireHttps: environment.production
  };

  return authCodeFlowConfig;
}
