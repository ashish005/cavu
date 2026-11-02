import {AuthService} from "./auth.service";
import {OAuthService} from "angular-oauth2-oidc";
import {Router} from "@angular/router";
import {Subject} from "rxjs";

describe("AuthService", () => {
  let authService: AuthService;
  let oauthService: jasmine.SpyObj<OAuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    oauthService = jasmine.createSpyObj("OAuthService", [
      "configure", "loadDiscoveryDocumentAndTryLogin", "loadDiscoveryDocument",
      "initLoginFlow", "initCodeFlow", "logOut", "refreshToken", "loadUserProfile",
      "tryLogin", "setupAutomaticSilentRefresh", "hasValidAccessToken", "getAccessToken",
      "getRefreshToken", "getIdentityClaims", "getIdToken"
    ]);
    oauthService.discoveryDocumentLoaded = false;
    oauthService.hasValidAccessToken.and.returnValue(false);
    oauthService.getIdentityClaims.and.returnValue({});
    oauthService.events = new Subject();
    router = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    authService = new AuthService(oauthService, router);
  });

  it("exposes identity claim getters", () => {
    oauthService.getIdentityClaims.and.returnValue({
      sub: "user-1",
      orgId: "org-1",
      email: "user@example.com",
      mobile: "1234567890",
      preferred_username: "user"
    });

    expect(authService.userId).toBe("user-1");
    expect(authService.orgId).toBe("org-1");
    expect(authService.email).toBe("user@example.com");
    expect(authService.mobile).toBe("1234567890");
    expect(authService.username).toBe("user");
  });

  it("delegates hasValidToken to oauthService", () => {
    oauthService.hasValidAccessToken.and.returnValue(true);
    expect(authService.hasValidToken()).toBeTrue();
    expect(oauthService.hasValidAccessToken).toHaveBeenCalled();
  });

  it("login loads discovery doc then starts login flow", async () => {
    oauthService.loadDiscoveryDocument.and.returnValue(Promise.resolve({} as any));
    await authService.login("/dashboard");
    expect(oauthService.loadDiscoveryDocument).toHaveBeenCalled();
    expect(oauthService.initLoginFlow).toHaveBeenCalledWith("/dashboard");
  });

  it("logout calls oauthService logOut", () => {
    authService.logout();
    expect(oauthService.logOut).toHaveBeenCalled();
  });

  it("refresh delegates to oauthService refreshToken", () => {
    oauthService.refreshToken.and.returnValue(Promise.resolve({} as any));
    authService.refresh();
    expect(oauthService.refreshToken).toHaveBeenCalled();
  });
});
