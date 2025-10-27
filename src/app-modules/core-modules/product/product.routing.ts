import {Routes} from "@angular/router";

export const ProductRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo:'manage' },
    {
        path: 'manage', data: { translatePath: 'modules.project.manage' },
        loadChildren: () => import('app-modules/core-modules/product/manage').then(m => m.ProductManageModule)
    },
    {
        path: ':productId', data: { translatePath: 'modules.project.sub_module' },
        loadChildren: () => import('app-modules/core-modules/product/by-id').then(m => m.ProductByIdModule)
    }
];
