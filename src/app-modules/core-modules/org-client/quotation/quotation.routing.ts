import {Routes} from "@angular/router";
import {QuotationLayout} from "./layout/layout";
import {ManageQuotationView} from "./views/manage-quotation.view";

export const QuotationRoutes: Routes = [
    {
        path: '', component: QuotationLayout, data: { translatePath: 'modules.invoice' },
        children: [
            { path: '', component: ManageQuotationView, data: { key: 'QUOTATION', code: "FIN_ACC_BOOK", icon: 'fa fa-dashboard' } }
        ]
    }
];

export const QUOTATION_VIEWS = [ QuotationLayout, ManageQuotationView ];
