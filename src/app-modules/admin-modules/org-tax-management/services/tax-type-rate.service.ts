import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {TaxTypeRate, TaxTypeRateSerializer} from "../domains/tax-type-rate.serializer";

@Injectable()
export class TaxTypeRateService extends OrgResourceService<TaxTypeRate>{
    constructor(public override injector: Injector) { super(injector, 'taxTypeRateMaster', new TaxTypeRateSerializer()); }
}
