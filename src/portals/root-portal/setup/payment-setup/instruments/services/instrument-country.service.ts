import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {InstrumentCountry, InstrumentCountrySerializer} from "../domains/instrument-country.serializer";

@Injectable()
export class InstrumentCountryService extends OrgResourceService<InstrumentCountry>{
    constructor(public override injector: Injector) {
        super(injector, 'v1/global/instrument/country', new InstrumentCountrySerializer());
    }
}
