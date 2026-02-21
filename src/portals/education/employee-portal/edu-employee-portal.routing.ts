import {Routes} from '@angular/router';
import {Layout} from "./layout/layout";
import {DashboardView} from "./views/dashboard/dashboard";
import {ADMIN_SETUP_ROUES, AppPermissionService} from "@app-global";
import {CoreCommonModuleRoutes, PortalCommonModuleRoutes} from "@app-core-module";

export const EDU_EMPLOYEE_Routes: Routes = [
    {
        path: '', //resolve: {permissions: AppPermissionService},
        component: Layout, data: { code: '', title: 'Fee Type', icon: 'fa fa-dashboard', header: 'Fee Type' },
        children: [
            { path: '', pathMatch: 'full', redirectTo:'dashboard' },
            { path: 'dashboard', component: DashboardView, data: { title: 'Dashboard', header:'Dashboard' } },// resolve: { items: DashboardAPIResolver },
            // { path: 'session', canLoad:[ModuleGuard], loadChildren: () => import('portals/education/employee-portal/views/session').then(m => m.SessionModule), data: { title: 'Session', header:'Session'} },
            //
            // { path: 'class', canLoad:[ModuleGuard], loadChildren: () => import('portals/education/employee-portal/views/class/manage').then(m => m.ClassManageModule), data: { title: 'Class', header:'Class'} },
            // { path: 'student', canLoad:[ModuleGuard], loadChildren: () => import('portals/education/employee-portal/views/student').then(m => m.StudentModule), data: { code: "STD", title: 'Student Fee', header:'Student Fee'} },//, canActivate:[ModuleGuard]
            //
            // { path: 'fee-plan', canLoad:[ModuleGuard], loadChildren: () => import('portals/education/employee-portal/views/fee/fee-plan').then(m => m.FeePlanModule), data: { code: "FEE", title: 'Student Fee', header:'Student Fee'} },
            //
            // { path: 'syllabus', canLoad:[ModuleGuard], loadChildren: () => import('portals/education/employee-portal/views/syllabus').then(m => m.SyllabusModule), data: { title: 'syllabus', header:'syllabus'} },
            //
            // { path: 'course', canLoad:[ModuleGuard], loadChildren: () => import('portals/education/employee-portal/views/course/manage').then(m => m.ManageCourseModule), data: { code:'COURSE', title: 'Course', header:'Course'} },
            // { path: 'seed-course', loadChildren: () => import('portals/education/employee-portal/views/course/seed').then(m => m.CourseSeederModule), data: { title: 'Course', header:'Course'} },// todo remove
            ...PortalCommonModuleRoutes,
            ...CoreCommonModuleRoutes
        ]
    },
    ...ADMIN_SETUP_ROUES
];
export const EDU_EMPLOYEE_VIEWS = [Layout, DashboardView];
