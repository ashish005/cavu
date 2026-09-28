import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {Injectable, Injector} from "@angular/core";
import {OrgResourceService, SharedService} from "@app-global";
import {BankingSetupLookup, BankingSetupLookupSerializer} from "./lookup.serializer";

@Injectable()
export class BankingSetupResolver extends OrgResourceService<BankingSetupLookup> implements Resolve<any> {
    bankingSetup: BankingSetupLookup;
    constructor(public override injector: Injector) {
        super(injector, 'v1/orgLookup/banking-setup', new BankingSetupLookupSerializer());
    }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.bankingSetup = results.data;
        };
        const failure = (err: any) => {};
        const setup = super.read(super.apiVersion);
        return super.performRouteResolver(route.data, setup, success, failure);
    }
}