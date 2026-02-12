import { GlobalModule } from "@app-global";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
        {
            path: '',
            data: {code: 'FIN'},
            children: [
                { path: '', pathMatch: 'full', redirectTo:'sale' },
                { path: 'inventory', loadChildren: () => import('app-modules/core-modules/org-reports/inventory-reports').then(m => m.InventoryReportModule), data: { title: 'Inventory Reports', header:'Inventory Reports'} },
                { path: 'sale', loadChildren: () => import('app-modules/core-modules/org-reports/sale-reports').then(m => m.SaleReportModule), data: { title: 'Sale Reports', header:'Sale Reports'} },
                { path: 'purchase', loadChildren: () => import('app-modules/core-modules/org-reports/purchase-reports').then(m => m.PurchaseReportModule), data: { title: 'Purchase Reports', header:'Purchase Reports'} },
                { path: 'payment', loadChildren: () => import('app-modules/core-modules/org-reports/payment-reports').then(m => m.PaymentReportModule), data: { title: 'Payment Reports', header:'Payment Reports'} },
                { path: 'receipt', loadChildren: () => import('app-modules/core-modules/org-reports/receipt-reports').then(m => m.ReceiptReportModule), data: { title: 'Receipt Reports', header:'Receipt Reports'} }
            ]
        }
    ]),
    GlobalModule
  ],
  providers: [],
  declarations: []
})

export class OrgReportModule {
    static forRoot(): ModuleWithProviders<OrgReportModule> {
        return { ngModule: OrgReportModule };
    }
    static forChild(): ModuleWithProviders<OrgReportModule> {
        return { ngModule:  OrgReportModule };
    }
}
