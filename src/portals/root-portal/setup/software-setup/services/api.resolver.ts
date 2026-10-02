import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, CoreEndpointBase} from "@app-global";
import {SoftwareSetupLookup} from "../domains/lookup.serializer";

@Injectable()
export class SoftwareSetupResolver extends CoreEndpointBase implements Resolve<any> {
  public lookup: SoftwareSetupLookup;
  constructor(public override injector: Injector, public sharedService: SharedService) { super(injector); }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => {
        this.lookup = new SoftwareSetupLookup(results.data);
    };
    const failure = (err: any) => {};
    const setup = this.httpClient.get(this.baseSectorAPIUrl + `/v1/orgLookup/software-setup`, this.requestHeaders );
    //const setup = this.read(this.coreService.apiVersion);
    return this.performRouteResolver(route.data, setup, success, failure);
  }
}
