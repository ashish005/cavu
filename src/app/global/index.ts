import { SetupLayout } from "./layouts";
import { moduleGuard } from "./services/orgwise/entitlement/module.guard";
import {Route, Routes} from "@angular/router";
export * from "./layouts";
export {CoreProcessFactory} from "./pluginFactory";
export * from "./modules/entity-workflow";
export * from "./components/aside-panel";

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

/** Old admin finance URLs (accounting, reports, trxn-setup, tax-management) → the matching finance workspace page. */
const FIN = '/app/admin/invoice';
const legacy = (path: string, home: string, pages: Record<string, string> = {}): Route => ({
    path, children: [
        {path: '', pathMatch: 'full', redirectTo: `${FIN}/${home}`},
        ...Object.entries(pages).map(([page, to]): Route => ({path: page, pathMatch: 'full', redirectTo: `${FIN}/${to}`})),
        {path: '**', redirectTo: `${FIN}/${home}`}
    ]
});
const LEGACY_FINANCE_REDIRECTS: Routes = [
    legacy('accounting', 'accounting/chart', {
        ledger: 'reports?tab=ledger', book: 'banking', 'account-book': 'banking', 'cash-book': 'banking', 'bank-ledger': 'banking', 'day-book': 'reports?tab=journals',
        report: 'reports', 'profit-loss': 'reports?tab=pl', 'balance-sheet': 'reports?tab=bs', 'trial-balance': 'reports?tab=tb', 'ledger-trial-balance': 'reports?tab=tb',
        trxn: 'reports?tab=journals', setup: 'accounting/chart'
    }),
    legacy('reports', 'reports?tab=analysis', {
        sale: 'reports?tab=analysis&side=sales', purchase: 'reports?tab=analysis&side=purchases', payment: 'reports?tab=analysis&side=payments',
        receipt: 'reports?tab=analysis&side=receipts', inventory: 'products/reports', transaction: 'reports?tab=journals'
    }),
    legacy('trxn-setup', 'settings/document-types', {
        bank: 'banking', 'bank-setup': 'banking', 'bank-trxn': 'banking', cash: 'banking', wallet: 'banking', 'payment-gateway': 'banking',
        mode: 'settings/payment-modes', digital: 'settings/payment-modes', voucher: 'settings/document-types', 'voucher-setup': 'settings/document-types'
    }),
    legacy('tax-management', 'settings/tax-codes')
];

export const ADMIN_SETUP_ROUES: Routes = [
    {
        path: 'admin',
        component: SetupLayout,
        //canActivate:[PortalAuthGuard], canLoad: [ModuleGuard],
        children: [
            { path: 'setup', loadChildren: () => import('app-modules/org-setup/index').then(m => m.OrgIdentitySetupModule), data: {code: "ACCESS_TASK_MGT", title: 'Process', key: 'process', header: 'process'} },
            { path: 'process', canMatch: [moduleGuard], loadChildren: () => import('app-modules/admin-modules/org-process-management/index').then(m => m.ProcessManageModule), data: {code: "ACCESS_TASK_MGT", module: "PROCESS_MGT", title: 'Process', key: 'process', header: 'process'} },
            { path: 'parties', canMatch: [moduleGuard], loadChildren: () => import('app-modules/admin-modules/org-party-management/index').then(m => m.PartyManageModule), data: {module: "FIN", title: 'Customers, vendors & employees', key: 'parties', header: 'Parties'} },
            { path: 'compliance', canMatch: [moduleGuard], loadChildren: () => import('app-modules/admin-modules/org-compliance-management/index').then(m => m.ComplianceManageModule), data: {module: "CMP", title: 'Compliance', key: 'compliance', header: 'Compliance'} },
            { path: 'org-log', loadChildren: () => import('app-modules/admin-modules/org-log-management/index').then(m => m.OrgLogModule), data: {title: 'Log', header: 'Log'} },
            // Finance workspace (chart, bank & cash, reports, tax, document types, document capture) for administrators.
            { path: 'invoice', canMatch: [moduleGuard], loadChildren: () => import('app-modules/core-modules/org-voucher/index').then(m => m.FinanceModule), data: {code: "FIN", module: "FIN", title: 'Finance', header: 'Finance'} },
            // Earlier admin finance screens now live in the finance workspace.
            ...LEGACY_FINANCE_REDIRECTS,
            { path: 'subscription', loadChildren: () => import('app-modules/admin-modules/org-subscription/index').then(m => m.OrgSubscriptionModule), data: { key:'Subscription', icon:"fa fa-money", name: "Subscription", title: 'Subscription', header:'Subscription' } },
            {
                path: 'payroll', //canLoad:[ModuleGuard],
                loadChildren: () => import('app-modules/admin-modules/org-payroll-management').then(m => m.SalaryModule),
                data: {title: 'Trxn', header: 'Payroll', name: "Payroll", key: 'Payroll'}//code: "ACCESS_VT_MGT",
            },
            {
                path: 'org-team', loadChildren: () => import('app-modules/admin-modules/org-team-management/index').then(m => m.TeamSetupModule),
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
            { routeTo: ['invoice/sales/quotes'], icon:"fa fa-file-o", key: "Quotes" },
            { routeTo: ['office-expense'], icon:"fa fa-money", key: "Office Expenses" }
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
            { routeTo: ['supplier'], icon:"fa fa-bell", key: 'Supplier' },// code: "PERM_VENDOR",
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
