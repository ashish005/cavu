import {Injectable, Injector} from "@angular/core";
import {Observable, map} from "rxjs";
import {OrgTheme, OrgThemeSerializer} from "../domains/theme-setup.serializer";
import {HttpClient} from "@angular/common/http";
import {environment} from "@app-environments";
import {CoreEndpointBase} from "../../../services";

@Injectable()
export class OrgThemeSettingService extends CoreEndpointBase {
  protected viewUrl: string;
  constructor(public override injector: Injector) {
    super(injector);
    this.viewUrl = `${this.baseAPIUrl}/organizationSetting/orgTheme`;
  }

  public create(item: OrgTheme): Observable<any> {
    return this.httpClient.post(this.viewUrl, item, this.requestHeaders);
  }

  public update(id: string | number, item: OrgTheme): Observable<any> {
    return this.httpClient.put(`${this.viewUrl}/${id}`, item, this.requestHeaders);
  }

  public read(id: string): Observable<OrgTheme> {
    return this.httpClient
      .get(`${this.viewUrl}/${id}`, this.requestHeaders)
      .pipe(
        map((r: any) => new OrgThemeSerializer().fromJson(r.data))
      );
  }
}


