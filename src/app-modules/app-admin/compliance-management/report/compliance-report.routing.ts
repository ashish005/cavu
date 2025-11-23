import {Routes} from "@angular/router";
import {ComplianceReportView} from "./views/compliance-report.view";

export const ComplianceReportRoutes: Routes = [
    { path: '', component: ComplianceReportView, data: { title: 'Compliance Report', header:'Compliance Report'} }//code: "FIN_CMP",
];

export const COMPLIANCE_REPORT_VIEWS = [ ComplianceReportView ];