import {Injectable, Injector} from "@angular/core";
import { CoreResourceService } from "@app-global";
import {Org, OrgSerializer} from "../domains/org.serializer";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";

@Injectable()
export class OrgService extends CoreResourceService<Org> implements Resolve<any> {
  org: Org;
  constructor(public override injector: Injector) { super(injector, 'org', new OrgSerializer()); }

    async resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => { this.org = results.data; };
        const failure = (err: any) => {};
        const setup = super.read(`access/${super.orgSetup.id}`);
        return await super.performRouteResolver(route.data, setup, success, failure);
    }

    updateOrganization = (data: any) => this.update(this.org.id, data);

  updateOrganizationProfile(file, cb, progressCb) {
    const formData = new FormData();
    formData.append('files', file);
    const uploadDocUrl = `${this.viewUrl}/profile/${this.org.profileId}`;

    this.updateFormData('PUT', uploadDocUrl, formData, progressCb, cb);
  }
}
