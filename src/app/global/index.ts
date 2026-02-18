import { SetupLayout } from "./layouts";
import {Routes} from "@angular/router";
export * from "./layouts";
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

export const ADMIN_SETUP_ROUES: Routes = [
    {
        path: 'admin',
        component: SetupLayout,
        //canActivate:[PortalAuthGuard], canLoad: [ModuleGuard],
        children: [
            { path: 'setup', loadChildren: () => import('app-modules/admin-modules/app-identity/index').then(m => m.OrgIdentitySetupModule), data: {code: "ACCESS_TASK_MGT", title: 'Process', key: 'process', header: 'process'} },
            { path: 'process', loadChildren: () => import('app-modules/admin-modules/org-process-management/index').then(m => m.ProcessManageModule), data: {code: "ACCESS_TASK_MGT", title: 'Process', key: 'process', header: 'process'} },
            { path: 'compliance', loadChildren: () => import('app-modules/admin-modules/org-compliance-management/index').then(m => m.ComplianceManageModule), data: {title: 'Compliance', header: 'Compliance'} },
            { path: 'org-log', loadChildren: () => import('app-modules/admin-modules/org-log-management/index').then(m => m.OrgLogModule), data: {title: 'Log', header: 'Log'} },
            { path: 'accounting', loadChildren: () => import('app-modules/admin-modules/org-account-management').then(m => m.AccountingManageModule), data: {code: "FIN" } },
            { path: 'reports', loadChildren: () => import('app-modules/admin-modules/org-reports-management/index').then(m => m.OrgReportModule), data: {code: "FIN" } },
            { path: 'subscription', loadChildren: () => import('app-modules/admin-modules/org-subscription/index').then(m => m.OrgSubscriptionModule), data: { key:'Subscription', icon:"fa fa-money", name: "Subscription", title: 'Subscription', header:'Subscription' } },
            { path: 'trxn-setup', loadChildren: () => import('app-modules/admin-modules/trxn-setup-management/index').then(m => m.SetupTransactionModule), data: {code: "FIN" } },
            {
                path: 'tax-management', //canLoad: [PortalAuthGuard],
                loadChildren: () => import('app-modules/admin-modules/org-tax-management/index').then(m => m.TaxManagementModule),
                data: {code: "ACCESS_TAX_MGT", title: 'Tax', header: 'Manage Tax'}
            },
            {
                path: 'payroll', //canLoad:[ModuleGuard],
                loadChildren: () => import('app-modules/admin-modules/org-payroll-management').then(m => m.SalaryModule),
                data: {title: 'Trxn', header: 'Payroll', name: "Payroll", key: 'Payroll'}//code: "ACCESS_VT_MGT",
            },
            {
                path: 'org-team', loadChildren: () => import('app-modules/admin-modules/org-team-management/manage/index').then(m => m.TeamSetupModule),
                data: {icon: "fa fa-money", name: "Money", key: 'layout.team', title: 'Team', header: 'Team'}//code: "TEAM",
            },
            {
                path: 'notification', loadChildren: () => import('app-modules/admin-modules/org-notification-managment/index').then(m => m.NotificationModule),
                data: {
                    icon: "fa fa-envelope-open",
                    code: "ACCESS_NOTIFY_MGT",
                    title: 'Access Setup',
                    header: 'Access Setup',
                    name: "Notification",
                    key: 'layout.notification'
                }
            },
        ]
    }
];

export const EMPLOYEE_COMMON_ROUES = [
    {
        isFLatChildren: false, key: 'Account & Finance',
        children:[
            { routeTo: ['office-expense'], icon:"fa fa-dashboard", key: "Office Expenses" }
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
            { routeTo: ['org-emp'], icon:"fa fa-group", key: 'Employee' },// code: "EMP",
            { routeTo: ['vendor'], icon:"fa fa-bell", key: 'Supplier' },// code: "PERM_VENDOR",
            { routeTo: ['client'], icon:"fa fa-bell", key: 'Client' },// code: "PERM_CLIENT"
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
