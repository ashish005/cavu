import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import  { OrgResourceService } from "@app-global";
import {tap} from "rxjs";
import {OrgIntegration, OrgIntegrationSerializer} from "../domains/org-integration.serializer";
import {Observable} from "rxjs";

@Injectable()
export class OrgIntegrationAPIResolver extends OrgResourceService<OrgIntegration> implements Resolve<any> {
    masterType: OrgIntegration;

    constructor(public override injector: Injector) { super(injector, 'integrationLookup', new OrgIntegrationSerializer()); }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.masterType = results.data;
        };
        const failure = (err: any) => {};
        const setup = this.read(this.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }

    public getOrgIntegrationReferences(key: string): Observable<any> {
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}integration/ref/${key}`, this.requestHeaders)
            .pipe(
                tap(
                    (resp: any) => console.log('read logged'),
                    (error)=>{ this.handleError(error, () => this.getOrgIntegrationReferences(key)) }
                )
            );
    }
}
