import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve} from "@angular/router";
import { OrgResourceService } from "@app-global";
import {UserAccessSetupLookup, UserAccessSetupLookupSerializer} from "../domains/lookup.serializer";

@Injectable()
export class UserAccessSetupAPIResolver extends OrgResourceService<UserAccessSetupLookup> implements Resolve<any> {
    masterType: UserAccessSetupLookup;
    constructor(public override injector: Injector) { super(injector, 'contact/lookup', new UserAccessSetupLookupSerializer()); }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => { this.masterType = results['data']; };
        const failure = (err: any) => {};
        const setup = this.read(this.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }
}
