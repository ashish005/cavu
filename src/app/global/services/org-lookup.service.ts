import {inject, Injectable, Injector} from '@angular/core';
import {CoreEndpointBase} from "./endpoint-base.service";
import {OrgLookup} from "./models/org-lookup.serializer";
import {ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import {catchError, from, Observable, tap} from "rxjs";

@Injectable({ providedIn: 'root' })
export class OrgLookupService extends CoreEndpointBase implements Resolve<any>{
    private orgLookup: OrgLookup;
    public getOrgLookup = ()=> this.orgLookup;
    public getVoucherTypeDictionary = () => this.orgLookup?.voucherTypeDictionary;
    constructor(protected override injector: Injector) { super(injector); }

    private fetchOrgLookup()
    {
        const success = (results) => { this.orgLookup = new OrgLookup(results.data); };
        const failure = (err: any) => {
            return this.handleError(err, () => from(this.fetchOrgLookup()));
        };

        const endpointUrl = `${this.baseSectorAPIUrl}/v1/orgLookup/init`;
        const setup = this.httpClient.get(endpointUrl, this.requestHeaders);
        return this.performRouteResolver({}, setup, success, failure);
    }

    resolve = (route: ActivatedRouteSnapshot) => this.fetchOrgLookup();
}
