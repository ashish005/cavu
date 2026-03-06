import {FeeByClass, FeeByClassSerializer} from "../domains/fee-by-class.serializer";
import {Injectable, Injector} from "@angular/core";
import {OrgResourceService} from "@app-global";

@Injectable()
export class FeeByClassService extends OrgResourceService<FeeByClass>{
  constructor(public override injector: Injector) { super(injector, 'fee/class', new FeeByClassSerializer()); }
}
