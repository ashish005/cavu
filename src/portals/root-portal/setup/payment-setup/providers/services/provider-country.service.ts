import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {ProviderCountry, ProviderCountrySerializer} from "../domains/provider-country.serializer";

@Injectable()
export class ProviderCountryService extends OrgResourceService<ProviderCountry>{
    constructor(public override injector: Injector) {
        super(injector, 'v1/global/provider/country', new ProviderCountrySerializer());
    }
}
