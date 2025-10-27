import {EventEmitter, Injectable, Injector, OnDestroy} from "@angular/core";
import { OrgResourceService } from "@app-global";
import {FinancePluginLookup, FinancePluginLookupSerializer} from "../domains/finance.lookup";
import {of, map} from "rxjs";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";

@Injectable()
export class FinancePluginResolver extends OrgResourceService<FinancePluginLookup> implements Resolve<any> {
  masterType: FinancePluginLookup;
  constructor(public override injector: Injector) { super(injector, 'voucherLookup', new FinancePluginLookupSerializer()); }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const success = (results) => { this.masterType = results.data; };
    const failure = (err: any) => {};
    const setup = super.read(`by-voucher/${route.params.voucherMasterType}/${this.coreService.apiVersion}`);
    return this.coreService.performRouteResolver(route.data, setup, success, failure);
  }

    notificationSend(data: any)
    {
        //const { id } = this.coreService.currentUser;
        //data.userTypeId = this.coreService.currentUser.userTypeId;
        // data.senderUserId = id;
        // data.orgUnitId = this.coreService.orgUnitId;
        // data.orgBranchId = this.coreService.getOrgBranchId();
        return this.httpClient.post(this.baseSectorAPIUrl + `notification/send`, data, this.requestHeaders)
            .pipe(
                map((resp: any) => resp),
                tap(
                    (error) => {
                        super.handleError(error, () => this.notificationSend(data))
                    }
                )
            );
    }
}
