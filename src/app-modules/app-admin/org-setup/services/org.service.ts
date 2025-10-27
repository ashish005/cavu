import {Injectable, Injector} from "@angular/core";
import {Observable, throwError} from "rxjs";
import {catchError, map, tap} from "rxjs";
import { OrgResourceService } from "@app-global";
import {Org, OrgHostConfig, OrgSerializer} from "../domains/org.serializer";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";

@Injectable()
export class OrgService extends OrgResourceService<Org> implements Resolve<any> {
  org: Org;
  constructor(public override injector: Injector) { super(injector, 'org', new OrgSerializer()); }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.org = results.data;
        };
        const failure = (err: any) => {};
        // const setup = this.read(`access/${this.orgSetup.id}`);
        // return this.performRouteResolver(route.data, setup, success, failure);
    }

    updateOrganization = (data: any) => this.update(this.org.id, data);

  updateOrganizationProfile(file, cb, progressCb) {
    const formData = new FormData();
    formData.append('files', file);
    const uploadDocUrl = `${this.viewUrl}/profile/${this.org.profileId}`;

    this.updateFormData('PUT', uploadDocUrl, formData, progressCb, cb);
  }

  public updateHostConfig(data: Array<OrgHostConfig>): Observable<any> {
    return this.httpClient
      .put(`${this.viewUrl}/${this.org.id}/host-config`, data, this.requestHeaders)
      .pipe(
        tap(
          (resp: any) => console.log('read logged'),
          (error)=>{ this.handleError(error, () => this.updateOrganization(data)) }
        )
      );
  }
}
