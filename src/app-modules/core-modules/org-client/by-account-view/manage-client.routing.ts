import {Routes} from "@angular/router";
import {ClientSideNavLayout} from "./layout/layout";
import { ClientAPIResolver, ClientByIdAPIResolver } from "./services";
import {ClientDashboardView} from "./views/client-dashboard.view";
import {ClientMemberView} from "./views/client-member.view";

export const ClientProject_Routes: Routes = [
  {
        path: '', component: ClientSideNavLayout, resolve: { lookup: ClientAPIResolver, item: ClientByIdAPIResolver },
        runGuardsAndResolvers: 'paramsChange',
        children:[
            { path: '', pathMatch: 'full', redirectTo:'dashboard' },
            { path: 'dashboard', component: ClientDashboardView, data: { code:'', title: 'Dashboard View', icon: 'fa fa-dashboard', header: 'Dashboard' } },
            { path: 'associates', component: ClientMemberView, data: { code:'', title: 'Associates', icon: 'fa fa-users', header: 'Associates' } },

            // { path: 'quotation', loadChildren: () => import('app-modules/manage-invoice').then(m => m.InvoiceManageModule), data: { code:'', title: 'Quotation', icon: 'fa fa-shield', header: 'Quotation', hideSidebar: true, vMasterType: INVOICE_UI_VIEW.QUOTATION } },
            // { path: 'invoice', loadChildren: () => import('app-modules/manage-invoice').then(m => m.InvoiceManageModule), data: {title: 'Sale', icon: 'fa fa-pie-chart', hideSidebar: true, header: 'Invoice', vFor: 'customer', vMasterType: INVOICE_UI_VIEW.ALL_INVOICE } },

            { path: 'projects', loadChildren: () => import('portals/real-estate/employee-portal/views/project').then(m => m.ProjectModule), data: { isClient: true, code:'PERM_PROJECT', title: 'Project', icon: 'fa fa-shield', header: 'Project' } }
        ]
    }
];

export const CLIENT_VIEWS = [
    ClientSideNavLayout,
    ClientDashboardView, ClientMemberView
];
