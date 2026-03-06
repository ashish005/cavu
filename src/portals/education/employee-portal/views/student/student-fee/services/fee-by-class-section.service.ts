import {FeeByClassSection, FeeByClassSectionSerializer} from "../domains/fee-by-class-section.serializer";
import {Injectable, Injector} from "@angular/core";
import {OrgResourceService} from "@app-global";

@Injectable()
export class FeeByClassSectionService extends OrgResourceService<FeeByClassSection>{
  constructor(public override injector: Injector) { super(injector, 'fee/class-section', new FeeByClassSectionSerializer()); }
}
