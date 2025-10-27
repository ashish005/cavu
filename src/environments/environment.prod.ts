const svcUrl = 'https://connect.enrator.com';
export const environment = {
    production: true,
    identityServer: {
      issuer: 'https://connect.enrator.com', // For IdentityServer/Authorization Server API. You can set to null if same as baseUrl
    },
  authBaseUrl: svcUrl
};
