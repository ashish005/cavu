import {RouterModule, Routes} from "@angular/router";

export const OrgUserRoutes: Routes = [
  {
    path: '',
    children:[
      { path: '', pathMatch: 'full', redirectTo:'manage' },
      {
        path: 'manage',
        loadChildren: () => import('app-modules/core-modules/org-employee/manage').then(m => m.OrgEmployeeManageModule)
      },
      {
        path: 'master',
        loadChildren: () => import('app-modules/core-modules/org-employee/master-type').then(m => m.OrgEmployeeMasterModule)
      },
    ]
  },
];
