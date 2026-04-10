import { AuthConfig } from 'angular-oauth2-oidc';
import {environment} from "@app-environments";
import {Injector} from "@angular/core";
//import {AppSetupService} from "@app-global";

export function getAuthConfig(injector: Injector): AuthConfig {
  // Extract tenant/orgId from subdomain (e.g., org1.localhost -> org1)
  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0];
  
  // Use current host for multi-tenant issuer (e.g., https://org1.localhost/)
  const origin = window.location.origin;
  
  // Use explicit issuer from environment, or fallback to authBaseUrl (IdentityServer URL)
  const issuer = environment.identityServer?.issuer || environment.authBaseUrl;
  
  // Use single client_id for all tenants - tenant differentiation via domain/subdomain
  const clientId = environment.identityServer?.clientId || 'localhost-spa';
  
  // Validate required configuration
  if (!issuer) {
    throw new Error('OIDC issuer is required. Set identityServer.issuer in environment or ensure window.location.origin is valid.');
  }
  if (!clientId) {
    throw new Error('OIDC clientId is required. Set identityServer.clientId in environment or use subdomain-based client_id.');
  }
  
  const authCodeFlowConfig: AuthConfig = {
    issuer: issuer,
    redirectUri: `${origin}/login-callback`,
    postLogoutRedirectUri: origin,
    clientId: clientId,
    responseType: 'code',
    scope: 'openid profile email offline_access api',

    // Production: disable debug info, enable strict validation
    showDebugInformation: !environment.production,
    clearHashAfterLogin: true,
    skipIssuerCheck: false,

    // Security settings
    disableAtHashCheck: false, // Enable at_hash validation in production
    timeoutFactor: 0.90,
    oidc: true,
    sessionChecksEnabled: false,
    silentRefreshRedirectUri: `${origin}/silent-refresh.html`,
    useSilentRefresh: true,
    requireHttps: environment.production,
    
    // Additional production security
    strictDiscoveryDocumentValidation: true,
    customQueryParams: {
      // Pass tenant hint to IdentityServer
      tenant: clientId
    }
  };

  return authCodeFlowConfig;
}
