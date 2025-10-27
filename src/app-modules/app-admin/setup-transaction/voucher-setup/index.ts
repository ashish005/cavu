import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {VOUCHER_SETUP_COMPONENT} from "./components";
import {VOUCHER_SETUP_VIEWS, VoucherSetupRoutes} from "./voucher-setup.routing";
import {VOUCHER_TYPE_SERVICES} from "./services";
import {VoucherTypePhaseCellComponent} from "./grid-cells";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(VoucherSetupRoutes),
        GlobalModule
    ],
    providers: [VOUCHER_TYPE_SERVICES],
    declarations: [ ...VOUCHER_SETUP_VIEWS, ...VOUCHER_SETUP_COMPONENT, VoucherTypePhaseCellComponent]
})

export class VoucherSetupModule {}
