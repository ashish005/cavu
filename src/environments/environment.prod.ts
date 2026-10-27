export const environment = {
    production: true,
    identityServer: {
      // Set to null to use current host as issuer (multi-tenant mode)
      // Each tenant subdomain gets its own issuer for token isolation
      issuer: null as string | null,
      clientId: 'localhost-spa'
    },
  authBaseUrl: 'https://auth.enrator.com',
  tenantUrl: 'https://api.enrator.com'
};
