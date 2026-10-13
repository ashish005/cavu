import {Injectable, Injector} from "@angular/core";
import {ConfigLookup, ConfigLookupSerializer} from "../domains/lookup.serializer";
import {OrgResourceService} from "@app-global";

@Injectable()
export class OrgSetupAPIResolver extends OrgResourceService<ConfigLookup> {
    masterType: ConfigLookup;
    constructor(public override injector: Injector) { super(injector, 'v1/orgLookup/org-setup', new ConfigLookupSerializer()); }

    resolve() {
        const success = (results) => {
            this.masterType = results.data;
        };
        const failure = (err: any) => {};
        const setup = this.read(this.orgSetup.countryCode);
        return this.performRouteResolver(this.apiVersion, setup, success, failure);
    }
}