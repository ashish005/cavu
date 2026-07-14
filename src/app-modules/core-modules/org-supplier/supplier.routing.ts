import {Routes} from "@angular/router";

export const OrgSupplierRoutes: Routes = [
    {
        path: '',
        children:[
            { path: '', pathMatch: 'full', redirectTo:'manage' },
            { path: 'manage', loadChildren: () => import('app-modules/core-modules/org-supplier/manage').then(m => m.SupplierManagementModule) },
            { path: ':accountId', loadChildren: () => import('app-modules/core-modules/org-supplier/by-account-view').then(m => m.SupplierByAccountModule) }
        ]
    }
];