// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const svcUrl = 'http://localhost:8082';
export const environment = {
  production: true,
  identityServer: {
    issuer: 'http://localhost:8082', // For IdentityServer/Authorization Server API. You can set to null if same as baseUrl
  },
  authBaseUrl: svcUrl
};
