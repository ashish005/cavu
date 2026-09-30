import {Injectable, Injector} from "@angular/core";
import {OrgResourceService} from "@app-global";
import {RailCurrency, RailCurrencySerializer} from "../domains/rail-currency.serializer";

@Injectable()
export class RailCurrencyService extends OrgResourceService<RailCurrency>{
    constructor(public override injector: Injector) {
        super(injector, 'v1/global/rail/currency', new RailCurrencySerializer());
    }
}
