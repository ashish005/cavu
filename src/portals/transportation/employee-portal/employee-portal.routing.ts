import {Routes} from '@angular/router';
import {MainLayout} from "./layout/layout";
import {DashboardView} from "./views/dashboard/main";

export const EMPLOYEE_Routes: Routes = [
  {
    path: '', component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo:'dashboard' },
      { path: 'dashboard', component: DashboardView, data: { title: 'Dashboard', header:'Dashboard' } },
        {
            path: 'booking',
            data: { translatePath: 'modules.project.manage' },
            loadChildren: () => import('portals/transportation/employee-portal/views/booking').then(m => m.TrackerModule)
        },
        {
            path: 'driver',
            data: { translatePath: 'modules.project.sub_module' },
            loadChildren: () => import('portals/transportation/employee-portal/views/driver').then(m => m.DriverModule)
        },
        {
            path: 'vehicle',
            data: { translatePath: 'modules.project.sub_module' },
            loadChildren: () => import('portals/transportation/employee-portal/views/vehicle').then(m => m.VehicleModule)
        },
        {
            path: 'contractor',
            data: { translatePath: 'modules.project.sub_module' },
            loadChildren: () => import('portals/transportation/employee-portal/views/contractor').then(m => m.ContractorModule)
        },
        {
            path: 'payout-plan', //canLoad:[ModuleGuard],
            loadChildren: () => import('portals/transportation/employee-portal/views/payout-plan').then(m => m.PayoutPlanModule),
            data: { title: 'Payout Plan', header:'Payout Plan'}
        },
        //...PortalCommonModuleRoutes, ...CoreCommonModuleRoutes
    ]
  }
];
