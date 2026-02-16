import { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {catchError, tap} from "rxjs";
import {
    OrgCurrency,
    OrgCurrencySerializer
} from "../domains/org-currency.serializer";

@Injectable()
export class OrgCurrencyService extends OrgResourceService<OrgCurrency>{
    constructor(public override injector: Injector) { super(injector, 'orgCurrency', new OrgCurrencySerializer());}

    /*updateDefaultOrgCurrency(orgCurrencyId, data)
    {
        return this.httpClient
            .patch(`${this.viewUrl}/${orgCurrencyId}/update/default`, data, this.requestHeaders)
            .pipe(
                tap(
                    catchError(error=> this.handleError(error, () => this.updateDefaultOrgCurrency(orgCurrencyId, data)))
                )
            );
    }*/

    addOrgCurrency(globalCurrencyId, data)
    {
        return this.httpClient
            .post(`${this.baseSectorAPIUrl}orgCurrency/${globalCurrencyId}/add`, data, this.requestHeaders)
            .pipe(
                catchError(error=> this.handleError(error, () => this.addOrgCurrency(globalCurrencyId, data)))
            );
    }
}

/*
@Injectable()
export class GlobalCurrencyService extends CoreOrgResourceService<GlobalCurrency>{
    constructor(public injector: Injector) { super(injector, 'currency', new GlobalCurrencySerializer());}
}*/
