import {Injectable} from "@angular/core";
import {HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AppSetupService} from "@app-global";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private ignoredUrls: string[] = [
    '/appSetup/pre', '/trialLookup/', '/software/plans/'
  ];
  constructor(private appSetupService: AppSetupService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let headers = req.headers;
    // const token = this.auth.getAccessToken();
    // if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    if (this.appSetupService.appSetup?.id) {
      const { id, orgConfig, branches } = this.appSetupService.appSetup;
      const { countryId, timeZone } = orgConfig;

      const branch = (branches || []).find(r => r.isHeadBranch) || { id };
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // e.g. "Asia/Kolkata"
      headers = headers.set('X-Tenant-Id', id);
      headers = headers.set('X-Timezone-Id', `${timeZone}`);
      headers = headers.set('X-Timezone-Browser', timezone);
      headers = headers.set('X-Country-Id', `${countryId}`);
      headers = headers.set('X-OrgBranch-Id', `${branch?.id}`);
    }

    if (this.ignoredUrls.some(url => req.url.includes(url))) {
      // ✅ Clone without Authorization header
      const cleanReq = req.clone({
        headers: req.headers.delete('Authorization')
      });
      return next.handle(cleanReq);
    }
    // 3️⃣ Clone and continue
    const clonedReq = req.clone({ headers });
    return next.handle(clonedReq);
  }
}
