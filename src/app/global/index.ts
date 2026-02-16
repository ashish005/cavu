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
            { path: 'subscription', loadChildren: () => import('app-modules/admin-modules/app-identity/org-subscription/index').then(m => m.OrgSubscriptionModule), data: { key:'Subscription', icon:"fa fa-money", name: "Subscription", title: 'Subscription', header:'Subscription' } },
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
        isFLatChildren: false, key: 'Reports',
        children:[
            { routeTo: ['reports/sale'], icon:"fa fa-group", code: "", key: 'Sale Report' },
            { routeTo: ['reports/purchase'], icon:"fa fa-bell", code: "", key: 'Purchase Report' },//code: "COM"
            { routeTo: ['reports/payment'], icon:"fa fa-bell", code: "", key: 'Payment Report' },//code: "COM"
            { routeTo: ['reports/receipt'], icon:"fa fa-bell", code: "", key: 'Receipt Report' },//code: "COM"
            { routeTo: ['reports/inventory'], icon:"fa fa-dashboard", key: "Inventory Report" }
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
