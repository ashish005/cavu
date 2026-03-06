import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {StudentBatch, StudentBatchSerializer} from "../domains/batch.serializer";

@Injectable()
export class StudentBatchService extends OrgResourceService<StudentBatch> {
    constructor(public override injector: Injector) { super(injector, 'studentBatch', new StudentBatchSerializer()); }
}

