import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {IdentifierCountry, IdentifierCountrySerializer} from "../domains/identifier-country.serializer";

@Injectable()
export class IdentifierCountryService extends OrgResourceService<IdentifierCountry>{
    constructor(public override injector: Injector) {
        super(injector, 'v1/global/identifier/country', new IdentifierCountrySerializer());
    }
}
