import {Routes} from "@angular/router";
import {Layout, SubLayout} from "./layout/layout";
import {TaxManagementModuleAPIResolver} from "./services";
import {ManageTaxView} from "./views/manage.view";
import {TaxCategoryView} from "./views/tax-category.view";

export const TaxManagementRoutes: Routes = [
  {
    path: '', component: Layout, resolve: { items: TaxManagementModuleAPIResolver },
    children: [
      { path: '', pathMatch: 'full', redirectTo:'all' },
      {
          path: 'all', component: SubLayout,
          children: [
              { path: '', pathMatch: 'full', redirectTo:'manage' },
              { path: 'manage', component: ManageTaxView, data: {title: 'Manage', header:'Manage Tax'} },
              { path: 'category', component: TaxCategoryView, data: {title: 'Category', header:'Manage Tax Category'} },
          ]
      },
      {
        path: ':id', component: SubLayout,
        children: [
            { path: '', pathMatch: 'full', redirectTo:'manage' },
            { path: 'manage', component: ManageTaxView, data: {title: 'Manage', header:'Manage Tax'} },
            { path: 'category', component: TaxCategoryView, data: {title: 'Category', header:'Manage Tax Category'} },
        ],
      }
    ]
  }
];

export const TAX_MANAGEMENT_VIEWS = [ Layout, SubLayout, ManageTaxView, TaxCategoryView ];
