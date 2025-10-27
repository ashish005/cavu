import {Routes} from "@angular/router";

export const ProjectRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo:'manage' },
    {
        path: 'manage', data: { translatePath: 'modules.project.manage' },
        loadChildren: () => import('portals/real-estate/employee-portal/views/project/manage').then(m => m.ProjectManageModule)
    },
    {
        path: ':projectId', data: { translatePath: 'modules.project.sub_module' },
        loadChildren: () => import('portals/real-estate/employee-portal/views/project/by-id').then(m => m.ProjectByIdModule)
    }
];
