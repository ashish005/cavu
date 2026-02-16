import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {DocumentType, DocumentTypeSerializer} from "../domains/document-type.serializer";

@Injectable()
export class DocumentTypeService extends OrgResourceService<DocumentType>{
    constructor(public override injector: Injector) { super(injector, 'access-setup/documentType', new DocumentTypeSerializer());}
}
