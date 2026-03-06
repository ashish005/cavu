import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {FeeConcessionType, FeeConcessionTypeSerializer} from "../domains/fee-concession.serializer";

@Injectable()
export class FeeConcessionTypeService extends OrgResourceService<FeeConcessionType>{
    constructor(public override injector: Injector) { super(injector, 'FeeConcessionType', new FeeConcessionTypeSerializer());
  }
}
