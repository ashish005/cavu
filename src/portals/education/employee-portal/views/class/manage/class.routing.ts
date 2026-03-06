import {Routes} from "@angular/router";
import {
  LayoutComponent
} from "./layout/layout";
import {ClassManageView} from "./views/manage.view";
import {OrgClassModuleAPIResolver} from "./services/api-resolver.service";

export const ClassRoutes: Routes = [
  {
    path: '', component: LayoutComponent, resolve: { items: OrgClassModuleAPIResolver },
    children: [
      { path: '', pathMatch: 'full', redirectTo:'manage' },
      { path: 'manage', component: ClassManageView, data: {title: 'Manage', header:'Manage Class'} },
      { path: 'mode/:id', component: ClassManageView, data: {title: 'Manage', header:'Manage Class'} }
    ]
  }
];

export const CLASS_VIEWS = [
  LayoutComponent,
  ClassManageView
];
