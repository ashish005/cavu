import {RouterModule, Routes} from "@angular/router";
import {ProjectAPIResolver} from "./services";
import {ProjectLayout} from "./layout/layout";
import {ProjectManageView} from "./views/manage.view";

export const ProjectRoutes: Routes = [
    {
        path: '', component: ProjectLayout,
        resolve: { lookup: ProjectAPIResolver },
        data: { code:'', title: 'Project', icon: 'fa fa-dashboard', header: 'Manage Projects' },
        children: [
            { path: '', component: ProjectManageView }
        ]
    }
];

export const PROJECT_VIEWS = [ ProjectLayout, ProjectManageView ];
