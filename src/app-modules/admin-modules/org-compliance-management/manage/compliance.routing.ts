import {Routes} from "@angular/router";
import {ComplianceView} from "./views/compliance.view";
import {Layout} from "./layout/layout";
import {ComplianceRegulatoryView} from "./views/compliance-regulatory.view";
import {ComplianceAPIResolver} from "./services/lookup-resolver";
import {ComplianceDashboardView} from "./views/dashboard.view";
import {OrgWorkflowAPIResolver} from "@app-global";
import {TestComplianceSchedulerView} from "./views/test-scheduler.view";
import {ComplianceBoardView} from "./views/compliance-board.view";

export const ComplianceRoutes: Routes = [
    {
        path: '', component: Layout, resolve: { lookup: OrgWorkflowAPIResolver },
        data: { title: 'Compliance', header:'Compliance'},
        children:[
            { path: '', pathMatch: 'full', redirectTo:'dashboard' },
            { path: 'dashboard', component: ComplianceDashboardView, data: { title: 'Dashboard', key: 'dashboard', header:'Dashboard'} },
            { path: 'list', resolve: { items: ComplianceAPIResolver }, component: ComplianceView, data: {title: 'Manage Compliance'} },
            { path: 'regulatory', component: ComplianceRegulatoryView, data: {title: 'Manage Compliance Regulatory'} },
            { path: 'board', resolve: { items: ComplianceAPIResolver }, component: ComplianceBoardView, data: {title: 'Manage Compliance'} },
            { path: 'scheduler', component: TestComplianceSchedulerView, data: { title: 'Dashboard', key: 'dashboard', header:'Dashboard'} },
            {
                path: 'report', data: { translatePath: 'modules.project.manage' },
                loadChildren: () => import('../report').then(m => m.ComplianceReportModule)
            }
        ]
    },

];
export const COMPLIANCE_VIEWS = [
    Layout, ComplianceDashboardView, ComplianceView, ComplianceRegulatoryView, ComplianceBoardView, TestComplianceSchedulerView
];