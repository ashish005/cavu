import { SetupLayout } from "./layouts";

export const ADMIN_SETUP = [
    {
        path: 'setup',
        component: SetupLayout,
        //canActivate:[PortalAuthGuard], canLoad: [ModuleGuard],
        children: [
            { path: '', pathMatch: 'full', redirectTo:'org-setup' },
            {
                path: 'org-setup',
                loadChildren: () => import('app-modules/app-identity/org-setup/index').then(m => m.OrgSetupModule),
                data: {code: "ACCESS_ORG_MGR", title: 'Organization', header: 'Organization'}
            },
            {
                path: 'subscription',
                loadChildren: () => import('app-modules/app-identity/org-subscription/index').then(m => m.OrgSubscriptionModule),
                data: { key:'Subscription', icon:"fa fa-money", name: "Subscription", title: 'Subscription', header:'Subscription' }
            },
            {
                path: 'role-permission-setup',
                loadChildren: () => import('app-modules/app-identity/module-permission/index').then(m => m.ManageUserModule),
                data: { key:'list', icon:"fa fa-money", name: "Money", title: 'Team', header:'Team' }//code: "ACCESS_USR_LOGIN"
            },
            {
                path: 'org-log',
                loadChildren: () => import('app-modules/app-admin/org-log/index').then(m => m.OrgLogModule),
                data: {title: 'Log', header: 'Log'}
            },
            {
                path: 'process', //canLoad: [PortalAuthGuard],
                loadChildren: () => import('app-modules/core-modules/org-process/index').then(m => m.ProcessModule),
                data: {code: "ACCESS_TASK_MGT", title: 'Process', key: 'process', header: 'process'}
            },
            {
                path: 'notification', //canLoad: [PortalAuthGuard],
                loadChildren: () => import('app-modules/app-admin/notification/index').then(m => m.NotificationModule),
                data: { icon:"fa fa-envelope-open", code: "ACCESS_NOTIFY_MGT", title: 'Access Setup', header:'Access Setup', name: "Notification", key: 'layout.notification'}
            },
            {
                path: 'compliance', //canLoad: [PortalAuthGuard],
                loadChildren: () => import('app-modules/app-admin/compliance/index').then(m => m.ComplianceModule),
                data: {title: 'Compliance', header: 'Compliance'}
            },
            {
                path: 'tax-management', //canLoad: [PortalAuthGuard],
                loadChildren: () => import('app-modules/app-admin/tax-management/index').then(m => m.TaxManagementModule),
                data: {code: "ACCESS_TAX_MGT", title: 'Tax', header: 'Manage Tax'}
            },
            {
                path: 'setup-trxn',
                loadChildren: () => import('app-modules/app-admin/setup-transaction/index').then(m => m.SetupTransactionModule),
                data: {title: 'Bank', header: 'Bank', name: "Banking", key: 'layout.banking'}//code: "ACCESS_VT_MGT",
            },
            { path: 'login-setup',
                loadChildren: () => import('app-modules/app-admin/access-setup/contacts/index').then(m => m.ContactsModule),
                data: { icon:"fa fa-users", code: "ACCESS_USR_LOGIN", name: "User Permission", key: 'layout.all_contacts' }
            },
            { path: 'module-access-setup',
                loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/index').then(m => m.ContactAccessSetupModule),
                //data: { userType: ORG_USER_TYPE.EMPLOYEE }
            },
            {
                path: 'org-team',
                loadChildren: () => import('app-modules/app-admin/team-setup/index').then(m => m.TeamSetupModule),
                data: { icon:"fa fa-money", name: "Money", key: 'layout.team', title: 'Team', header:'Team' }//code: "TEAM",
            },
            {
                path: 'integration',
                loadChildren: () => import('app-modules/app-admin/integration/index').then(m => m.IntegrationModule),
                data: {title: 'Integration', header: 'Integration'}//code: '',
            },
            {
                path: 'quiz',
                loadChildren: () => import('app-modules/app-admin/quiz/index').then(r => r.QuizModule),
                data: {title: 'Quiz', header: 'Quiz'}
            },
            {
                path: 'transaction-setup',
                loadChildren: () => import('app-modules/app-admin/setup-transaction/index').then(m => m.SetupTransactionModule),
                data: {code: "ACCESS_ORG_MGR", title: 'Organization', header: 'Organization'}
            },
            {
                path: 'bank-trxn', //canLoad:[ModuleGuard],
                loadChildren: () => import('app-modules/app-admin/setup-transaction/transaction').then(m => m.BankTransactionModule),
                data: {title: 'Trxn', header:'Bank Trxn', name: "Bank Trxn", key: 'layout.banking' }//code: "ACCESS_VT_MGT",
            },
            {
                path: 'payroll', //canLoad:[ModuleGuard],
                loadChildren: () => import('app-modules/app-admin/salary').then(m => m.SalaryModule),
                data: {title: 'Trxn', header:'Payroll', name: "Payroll", key: 'Payroll' }//code: "ACCESS_VT_MGT",
            }
        ]
    }
];