import {Injectable, Injector} from "@angular/core";
import {Compliance, ComplianceSerializer} from "../domains/compliance.serializer";
import  { OrgResourceService } from "@app-global";

@Injectable()
export class ComplianceService extends OrgResourceService<Compliance>{
    constructor(public override injector: Injector) { super(injector, 'compliance', new ComplianceSerializer()); }
}
