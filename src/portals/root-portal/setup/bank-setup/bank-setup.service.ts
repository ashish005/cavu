import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {Injectable, Injector} from "@angular/core";
import {CoreEndpointBase, OrgResourceService, SharedService} from "@app-global";
import {BankingSetupLookup} from "./lookup.serializer";

@Injectable()
export class BankingSetupResolver extends CoreEndpointBase implements Resolve<any> {
  bankingSetup: BankingSetupLookup;
  constructor(public override injector: Injector, public sharedService: SharedService) { super(injector); }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.bankingSetup = new BankingSetupLookup(results.data);
        };
        const failure = (err: any) => {};
        const setup = this.httpClient.get(
            this.baseSectorAPIUrl + `/v1/orgLookup/banking-setup`,
            this.requestHeaders
        );
        //const setup = this.read(this.coreService.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }
}