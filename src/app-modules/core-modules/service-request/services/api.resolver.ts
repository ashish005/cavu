import {Injectable, Injector} from "@angular/core";
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {ServiceRequestLookup, ServiceRequestLookupSerializer} from "../domains/lookup.serializer";
import  { OrgResourceService } from "@app-global"

@Injectable()
export class ServiceRequestAPIResolver extends OrgResourceService<ServiceRequestLookup> implements Resolve<any> {
  masterType: ServiceRequestLookup;
  get actionType() {
    return {
      create: { text:'Create', 'loadingText': 'Creating' },
      update: { text:'Update', 'loadingText': 'Updating' },
      submit: { text:'Submit', 'loadingText': 'Submitting' }
    }
  };
  pageTitle: string;
  constructor(public override injector: Injector) { super(injector, 'ticketLookup', new ServiceRequestLookupSerializer()); }

  //getCurrentUser(){ return this.coreService.currentUser; }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => { this.masterType = results['data']; };

    const failure = (err: any) => {};

    const setup = super.read(super.apiVersion);
    return super.performRouteResolver(route.data, setup, success, failure);
  }
}
