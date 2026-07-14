import {Routes} from "@angular/router";

export const OrgClientRoutes: Routes = [
    {
        path: '',
        children:[
            { path: '', pathMatch: 'full', redirectTo:'manage' },
            { path: 'manage', loadChildren: () => import('app-modules/core-modules/org-client/manage').then(m => m.ClientManagementModule) },
            { path: 'quotation', loadChildren: () => import('app-modules/core-modules/org-client/quotation').then(m => m.QuotationManageModule) },
            { path: ':accountId', loadChildren: () => import('app-modules/core-modules/org-client/by-account-view').then(m => m.ClientByAccountModule) }
        ]
    }
];