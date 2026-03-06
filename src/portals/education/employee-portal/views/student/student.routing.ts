import {Routes} from "@angular/router";

export const StudentRoutes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'manage'},
    {
        path: 'manage', data: {translatePath: 'modules.project.manage'},
        loadChildren: () => import('portals/education/employee-portal/views/student/manage').then(m => m.StudentManageModule)
    },
    {
        path: 'fee',
        //canLoad: [ModuleGuard],
        loadChildren: () => import('portals/education/employee-portal/views/student/student-fee').then(m => m.StudentFeeModule),
        data: {code: "FEE", title: 'Fee Collection', header: 'Fee Collection'}
    },
    {
        path: ':studentId', data: {translatePath: 'modules.project.sub_module'},
        loadChildren: () => import('portals/education/employee-portal/views/student/by-id').then(m => m.SubStudentModule)
    }
];
