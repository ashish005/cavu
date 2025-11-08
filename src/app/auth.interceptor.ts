import {Injectable} from "@angular/core";
import {HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AppSetupService} from "@app-global";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private ignoredUrls: string[] = [
    '/appSetup/pre'
  ];
  constructor(private appSetupService: AppSetupService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let headers = req.headers;
    // const token = this.auth.getAccessToken();
    // if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    if (this.appSetupService.appSetup?.id) {
      const { id, orgConfig } = this.appSetupService.appSetup;
      const { countryId, countryCode, timeZone } = orgConfig;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // e.g. "Asia/Kolkata"
      headers = headers.set('X-Tenant-ID', id);
      headers = headers.set('X-Timezone-ID', timeZone);
      headers = headers.set('X-Timezone-Browser', timezone);
      headers = headers.set('X-CountryCode', countryCode);
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
