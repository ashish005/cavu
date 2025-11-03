import {Injectable, Injector, OnDestroy} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {DashboardLookup, DashboardLookupSerializer} from "./dashboard.lookup";
import {CoreResourceService} from "../../endpoint-base.service";

@Injectable({ providedIn: 'root' })
export class DashboardAPIResolver extends CoreResourceService<DashboardLookup> implements Resolve<any> {
  public masterType: DashboardLookup;

  constructor(public override injector: Injector) { super(injector, `dashboardPortletLookup`, new DashboardLookupSerializer()); }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => { this.masterType = results.data; };
    const failure = (err: any) => {};
    const setup = super.readLookup(super.apiVersion);
    return this.performRouteResolver(route.data, setup, success, failure);
  }
  /*callService(resource: string){
      return this.httpClient
          .get(`${this.baseSectorAPIUrl}dashboard/${resource}/${this.coreService.apiVersion}}`, this.requestHeaders)
          .pipe(take(1), catchError((error)=>{ return throwError(error); }));
  }

  callOptionsService(resource: string, option){
      return this.httpClient
          .get(`${this.baseSectorAPIUrl}dashboard/${resource}/${this.apiVersion}?${option.toQueryString()}`, this.requestHeaders)
          .pipe(take(1), catchError((error)=>{ return throwError(error); }));
  }*/
}
