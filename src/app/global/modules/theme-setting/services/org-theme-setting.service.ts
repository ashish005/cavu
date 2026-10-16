import {Injectable, Injector} from "@angular/core";
import {Observable, catchError, map} from "rxjs";
import {OrgTheme, OrgThemeSerializer} from "../domains/theme-setup.serializer";
import {CoreEndpointBase} from "../../../services";

/** The organisation's default theme on the tenant API (`v1/org-admin/theme`); saving needs the "change organisation settings" permission. */
@Injectable()
export class OrgThemeSettingService extends CoreEndpointBase {
  private readonly serializer = new OrgThemeSerializer();

  constructor(public override injector: Injector) { super(injector); }

  private get viewUrl() { return `${this.baseSectorAPIUrl}/v1/org-admin/theme`; }

  public read(): Observable<OrgTheme> {
    return this.httpClient.get(this.viewUrl, this.requestHeaders).pipe(
      map((r: any) => this.serializer.fromJson(r?.data)),
      catchError(error => this.handleError(error, () => this.read()))
    );
  }

  public save(item: OrgTheme): Observable<OrgTheme> {
    return this.httpClient.put(this.viewUrl, this.serializer.toJson(item), this.requestHeaders).pipe(
      map((r: any) => this.serializer.fromJson(r?.data)),
      catchError(error => this.handleError(error, () => this.save(item)))
    );
  }
}
