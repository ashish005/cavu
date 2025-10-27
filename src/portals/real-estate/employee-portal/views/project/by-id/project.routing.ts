import {Routes} from "@angular/router";
import {ProjectSideNavLayout} from "./layout/layout";
import {ProjectAPIResolver} from "./services";

import {DashboardView} from "./views/dashboard.view";
import {ProjectModuleView} from "./views/module.view";
import {WorkflowView} from "./views/workflow.view";
import {ProjectByIdAPIResolver} from "./services";
import {ResourceView} from "./views/resource.view";

import {TimeTrackingView} from "./views/time-tracking.view";
import {StatusTrackingView} from "./views/status-tracking.view";
import {RecurringInvoiceView} from "./views/templates.view";

import {WorkflowLayout} from "./layout/workflow.layout";

const translatePath = 'modules.project.sub_module';

export const ProjectRoutes: Routes = [
    {
        path: '',
        resolve: { lookup: ProjectAPIResolver, project: ProjectByIdAPIResolver },
        component: ProjectSideNavLayout, data: { code:'', icon: 'fa fa-dashboard', title: `modules.project.title`, header: `modules.project.header` },
        runGuardsAndResolvers: 'paramsChange',
        children:[
            { path: '', pathMatch: 'full', redirectTo:'dashboard' },
            { path: 'dashboard', component: DashboardView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.dashboard.title`, header: `${translatePath}.dashboard.header` } },
            { path: 'modules', component: ProjectModuleView, data: { code:'', icon: 'fa fa-tag', title: `${translatePath}.module.title`, header: `${translatePath}.module.header`} },
            {
                path: 'workflow', component: WorkflowLayout, data: { code:'', icon: 'fa fa-direction', title: `${translatePath}.workflow.title`, header: `${translatePath}.workflow.header`} ,
                children:[
                    { path: '', pathMatch: 'full', redirectTo:'view' },
                    { path: 'view', component: WorkflowView, data: { code:'', icon: 'fa fa-direction', title: `${translatePath}.workflow.title`, header: `${translatePath}.workflow.header` } },
                    // { path: 'tasks', component: ProjectTaskView, data: {title: 'Workflow', icon: 'fa fa-direction', header: 'Tasks'} },
                    // { path: 'schedules', component: ProjectSchedulesView, data: {title: 'Workflow', icon: 'fa fa-direction', header: 'Tasks'} },
                    // { path: 'schedule-history', component: ProjectScheduleHistoryView, data: {title: 'Workflow', icon: 'fa fa-direction', header: 'Tasks'} }
                ]
            },
            { path: 'resource', component: ResourceView, data: { userType: 'employee', code:'', icon: 'fa fa-users', title: `${translatePath}.resource.title`, header: `${translatePath}.resource.header`} },

            // { path: 'quotation', component: QuotationView, data: { code:'', title: 'Quotation', icon: 'fa fa-shield', header: 'Quotation', invoiceMasterType: 'quote', vMasterType: 'quotation' } },
            // { path: 'invoice', component: InvoiceView, data: {title: 'Sale', icon: 'fa fa-pie-chart', header: 'Sale', vMasterType: 'sale'} },
            // { path: 'quotation', loadChildren: () => import('app-modules/manage-invoice').then(m => m.InvoiceManageModule), data: { hideSidebar: true, vMasterType: 'QUOTATION', code:'', icon: 'fa fa-shield', title: `${translatePath}.quote.title`, header: `${translatePath}.quote.header` } },
            // { path: 'invoice', loadChildren: () => import('app-modules/manage-invoice').then(m => m.InvoiceManageModule), data: { hideSidebar: true, vFor: 'project', vMasterType: 'ALL_INVOICE', code:'', icon: 'fa fa-pie-chart', title: `${translatePath}.invoice.title`, header: `${translatePath}.invoice.header` } },

            //{ path: 'retainer', component: RetainerView, data: {title: 'Retainer', icon: 'fa fa-advance', header: 'Retainer'} },
            { path: 'recurring', component: RecurringInvoiceView, data: { code:'', icon: 'fa fa-envelope', title: `${translatePath}.rec_invoice.title`, header: `${translatePath}.rec_invoice.header` } },
            //{ path: 'estimate', component: EstimateView, data: {title: 'Estimate', icon: 'fa fa-time', header: 'Estimate'} },
            { path: 'time-tracking', component: TimeTrackingView, data: { code:'', icon: 'fa fa-time', title: `${translatePath}.tracking.title`, header: `${translatePath}.tracking.header` } },
            { path: 'status-tracking', component: StatusTrackingView, data: { code:'', icon: 'fa fa-time', title: `${translatePath}.tracking.title`, header: `${translatePath}.tracking.header` } }
        ]
    }
];

export const PROJECT_VIEWS = [
    ProjectSideNavLayout, DashboardView, ProjectModuleView,
    WorkflowLayout, WorkflowView,
    ResourceView,
    TimeTrackingView, StatusTrackingView, RecurringInvoiceView
];
