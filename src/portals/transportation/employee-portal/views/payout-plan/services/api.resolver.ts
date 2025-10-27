import {Injectable, Injector} from "@angular/core";
import {OrgResourceService, SharedService} from "@app-global";
import {PayoutPlanLookup, PayoutPlanLookupSerializer} from "../domains/payout-plan.lookup";
import {ActivatedRouteSnapshot} from "@angular/router";

@Injectable()
export class PayoutPlanLookupService extends OrgResourceService<PayoutPlanLookup>{
  masterType: PayoutPlanLookup;
  constructor(public override injector: Injector, public sharedService: SharedService) { super(injector, 'payoutPlanLookup', new PayoutPlanLookupSerializer()); }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => {
      this.masterType = results['data'];
    };
    const failure = (err: any) => {};

    const setup = super.read(this.apiVersion);
    return this.performRouteResolver(route.data, setup, success, failure);
  }
}
