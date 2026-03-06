import {EventEmitter, Injectable, Injector} from '@angular/core';
import {StudentSummary, StudentSummarySerializer} from "../domains/student.serializer";
import {OrgResourceService} from "@app-global";

@Injectable()
export class StudentSummaryService extends OrgResourceService<StudentSummary>{
    refresh: EventEmitter<any> = new EventEmitter<any>();
    constructor(public override injector: Injector) { super(injector, 'student', new StudentSummarySerializer());}
}