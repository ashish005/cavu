import {EventEmitter, Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {ComplianceReport, ComplianceReportSerializer} from "../domains/compliance-report.serializer";
@Injectable()
export class ComplianceReportService extends OrgResourceService<ComplianceReport>{
    refreshReportGrid: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(public override injector: Injector) { super(injector, 'complianceReport', new ComplianceReportSerializer()); }
}
