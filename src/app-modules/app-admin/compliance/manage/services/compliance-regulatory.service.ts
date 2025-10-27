import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {ComplianceRegulatory, ComplianceRegulatorySerializer} from "../domains/compliance-regulatory.serializer";

@Injectable()
export class ComplianceRegulatoryService extends OrgResourceService<ComplianceRegulatory>{
   constructor(public override injector: Injector) { super(injector, 'complianceRegulatory', new ComplianceRegulatorySerializer()); }
}
