import {Routes} from "@angular/router";
import {BankSetupLayout} from "./layout/layout";
import {BankingSetupResolver} from "./bank-setup.service";

export const BankingRoutes: Routes = [
    {
        path: '', component: BankSetupLayout, resolve: { lookup: BankingSetupResolver },
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'bank' },
            { path: 'bank', loadChildren: () => import('./bank').then(m => m.BankModule) },
            { path: 'config', loadChildren: () => import('./trxn-config').then(m => m.TrxnConfigModule) }
        ]
    }
];