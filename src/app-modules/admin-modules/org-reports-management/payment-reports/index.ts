import {GlobalModule} from "@app-global";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {
    InvoiceByDayView,
    InvoiceByExecutiveView,
    InvoiceByPaymentView,
    InvoiceByProductView,
    InvoiceByVendorView
} from "./views";
import {InvoiceReportLayout} from "./layout/layout";
import {SALE_REPORT_SERVICES} from "./services";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
        {
            path: '', component: InvoiceReportLayout,
            children:[
                { path: '', pathMatch: 'full', redirectTo:'by-day' },
                { path: 'by-day', component: InvoiceByDayView, data: { title: 'Invoice', header:'Report By Day'} },
                { path: 'by-month', component: InvoiceByDayView, data: { title: 'Invoice', header:'Report By Month'} },
                { path: 'by-executive', component: InvoiceByExecutiveView, data: { title: 'Invoice', header:'Report By Executive'} },
                { path: 'by-payment', component: InvoiceByPaymentView, data: { title: 'Invoice', header:'Report By Payment'} },
                { path: 'by-product', component: InvoiceByProductView, data: { title: 'Invoice', header:'Report By Product'} },
                { path: 'by-vendor', component: InvoiceByVendorView, data: { title: 'Invoice', header:'Report By Vendor'} },
                { path: 'sale-day-return', component: InvoiceByDayView, data: { title: 'Invoice', header:'Report By Day'} },
                { path: 'purchase-day-return', component: InvoiceByDayView, data: { title: 'Invoice', header:'Report By Day'} }
            ]
        }
    ]),
    GlobalModule
  ],
  providers: [...SALE_REPORT_SERVICES],
  declarations: [InvoiceReportLayout, InvoiceByDayView, InvoiceByExecutiveView, InvoiceByPaymentView, InvoiceByProductView, InvoiceByVendorView]
})

export class PaymentReportModule {
    static forRoot(): ModuleWithProviders<PaymentReportModule> {
        return { ngModule: PaymentReportModule };
    }
    static forChild(): ModuleWithProviders<PaymentReportModule> {
        return { ngModule:  PaymentReportModule };
    }
}
