import {Routes} from "@angular/router";

export const OrgClientRoutes: Routes = [
    {
        path: '',
        children:[
            { path: '', pathMatch: 'full', redirectTo:'manage' },
            { path: 'manage', loadChildren: () => import('portals/real-estate/employee-portal/views/client/manage').then(m => m.ClientManagementModule) },
            { path: 'quotation', loadChildren: () => import('portals/real-estate/employee-portal/views/client/quotation').then(m => m.QuotationManageModule) },
            { path: ':accountId', loadChildren: () => import('portals/real-estate/employee-portal/views/client/by-account-view').then(m => m.ClientByAccountModule) }
        ]
    }
];