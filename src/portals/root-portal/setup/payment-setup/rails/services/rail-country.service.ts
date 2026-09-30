import {Injectable, Injector} from "@angular/core";
import {RailCountry, RailCountrySerializer} from "../domains/rail-country.serializer";
import {OrgResourceService} from "@app-global";

@Injectable()
export class RailCountryService extends OrgResourceService<RailCountry>{
    constructor(public override injector: Injector) {
        super(injector, 'v1/global/rail/country', new RailCountrySerializer());
    }
}