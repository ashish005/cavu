import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import  { OrgResourceService } from "@app-global";
import {LookupBanking, LookupBankingSerializer} from "../domains/banking.lookup";

@Injectable()
export class BankingAPIResolver extends OrgResourceService<LookupBanking> implements Resolve<any> {
  masterType: LookupBanking;
  refreshTrxnAlloationList: EventEmitter<any> = new EventEmitter<any>();
    constructor(public override injector: Injector) { super(injector, 'trxnMasterLookup', new LookupBankingSerializer()); }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.masterType = results['data'];
        };

        const failure = (err: any) => {};
        const setup = this.read(this.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }
}
