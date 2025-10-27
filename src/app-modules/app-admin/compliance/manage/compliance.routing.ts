import {Routes} from "@angular/router";
import {ComplianceView} from "./views/compliance.view";
import {Layout} from "./layout/layout";
import {ComplianceRegulatoryView} from "./views/compliance-regulatory.view";
import {ComplianceAPIResolver} from "./services/lookup-resolver";

export const ComplianceRoutes: Routes = [
    {
        path: '', component: Layout, resolve: { items: ComplianceAPIResolver },
        data: { title: 'Compliance', header:'Compliance'},
        children:[
            { path: '', pathMatch: 'full', redirectTo:'list' },
            { path: 'list', component: ComplianceView, data: {title: 'Manage Compliance'} },
            { path: 'regulatory', component: ComplianceRegulatoryView, data: {title: 'Manage Compliance Regulatory'} }
        ]
    }
];

export const COMPLIANCE_VIEWS = [
    Layout, ComplianceView, ComplianceRegulatoryView
];