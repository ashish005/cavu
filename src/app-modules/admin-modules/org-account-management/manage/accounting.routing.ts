import {Routes} from "@angular/router";
import {LedgerView} from "./views/ledger.view";

import {AccountingAdminView} from "./views/admin-setup.view";
import {AccountingLayout} from "./layout/layout";
import {AccountingAPIResolver} from "./services";

export const AccountingRoutes: Routes = [
    {
        path: '', component: AccountingLayout, resolve: { items: AccountingAPIResolver },
        data: {code: 'FIN', title: 'Accounting', header: 'Finance'},
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'ledger' },
            { path: 'ledger', component: LedgerView, data: {code: "FIN", title: 'Ledger', header:'Ledger'}},
            { path: 'setup', component: AccountingAdminView, data: { code: "FIN_SETUP", title: 'Accounting Setup', header: 'Accounting Setup' } },

            {
                path: 'book', data: { translatePath: 'modules.project.manage' },
                loadChildren: () => import('../book').then(m => m.AccountingBookModule)
            },
            {
                path: 'report', data: { translatePath: 'modules.project.manage' },
                loadChildren: () => import('../reports').then(m => m.AccountingReportModule)
            },
            {
                path: 'trxn', data: { translatePath: 'modules.project.manage' },
                loadChildren: () => import('../transaction').then(m => m.AccountingTrxnModule)
            }
        ]
    }

];

export const ACCOUNTING_VIEWS = [
    AccountingLayout,
    LedgerView,
    AccountingAdminView
];
