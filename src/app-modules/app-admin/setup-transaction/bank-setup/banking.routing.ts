import {Routes} from "@angular/router";
import {BankSetupLayout} from "./layout/layout";

export const BankingRoutes: Routes = [
    {
        path: '', component: BankSetupLayout,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'bank' },
            { path: 'bank', loadChildren: () => import('app-modules/app-admin/setup-transaction/bank-setup/bank').then(m => m.BankModule) },
            { path: 'config', loadChildren: () => import('app-modules/app-admin/setup-transaction/bank-setup/trxn-config').then(m => m.TrxnConfigModule) }
        ]
    }
];