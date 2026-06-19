import {RouterModule, Routes} from "@angular/router";
import {LayoutCELayout, OrgEmployeeLayout} from "./layout/layout";
import {OrgEmployeeManageView} from "./views/manage.view";
import {OrgUserAPIResolver} from "./services";

export const OrgUserRoutes: Routes = [
  {
    path: '', component: OrgEmployeeLayout, resolve: { items: OrgUserAPIResolver },
    children:[
      { path: '', pathMatch: 'full', redirectTo:'manage' },
      { path: '', component: OrgEmployeeManageView, data: {  title: 'Manage', headers: 'Manage' } }
    ]
  },
];

export const ORG_USER_VIEWS = [
    OrgEmployeeLayout, LayoutCELayout, OrgEmployeeManageView
];