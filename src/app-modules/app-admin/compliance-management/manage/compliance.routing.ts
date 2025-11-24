import {Routes} from "@angular/router";
import {ComplianceView} from "./views/compliance.view";
import {Layout} from "./layout/layout";
import {ComplianceRegulatoryView} from "./views/compliance-regulatory.view";
import {ComplianceAPIResolver} from "./services/lookup-resolver";
import {ComplianceDashboardView} from "./views/dashboard.view";
import {OrgWorkflowAPIResolver} from "@app-global";
export const ComplianceRoutes: Routes = [
    {
        path: '', component: Layout, resolve: { lookup: OrgWorkflowAPIResolver },
        data: { title: 'Compliance', header:'Compliance'},
        children:[
            { path: '', pathMatch: 'full', redirectTo:'dashboard' },
            { path: 'dashboard', component: ComplianceDashboardView, data: { title: 'Dashboard', key: 'dashboard', header:'Dashboard'} },
            { path: 'list', resolve: { items: ComplianceAPIResolver }, component: ComplianceView, data: {title: 'Manage Compliance'} },
            { path: 'regulatory', component: ComplianceRegulatoryView, data: {title: 'Manage Compliance Regulatory'} }
        ]
    }
];
export const COMPLIANCE_VIEWS = [
    Layout, ComplianceDashboardView, ComplianceView, ComplianceRegulatoryView
];