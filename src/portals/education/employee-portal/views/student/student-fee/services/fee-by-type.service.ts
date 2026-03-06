import {FeeByType, FeeByTypeSerializer} from "../domains/fee-by-type.serializer";
import {Injectable, Injector} from "@angular/core";
import {OrgResourceService} from "@app-global";

@Injectable()
export class FeeByTypeService extends OrgResourceService<FeeByType>{
  constructor(public override injector: Injector) { super(injector, 'fee/head', new FeeByTypeSerializer()); }
}
