import {moduleGuard} from "app/global/services/orgwise/entitlement/module.guard";

export const PortalCommonModuleRoutes = [
    { path: 'profile', loadChildren: () => import('app-modules/core-modules/profile').then(m => m.ProfileModule), data: { title: 'Profile', header:'Profile'} },
    { path: 'support', loadChildren: () => import('app-modules/core-modules/service-request').then(m => m.ServiceRequestModule), data: {title: 'Support', header: 'Support'} },
    { path: 'docs', loadChildren: () => import('app-modules/core-modules/docs/index').then(m => m.DocsModule), data: {title: 'Doc', header: 'Doc'} }
];

export const CoreCommonModuleRoutes = [
    { path: 'office-expense', loadChildren: () => import('app-modules/core-modules/office-expense').then(m => m.ExpenseModule), data: { code: 'OFC_EXPENSE', title: 'Expense', header:'Expense'} },//code: "EXPENSE",

    // Finance workspace on api/v1/finance (org-voucher): invoices, bills, money in/out, journals, accounts, reports, settings.
    { path: 'invoice', loadChildren: () => import('app-modules/core-modules/org-voucher/index').then(m => m.FinanceModule), data: {code: "FIN", title: 'Finance', header: 'Finance'} },
    { path: 'org-invoice', loadChildren: () => import('app-modules/core-modules/org-voucher/index').then(m => m.FinanceModule), data: {code: "FIN", icon: "fa fa-money", name: "Money", key: 'layout.money', title: 'Finance', header: 'Finance'} },
    // Older quotation menu links: quotes live in the finance workspace (Sales › Quotes).
    { path: 'quotation', pathMatch: 'full' as const, redirectTo: 'invoice/sales/quotes' },
    // Older "Audit & Compliance" menu links: compliance now lives in admin (org-compliance-management).
    { path: 'compliance-report', pathMatch: 'full' as const, redirectTo: '/app/admin/compliance/report' },

    // Employees, clients / customers and suppliers: the party screens on api/v1/parties (org-party-management).
    // Gated by module (EMP / FIN / VEN); titles use the organisation's own name for the role (Patient, Student…).
    { path: 'org-emp', canMatch: [moduleGuard], loadChildren: () => import('app-modules/admin-modules/org-party-management/index').then(m => m.PartyPortalModule), data: { role: 'employee', module: 'EMP', embedded: true, code: "EMP", title: 'Employees', header: 'Employees'} },
    { path: 'client', canMatch: [moduleGuard], loadChildren: () => import('app-modules/admin-modules/org-party-management/index').then(m => m.PartyPortalModule), data: { role: 'customer', module: 'FIN', embedded: true, title: 'Clients', header: 'Clients'} },
    { path: 'supplier', canMatch: [moduleGuard], loadChildren: () => import('app-modules/admin-modules/org-party-management/index').then(m => m.PartyPortalModule), data: { role: 'vendor', module: 'VEN', embedded: true, title: 'Suppliers', header: 'Suppliers'} },

    { path: 'my-task', loadChildren: () => import('app-modules/core-modules/my-task').then(m => m.MyTaskModule), data: {code: "ACCESS_TASK_MGT", title: 'Task', header:'Task'}  },//, canActivate:[ModuleGuard]
    { path: 'conversation', loadChildren: () => import('app-modules/core-modules/conversation').then(m => m.CommunicationModule), data: { code: "ACCESS_NOTIFY_MGT"} },//, canActivate:[ModuleGuard]
];
