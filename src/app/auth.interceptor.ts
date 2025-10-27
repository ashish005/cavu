import {Injectable} from "@angular/core";
import {HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AppSetupService} from "@app-global";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private appSetupService: AppSetupService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let headers = req.headers;
    // const token = this.auth.getAccessToken();
    // if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    if (this.appSetupService.appSetup?.id) headers = headers.set('X-Tenant-ID', this.appSetupService.appSetup.id);

    // 3️⃣ Clone and continue
    const clonedReq = req.clone({ headers });
    return next.handle(clonedReq);
  }
}
