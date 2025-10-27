import {RouterModule, Routes} from "@angular/router";
import {DefaultView} from "./views/view";
import {LayoutComponent} from "./layout/layout";

export const DocRoutes: Routes = [
  {
    path: '', component: LayoutComponent,
    children:[
      { path: '', pathMatch: 'full', redirectTo:'view' },
      { path: 'view', component: DefaultView, data: { title: 'View' } }
    ]
  },
];

export const DOC_ROUTES = RouterModule.forChild(DocRoutes);

export const DOC_VIEWS = [LayoutComponent, DefaultView];
