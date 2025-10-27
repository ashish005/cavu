import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import { OrgResourceService } from "@app-global";
import {ConfigLookup, ConfigLookupSerializer} from "../domains/lookup.serializer";

@Injectable()
export class OrgSetupAPIResolver extends OrgResourceService<ConfigLookup> implements Resolve<any> {
    masterType: ConfigLookup;
    constructor(public injector: Injector) { super(injector, 'orgLookup/setup', new ConfigLookupSerializer()); }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.masterType = results.data;
        };
        const failure = (err: any) => {};
        // const setup = this.read(this.orgSetup.countryCode);
        // return this.performRouteResolver(route.data, setup, success, failure);
    }
}
