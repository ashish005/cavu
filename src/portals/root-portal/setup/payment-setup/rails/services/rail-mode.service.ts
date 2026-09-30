import {Injectable, Injector} from "@angular/core";
import {OrgResourceService} from "@app-global";
import {RailMode, RailModeSerializer} from "../domains/rail-mode.serializer";

@Injectable()
export class RailModeService extends OrgResourceService<RailMode>{
    constructor(public override injector: Injector) {
        super(injector, 'v1/global/rail/mode', new RailModeSerializer());
    }
}
