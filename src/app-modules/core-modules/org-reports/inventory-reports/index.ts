import { GlobalModule } from "@app-global";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {InventoryByProductPriceView, InventoryByProductView, ManageInventoryView} from "./views";
import {InventoryLayout} from "./layout/inventory-layout";
import {INVENTORY_SERVICES} from "./services";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{
        path: '', component: InventoryLayout, //resolve: { items: InventoryAPIResolver },
        data: { code: 'FIN_REPORT', title: 'Report', header: 'Manage Finance'},
        children:[
            { path: '', pathMatch: 'full', redirectTo:'transaction' },
            { path: 'transaction', component: ManageInventoryView, data: { title: 'Inventory', header:'Inventory'} },
            { path: 'by-product', component: InventoryByProductView, data: { title: 'Inventory', header:'Inventory'} },
            { path: 'by-product-price', component: InventoryByProductPriceView, data: { title: 'Inventory', header:'Inventory'} }
        ]
    }]),
    GlobalModule
  ],
  providers: [...INVENTORY_SERVICES],
  declarations: [InventoryLayout, ManageInventoryView, InventoryByProductView, InventoryByProductPriceView]
})

export class InventoryReportModule {
    static forRoot(): ModuleWithProviders<InventoryReportModule> {
        return { ngModule: InventoryReportModule };
    }
    static forChild(): ModuleWithProviders<InventoryReportModule> {
        return { ngModule:  InventoryReportModule };
    }
}
