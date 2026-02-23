import {Injectable, Injector} from "@angular/core";
import { CoreResourceService } from "../../../../app/global/services";
import {ConfigLookup, ConfigLookupSerializer} from "../domains/lookup.serializer";

@Injectable()
export class OrgSetupAPIResolver extends CoreResourceService<ConfigLookup> {
    masterType: ConfigLookup;
    constructor(public override injector: Injector) { super(injector, 'orgSetupLookup', new ConfigLookupSerializer()); }

    resolve() {
        const success = (results) => {
            this.masterType = results.data;
        };
        const failure = (err: any) => {};
        const setup = this.read(this.orgSetup.countryCode);
        return this.performRouteResolver(this.apiVersion, setup, success, failure);
    }
}