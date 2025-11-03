import {Injectable, Injector} from "@angular/core";
import { CoreResourceService } from "@app-global";
import {OrgHostConfig, OrgHostConfigSerializer} from "../domains/org-host-config.serializer";

@Injectable()
export class OrgHostConfigService extends CoreResourceService<OrgHostConfig> {
  constructor(public override injector: Injector) { super(injector, 'orgHostConfig', new OrgHostConfigSerializer()); }

  /*public updateHostConfig(data: Array<OrgHostConfig>): Observable<any> {
      const { id } = this.org.tenant;
      return this.httpClient
      .put(`${this.viewUrl}/${id}/host-config`, data, this.requestHeaders)
      .pipe(
        tap(
          (resp: any) => console.log('read logged'),
          (error)=>{ this.handleError(error, () => this.updateOrganization(data)) }
        )
      );
  }*/
}
