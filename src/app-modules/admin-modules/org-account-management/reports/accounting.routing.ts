import {Routes} from "@angular/router";

import {ReportLayout} from "./layout/layout";
import { BalanceSheetReportView, ProfitLossReportView } from "./views";

export const AccountingReportRoutes: Routes = [
    {
        path: '', component: ReportLayout,
        children:[
            { path: '', pathMatch: 'full', redirectTo:'balance-sheet' },
            { path: 'balance-sheet', component: BalanceSheetReportView, data: { code: "FIN_BS", title: 'Balance Sheet', header:'Balance Sheet'} },
            { path: 'profit-loss', component: ProfitLossReportView, data: { code: "FIN_PRL", title: 'Profit Loss', header:'Profit Loss'} }
        ]
    }
];

export const ACCOUNTING_REPORT_VIEWS = [
    ReportLayout, BalanceSheetReportView, ProfitLossReportView
];
