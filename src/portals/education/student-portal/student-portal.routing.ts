import {Routes} from '@angular/router';
import {LayoutComponent} from "./layout/layout";
import {DashboardView} from "./views/dashboard/dashboard";
import {UserInformationView} from "./views/user-information/user-information.view";
import {StudentBatchView} from "./views/student-batch.view";
import {TransationReportView} from "./views/transaction-report.view";
import {PortalCommonModuleRoutes} from "@app-core-module";

export const STUDENT_Routes: Routes = [
  {
    path: '', component: LayoutComponent, //resolve: { items: StudentPortalAPIResolver },
    children: [
      { path: '', pathMatch: 'full', redirectTo:'dashboard' },
      { path: 'dashboard', component: DashboardView, data: { title: 'Dashboard', header:'Dashboard' } },
      { path: 'user-details', component: UserInformationView, data: { title: 'Student Info', header:'Student Info'} },
      //{ path: 'event', loadChildren: () => import('app-modules/event-calendar').then(m => m.EventCalendarModule), data: { title: 'Attendance', header:'Attendance'} },
      //{ path: 'course', loadChildren: () => import('portals/education/student-fee').then(m => m.StudentFeeModule), data: { portal:'student', title: 'Course & Fee', header:'Course Fee'} },
      // { path: 'syllabus', loadChildren: () => import('app-settings/education-setup/syllabus').then(m => m.SyllabusModule), data: {code: "ACCESS_ORG", title: 'syllabus', header:'syllabus'}},
      {
          path: 'enrolled',
          children:[
              { path: '', pathMatch: 'full', redirectTo:'manage' },
              { path: 'manage', component: StudentBatchView, data: {title: 'Manage', header:'Fee Collection'} },
              { path: 'trxn-report', component: TransationReportView, data: {title: 'Transation Report', header:'Transation Report'} },
          ]
      },
      ...PortalCommonModuleRoutes
    ]
  }
];

export const STUDENT_VIEWS = [LayoutComponent, DashboardView, UserInformationView, StudentBatchView, TransationReportView];
