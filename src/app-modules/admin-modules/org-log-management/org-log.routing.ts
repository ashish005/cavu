import {RouterModule, Routes} from "@angular/router";
import {DefaultView} from "./views/view";
import {Layout} from "./layout/layout";
import {OrgTaskLogView} from "./views/org-task-log.view";
import {DataLogView} from "./views/data-log.view";
import {ErrorLogView} from "./views/error-log.view";

export const ErrorLogRoutes: Routes = [
  {
    path: '', component: Layout, //resolve: { items: LogAPIResolver },
    children:[
      { path: '', pathMatch: 'full', redirectTo:'error' },
      { path: 'error', component: ErrorLogView, data: { title: 'Error' } },
      { path: 'data', component: DataLogView, data: { title: 'Data' } },
      { path: 'org-task', component: OrgTaskLogView, data: { title: 'Org Task' } }
    ]
  },
];

export const LOG_ROUTES = RouterModule.forChild(ErrorLogRoutes);

export const LOG_VIEWS = [Layout, DefaultView, ErrorLogView, DataLogView, OrgTaskLogView];
