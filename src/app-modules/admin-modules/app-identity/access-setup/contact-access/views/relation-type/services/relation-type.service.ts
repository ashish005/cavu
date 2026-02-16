import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {RelationType, RelationTypeSerializer} from "../domains/relation-type.serializer";

@Injectable()
export class RelationTypeService extends OrgResourceService<RelationType>{
    constructor(public override injector: Injector) { super(injector, 'access-setup/relationType', new RelationTypeSerializer());}
}
