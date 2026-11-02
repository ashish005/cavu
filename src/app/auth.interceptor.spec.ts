import {AuthInterceptor} from "./auth.interceptor";
import {AppSetupService} from "@app-global";
import {HttpRequest, HttpHandler, HttpEvent} from "@angular/common/http";
import {of} from "rxjs";

describe("AuthInterceptor", () => {
  let interceptor: AuthInterceptor;
  let next: jasmine.SpyObj<HttpHandler>;

  function buildSetup(overrides: any = {}) {
    return {
      id: "org-123",
      orgConfig: {countryId: "US", timeZone: "UTC"},
      branches: [{id: "branch-1", isHeadBranch: true}],
      ...overrides
    };
  }

  beforeEach(() => {
    next = jasmine.createSpyObj("HttpHandler", ["handle"]);
    next.handle.and.returnValue(of({} as HttpEvent<any>));
  });

  it("passes request through unchanged when no app setup", () => {
    const appSetupService: any = {appSetup: null};
    interceptor = new AuthInterceptor(appSetupService);
    const req = new HttpRequest("GET", "/api/test");
    interceptor.intercept(req, next).subscribe();
    expect(next.handle).toHaveBeenCalledWith(req);
    expect(req.headers.get("X-Tenant-Id")).toBeNull();
  });

  it("sets tenant headers when app setup is present", () => {
    const appSetupService: any = {appSetup: buildSetup()};
    interceptor = new AuthInterceptor(appSetupService);
    const req = new HttpRequest("GET", "/api/test");
    interceptor.intercept(req, next).subscribe();

    const handledReq = next.handle.calls.mostRecent().args[0] as HttpRequest<any>;
    expect(handledReq.headers.get("X-Tenant-Id")).toBe("org-123");
    expect(handledReq.headers.get("X-Country-Id")).toBe("US");
    expect(handledReq.headers.get("X-Branch-Id")).toBe("branch-1");
    expect(handledReq.headers.has("X-Timezone-Id")).toBeTrue();
    expect(handledReq.headers.has("X-Timezone-Browser")).toBeTrue();
  });

  it("uses head branch id when present", () => {
    const appSetupService: any = {appSetup: buildSetup({
      branches: [{id: "other", isHeadBranch: false}, {id: "head-1", isHeadBranch: true}]
    })};
    interceptor = new AuthInterceptor(appSetupService);
    const req = new HttpRequest("GET", "/api/test");
    interceptor.intercept(req, next).subscribe();

    const handledReq = next.handle.calls.mostRecent().args[0] as HttpRequest<any>;
    expect(handledReq.headers.get("X-Branch-Id")).toBe("head-1");
  });

  it("falls back to app id when no head branch", () => {
    const appSetupService: any = {appSetup: buildSetup({branches: []})};
    interceptor = new AuthInterceptor(appSetupService);
    const req = new HttpRequest("GET", "/api/test");
    interceptor.intercept(req, next).subscribe();

    const handledReq = next.handle.calls.mostRecent().args[0] as HttpRequest<any>;
    expect(handledReq.headers.get("X-Branch-Id")).toBe("org-123");
  });
});
