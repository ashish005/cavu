import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {ComplianceType, ComplianceTypeSerializer} from "../domains/compliance-type.domain";

@Injectable()
export class ComplianceTypeService extends OrgResourceService<ComplianceType> {
    constructor(public override injector: Injector) { super(injector, 'complianceType', new ComplianceTypeSerializer()); }
}
