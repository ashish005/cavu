import {Injectable, Injector} from "@angular/core";
import {Batch, BatchSerializer} from "../domains/batch.serializer";
import  { OrgResourceService } from "@app-global"

@Injectable()
export class OrgBatchService extends OrgResourceService<Batch>{
    constructor(public override injector: Injector) {
        super(injector, 'orgBatch', new BatchSerializer());
    }
}