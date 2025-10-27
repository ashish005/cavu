import {Routes} from "@angular/router";

export const OrgSupplierRoutes: Routes = [
    {
        path: '',
        children:[
            { path: '', pathMatch: 'full', redirectTo:'manage' },
            { path: 'manage', loadChildren: () => import('portals/real-estate/employee-portal/views/supplier/manage').then(m => m.SupplierManagementModule) },
            { path: ':accountId', loadChildren: () => import('portals/real-estate/employee-portal/views/supplier/by-account-view').then(m => m.SupplierByAccountModule) }
        ]
    }
];