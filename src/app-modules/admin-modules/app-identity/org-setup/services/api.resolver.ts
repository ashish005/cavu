import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import { CoreResourceService } from "@app-global";
import {ConfigLookup, ConfigLookupSerializer} from "../domains/lookup.serializer";

@Injectable()
export class OrgSetupAPIResolver extends CoreResourceService<ConfigLookup> implements Resolve<any> {
    masterType: ConfigLookup;
    constructor(public override injector: Injector) { super(injector, 'orgSetupLookup', new ConfigLookupSerializer()); }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.masterType = results.data;
        };
        const failure = (err: any) => {};
        const setup = super.read(super.orgSetup.countryCode);
        return super.performRouteResolver(route.data, setup, success, failure);
    }
}
