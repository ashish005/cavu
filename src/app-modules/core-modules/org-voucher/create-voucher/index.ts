import {CommonModule} from "@angular/common";
import { NgModule } from "@angular/core";
import {RouterModule} from "@angular/router";
import {VoucherCreateLayout} from "./layout/invoice.layout";
import {CoreVoucherCEModule} from "@app-lib";

@NgModule({
    imports: [
        CommonModule, CoreVoucherCEModule,
        //SchedulerPluginModule.forChild()
        RouterModule.forChild([
            {
                path: 'create/:voucherMasterType', component: VoucherCreateLayout, data: { hasVoucherId: false },
            }
        ])
    ],
    declarations: [ VoucherCreateLayout ],
    exports: [CoreVoucherCEModule]
})
export class InvoiceCEModule{}
