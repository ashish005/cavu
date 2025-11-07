import {Routes} from '@angular/router';
import {Layout} from "./layout/layout";
//import {CoreCommonModuleRoutes, PortalCommonModuleRoutes} from "@app-core-module";

export const EDU_ADMIN_Routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
          { path: '', pathMatch: 'full', redirectTo:'org-setup' },
          // {
          //   path: 'org-log',
          //   loadChildren: () => import('app-modules/app-admin/org-log/index').then(m => m.OrgLogModule),
          //   data: {title: 'Log', header: 'Log'}
          // },
          // // {
          // //   path: 'process',
          // //   loadChildren: () => import('app-modules/core-modules/org-process/index').then(m => m.ProcessModule),
          // //   data: {code: "ACCESS_TASK_MGT", title: 'Process', key: 'process', header: 'process'}
          // // },
          // {
          //   path: 'notification',
          //   loadChildren: () => import('app-modules/app-admin/notification/index').then(m => m.NotificationModule),
          //   data: { icon:"fa fa-envelope-open", code: "ACCESS_NOTIFY_MGT", title: 'Access Setup', header:'Access Setup', name: "Notification", key: 'layout.notification'}
          // },
          // {
          //   path: 'compliance',
          //   loadChildren: () => import('app-modules/app-admin/compliance/index').then(m => m.ComplianceModule),
          //   data: {title: 'Compliance', header: 'Compliance'}
          // },
          // {
          //   path: 'tax-management',
          //   loadChildren: () => import('app-modules/app-admin/tax-management/index').then(m => m.TaxManagementModule),
          //   data: {code: "ACCESS_TAX_MGT", title: 'Tax', header: 'Manage Tax'}
          // },
          // {
          //   path: 'setup-trxn',
          //   loadChildren: () => import('app-modules/app-admin/setup-transaction/index').then(m => m.SetupTransactionModule),
          //   data: {title: 'Bank', header: 'Bank', name: "Banking", key: 'layout.banking'}//code: "ACCESS_VT_MGT",
          // },
          // { path: 'module-access-setup',
          //   loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/index').then(m => m.ContactAccessSetupModule),
          //   data: { userType: "employee" }
          // },
          // {
          //   path: 'role-permission-setup',
          //   loadChildren: () => import('app-modules/app-admin/access-setup/module-permission/index').then(m => m.ManageUserModule),
          //   data: { key:'list', icon:"fa fa-money", name: "Money", title: 'Team', header:'Team' }//code: "ACCESS_USR_LOGIN"
          // },
          // {
          //   path: 'org-team',
          //   loadChildren: () => import('app-modules/app-admin/team-setup/index').then(m => m.TeamSetupModule),
          //   data: { icon:"fa fa-money", name: "Money", key: 'layout.team', title: 'Team', header:'Team' }//code: "TEAM",
          // },
          // {
          //   path: 'integration',
          //   loadChildren: () => import('app-modules/app-admin/integration/index').then(m => m.IntegrationModule),
          //   data: {title: 'Integration', header: 'Integration'}//code: '',
          // },
          // {
          //   path: 'quiz',
          //   loadChildren: () => import('app-modules/app-admin/quiz/index').then(r => r.QuizModule),
          //   data: {title: 'Quiz', header: 'Quiz'}
          // },
          // {
          //   path: 'subscription',
          //   loadChildren: () => import('app-modules/app-admin/org-subscription/index').then(m => m.OrgSubscriptionModule),
          //   data: { key:'Subscription', icon:"fa fa-money", name: "Subscription", title: 'Subscription', header:'Subscription' }
          // },
          // {
          //   path: 'transaction-setup',
          //   loadChildren: () => import('app-modules/app-admin/setup-transaction/index').then(m => m.SetupTransactionModule),
          //   data: {code: "ACCESS_ORG_MGR", title: 'Organization', header: 'Organization'}
          // },
          // {
          //   path: 'bank-trxn',
          //   loadChildren: () => import('app-modules/app-admin/setup-transaction/transaction').then(m => m.BankTransactionModule),
          //   data: {title: 'Trxn', header:'Bank Trxn', name: "Bank Trxn", key: 'layout.banking' }//code: "ACCESS_VT_MGT",
          // },
          // {
          //   path: 'org-setup',
          //   loadChildren: () => import('app-modules/app-admin/org-setup/index').then(m => m.OrgSetupModule),
          //   data: {code: "ACCESS_ORG_MGR", title: 'Organization', header: 'Organization'}
          // },
          // {
          //   path: 'payroll',
          //   loadChildren: () => import('app-modules/app-admin/salary').then(m => m.SalaryModule),
          //   data: {title: 'Trxn', header:'Payroll', name: "Payroll", key: 'Payroll' }//code: "ACCESS_VT_MGT",
          // }
      ]
    }
];
export const EDU_ADMIN_VIEWS = [Layout];
