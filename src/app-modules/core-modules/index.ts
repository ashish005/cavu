export const PortalCommonModuleRoutes = [
    { path: 'profile', loadChildren: () => import('app-modules/core-modules/profile').then(m => m.ProfileModule), data: { title: 'Profile', header:'Profile'} },
    { path: 'support', loadChildren: () => import('app-modules/core-modules/service-request').then(m => m.ServiceRequestModule), data: {title: 'Support', header: 'Support'} },
    { path: 'docs', loadChildren: () => import('app-modules/core-modules/docs/index').then(m => m.DocsModule), data: {title: 'Doc', header: 'Doc'} }
];

export const CoreCommonModuleRoutes = [
    { path: 'office-expense', loadChildren: () => import('app-modules/core-modules/office-expense').then(m => m.ExpenseModule), data: { code: 'OFC_EXPENSE', title: 'Expense', header:'Expense'} },//code: "EXPENSE",

    { path: 'invoice', loadChildren: () => import('app-modules/core-modules/org-voucher/create-voucher/index').then(m => m.InvoiceCEModule), data: {code: "FIN" } },
    //{ path: 'manage-invoice', loadChildren: () => import('app-modules/manage-invoice').then(m => m.InvoiceManageModule), data: {code: "FIN" } },
  { path: 'org-invoice', loadChildren: () => import('app-modules/app-admin/org-invoice/index').then(m => m.ManageMoneyModule), data: {icon:"fa fa-money", name: "Money", key: 'layout.money', title: 'Invoices', header:'Invoices' } },
    { path: 'compliance-report', loadChildren: () => import('app-modules/admin-modules/org-compliance-management/report/index').then(m => m.ComplianceReportModule), data: {title: 'Compliance', header: 'Compliance'} },

    { path: 'org-emp', loadChildren: () => import('app-modules/core-modules/org-employee/manage').then(m => m.OrgEmployeeManageModule), data: { code: "EMP", title: 'Employee', header:'Employee'} },

    { path: 'my-task', loadChildren: () => import('app-modules/core-modules/my-task').then(m => m.MyTaskModule), data: {code: "ACCESS_TASK_MGT", title: 'Task', header:'Task'}  },//, canActivate:[ModuleGuard]
    { path: 'conversation', loadChildren: () => import('app-modules/core-modules/conversation').then(m => m.CommunicationModule), data: { code: "ACCESS_NOTIFY_MGT"} },//, canActivate:[ModuleGuard]
];
