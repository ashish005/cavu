// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  identityServer: {
    // Set to null to use current host as issuer (multi-tenant mode)
    // Each tenant subdomain gets its own issuer for token isolation
    issuer: null as string | null,
    clientId: 'localhost-spa'
  },
  authBaseUrl: 'http://localhost:8090',
  tenantUrl: 'http://localhost:8080',
  leadUrl: 'http://localhost:5260'
};
