import {getAuthConfig} from "./auth-config";
import {environment} from "@app-environments";

describe("getAuthConfig", () => {
  const realHostname = window.location.hostname;
  const realOrigin = window.location.origin;

  afterEach(() => {
    // restore environment defaults mutated by tests
    environment.identityServer.issuer = null;
    environment.identityServer.clientId = "localhost-spa";
  });

  it("builds a config with tenant-scoped issuer and redirect URIs", () => {
    const injector: any = {};
    const config = getAuthConfig(injector);

    expect(config.issuer).toBe(environment.authBaseUrl);
    expect(config.clientId).toBe("localhost-spa");
    expect(config.responseType).toBe("code");
    expect(config.scope).toContain("openid");
    expect(config.scope).toContain("offline_access");
    expect(config.redirectUri).toBe(`${realOrigin}/login-callback`);
    expect(config.postLogoutRedirectUri).toBe(realOrigin);
    expect(config.requireHttps).toBeTrue();
    expect(config.skipIssuerCheck).toBeFalse();
    expect(config.clearHashAfterLogin).toBeTrue();
  });

  it("uses the configured identityServer issuer and clientId when set", () => {
    environment.identityServer.issuer = "https://auth.example.com";
    environment.identityServer.clientId = "acme-spa";

    const injector: any = {};
    const config = getAuthConfig(injector);

    expect(config.issuer).toBe("https://auth.example.com");
    expect(config.clientId).toBe("acme-spa");
  });

  it("derives redirectUri and postLogoutRedirectUri from the current host origin", () => {
    const injector: any = {};
    const config = getAuthConfig(injector);

    expect(config.redirectUri).toBe(`${realOrigin}/login-callback`);
    expect(config.silentRefreshRedirectUri).toBe(`${realOrigin}/silent-refresh.html`);
    expect(config.postLogoutRedirectUri).toBe(realOrigin);
  });

  it("falls back to authBaseUrl when issuer is not configured", () => {
    const origIssuer = environment.identityServer.issuer;
    environment.identityServer.issuer = null;
    try {
      const injector: any = {};
      const config = getAuthConfig(injector);
      expect(config.issuer).toBe(environment.authBaseUrl);
    } finally {
      environment.identityServer.issuer = origIssuer;
    }
  });
});
