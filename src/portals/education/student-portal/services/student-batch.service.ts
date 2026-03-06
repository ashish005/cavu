import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {StudentBatch, StudentBatchSerializer} from "../domains/student-batch.serializer";

@Injectable()
export class StudentBatchService extends OrgResourceService<StudentBatch> {
    constructor(public override injector: Injector) {
        super(injector, 'student/batch', new StudentBatchSerializer());
    }
}
