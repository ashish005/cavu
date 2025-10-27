import {CommonModule} from "@angular/common";
import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {InvoiceLayout} from "./layout/invoice.layout";

@NgModule({
    declarations: [ InvoiceLayout ],
    imports: [
        CommonModule,
        //SchedulerPluginModule.forChild()
        RouterModule.forChild([
            {
                path: 'create/:voucherMasterType', component: InvoiceLayout, data: { hasVoucherId: false },
            }
        ])
    ],
    providers: [],
    exports: []
})
export class InvoiceCEModule{}
