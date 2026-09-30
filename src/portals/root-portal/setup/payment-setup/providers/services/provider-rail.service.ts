import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {ProviderRail, ProviderRailSerializer} from "../domains/provider-rail.serializer";

@Injectable()
export class ProviderRailService extends OrgResourceService<ProviderRail>{
    constructor(public override injector: Injector) {
        super(injector, 'v1/global/provider/rail', new ProviderRailSerializer());
    }
}
