import {FeeByOrgBatch, FeeByOrgBatchSerializer} from "../domains/fee-by-org-batch.serializer";
import {Injectable, Injector} from "@angular/core";
import {OrgResourceService} from "@app-global";

@Injectable()
export class FeeByOrgBatchService extends OrgResourceService<FeeByOrgBatch>{
    constructor(public override injector: Injector) { super(injector, 'fee/batch', new FeeByOrgBatchSerializer());
  }
}
