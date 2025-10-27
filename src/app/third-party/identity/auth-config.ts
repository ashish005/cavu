import { AuthConfig } from 'angular-oauth2-oidc';
import {environment} from "@app-environments";

export function getAuthConfig(): AuthConfig {
  let issuer = environment.identityServer.issuer;// IdentityServer URL
  const origin = window.location.origin;
  const authCodeFlowConfig: AuthConfig = {
    issuer: issuer,
    redirectUri: origin,// `${origin}/login-callback`,
    postLogoutRedirectUri: origin,
    clientId: `localhost-spa`,
    responseType: 'code',
    scope: 'openid profile email offline_access api',
    showDebugInformation: true,
    clearHashAfterLogin: true,
    skipIssuerCheck: false,

    disableAtHashCheck: true, // PKCE handles integrity

    // ✅ Ensure tokens refresh properly
    timeoutFactor: 0.90,
    oidc: true,

    // 👇 Required for iframe session checks
    sessionChecksEnabled: false,
    silentRefreshRedirectUri: `${origin}/silent-refresh.html`,

    // 👇 If you use multiple tenant subdomains
    useSilentRefresh: true, // Needed for Code Flow to suggest using iframe-based refreshes
    requireHttps: false
  };

  return authCodeFlowConfig;
}
