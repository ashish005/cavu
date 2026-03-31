import {EventEmitter, Injectable, Injector} from "@angular/core";
import {FeePlanLookup, FeePlanLookupSerializer} from "../domains/fee-plan.lookup";
import {OrgResourceService} from "@app-global";
import {Resolve} from "@angular/router";

@Injectable({ providedIn: 'root' })
export class FeePlanLookupService extends OrgResourceService<FeePlanLookup> implements Resolve<FeePlanLookup>{
  masterType: FeePlanLookup;
  constructor(public override injector: Injector) { super(injector, 'feeLookup', new FeePlanLookupSerializer()); }

  resolve() {
    const success = (results) => { this.masterType = results['data']; };
    const failure = (err: any) => {};

    const setup = super.read(`feePlan/${this.apiVersion}`);
    return this.performRouteResolver({ name: 'fee Plan setup'}, setup, success, failure);
  }
}
