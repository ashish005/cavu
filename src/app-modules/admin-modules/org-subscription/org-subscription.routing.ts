import {Routes} from "@angular/router";
import {SubscriptionLayout} from "./layout/layout";
import {LicenseInfoView} from "./views/license-info.view";
import {PaymentView} from "./views/payment.view";
import {PaymentSuccessView} from "./views/payment-success.view";
import {LicenseHistoryView} from "./views/license-history.view";
import {SoftwareInvoiceView} from "./views/software-invoice.view";
import {ManageSubscriptionView} from "./views/manage-subscription.view";
import {PaymentReturnView} from "./views/payment-return.view";

export const SubscriptionRoutes: Routes = [
    {
        path: '', component: SubscriptionLayout,
        children: [
            {path: '', pathMatch: 'full', redirectTo: 'info'},
            {path: 'info', component: LicenseInfoView, data: {title: 'License', key: 'info', header: 'License'}},
            {path: 'payment', component: PaymentView, data: {title: 'Plans & Payment', key: 'payment', header: 'Plans & Payment'}},
            {path: 'manage', component: ManageSubscriptionView, data: {title: 'Manage subscription', key: 'manage', header: 'Manage subscription'}},
            {path: 'payment-return', component: PaymentReturnView, data: {title: 'Payment', key: 'payment-return', header: 'Payment'}},
            {path: 'payment-success', component: PaymentSuccessView, data: {title: 'Payment', key: 'payment-success', header: 'Payment'}},
            {path: 'license-history', component: LicenseHistoryView, data: {title: 'License history', key: 'license-history', header: 'License history', icon: 'fa fa-history'}},
            {path: 'invoices', component: SoftwareInvoiceView, data: {title: 'Invoices', key: 'invoices', header: 'Invoices', icon: 'fa fa-file-text-o'}},
            {path: '**', redirectTo: 'info'}
        ]
    }
];

export const SUBSCRIPTION_VIEWS = [
    SubscriptionLayout, LicenseInfoView, PaymentView, PaymentSuccessView, LicenseHistoryView, SoftwareInvoiceView, ManageSubscriptionView, PaymentReturnView
];
