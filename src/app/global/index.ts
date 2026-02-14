import {
    AdminAccountLayout,
    AdminComplianceLayout,
    AdminLogLayout,
    AdminProcessLayout,
    AdminSetupLayout,
    SetupLayout
} from "./layouts";

export {CoreProcessFactory} from "./pluginFactory";

export {GlobalModule} from "./library.module";

export * from "./animations";
export * from "./components";
export * from "./enums";
export * from "./extender-classes";
export * from './helpers';
export * from './lookups';
export * from "./services";
export * from "./pipes";
export * from "./popup-module/app-popup.enum";

export * from "./modules";

export { AppTitleService } from "./app-title.service";
export { SharedService } from "./shared.service";

export const ADMIN_SETUP_ROUES = [
    {
        path: 'admin',
        component: SetupLayout,
        //canActivate:[PortalAuthGuard], canLoad: [ModuleGuard],
        children: [
            {
                path: 'setup', component: AdminSetupLayout,
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
                    { path: 'module-access-setup',
                        loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/index').then(m => m.ContactAccessSetupModule),
                        //data: { userType: ORG_USER_TYPE.EMPLOYEE }
                    },
                    {
                        path: 'org-team',
                        loadChildren: () => import('app-modules/app-admin/team-setup/manage/index').then(m => m.TeamSetupModule),
                        data: { icon:"fa fa-money", name: "Money", key: 'layout.team', title: 'Team', header:'Team' }//code: "TEAM",
                    },
                    {
                        path: 'notification', //canLoad: [PortalAuthGuard],
                        loadChildren: () => import('app-modules/app-admin/notification/index').then(m => m.NotificationModule),
                        data: { icon:"fa fa-envelope-open", code: "ACCESS_NOTIFY_MGT", title: 'Access Setup', header:'Access Setup', name: "Notification", key: 'layout.notification'}
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
            },
            { path: 'process', component: AdminProcessLayout, loadChildren: () => import('app-modules/admin-modules/org-process-management/index').then(m => m.ProcessModule), data: {code: "ACCESS_TASK_MGT", title: 'Process', key: 'process', header: 'process'} },
            { path: 'compliance', component: AdminComplianceLayout, loadChildren: () => import('app-modules/admin-modules/org-compliance-management/index').then(m => m.ComplianceModule), data: {title: 'Compliance', header: 'Compliance'} },
            { path: 'org-log', component: AdminLogLayout, loadChildren: () => import('../../app-modules/admin-modules/org-log-management/index').then(m => m.OrgLogModule), data: {title: 'Log', header: 'Log'} },
            { path: 'accounting', component: AdminAccountLayout, loadChildren: () => import('app-modules/admin-modules/org-account-management').then(m => m.AccountingModule), data: {code: "FIN" } },
        ]
    }
];

export const EMPLOYEE_COMMON_ROUES = [
    {
        isFLatChildren: false, key: 'Account & Finance',
        children:[
            { routeTo: ['accounting/dashboard'], icon:"fa fa-dashboard", code: "FIN", key: 'Accounting Dashboard' },
            { routeTo: ['accounting/ledger'], icon:"fa fa-group", code: "", key: 'Account' },
            { routeTo: ['accounting/book'], icon:"fa fa-bell", code: "", key: 'Account Book' },//code: "COM"
            { routeTo: ['accounting/report'], icon:"fa fa-bell", code: "", key: 'Financial Report' },//code: "COM"
            { routeTo: ['accounting/trxn'], icon:"fa fa-bell", code: "", key: 'Financial Trxn' },//code: "COM"
            { routeTo: ['office-expense'], icon:"fa fa-dashboard", key: "Office Expenses" },
            { routeTo: ['manage-invoice'], icon:"fa fa-dashboard", key: "Invoices" }
        ]
    },
    {
        isFLatChildren: false, key: 'Reports',
        children:[
            { routeTo: ['reports/sale'], icon:"fa fa-group", code: "", key: 'Sale Report' },
            { routeTo: ['reports/purchase'], icon:"fa fa-bell", code: "", key: 'Purchase Report' },//code: "COM"
            { routeTo: ['reports/payment'], icon:"fa fa-bell", code: "", key: 'Payment Report' },//code: "COM"
            { routeTo: ['reports/receipt'], icon:"fa fa-bell", code: "", key: 'Receipt Report' },//code: "COM"
            { routeTo: ['reports/inventory'], icon:"fa fa-dashboard", key: "Inventory Report" },
            { routeTo: ['manage-invoice'], icon:"fa fa-dashboard", key: "Invoices" }
        ]
    },
    {
        isFLatChildren: false, key: 'Others',
        children:[
            { routeTo: ['compliance-report'], icon:"fa fa-group", code: "", key: 'Audit & Compliance' }
        ]
    },
    {
        isFLatChildren: false, key: 'Contact',
        children:[
            { routeTo: ['org-emp'], icon:"fa fa-group", code: "EMP", key: 'mainLayout.user.employee' },
            { routeTo: ['vendor'], icon:"fa fa-bell", code: "PERM_VENDOR", key: 'mainLayout.user.supplier' },//code: "COM"
            { routeTo: ['client'], icon:"fa fa-bell", code: "PERM_CLIENT", key: 'mainLayout.user.client' },//code: "COM"
        ]
    },
    /*{
          isFLatChildren: false, key: 'mainLayout.heading.pay_roll',
          children:[
              { routeTo: ['salary'], icon:"fa fa-credit-card", code: "SAL", name: "Salary", key: 'layout.salary' },
              { routeTo: ['salary/payroll'], icon:"fa fa-users", code:'SAL_PAYROLL', name: "Pay Roll", key: 'layout.payroll' }
          ]
      },*/
];
