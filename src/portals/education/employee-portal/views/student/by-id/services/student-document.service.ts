import {Injectable, Injector} from "@angular/core";
import {OrgResourceService} from "@app-global";
import {StudentDocument, StudentDocumentSerializer} from "../domains/document.serializer";

@Injectable()
export class StudentDocumentService extends OrgResourceService<StudentDocument> {
    constructor(public override injector: Injector) { super(injector, 'student/document', new StudentDocumentSerializer()); }
}
