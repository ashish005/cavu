import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {DriverAPIResolver} from "./services/api.resolver";
import {DriverPaymentService, DriverPayoutService, DriverService} from "./services/driver.service";
import {DriverManageView} from "./views/driver-manage.view";
import {RouterModule} from "@angular/router";
import {DriverPayoutManageView} from "./views/driver-payout-manage.view";
import {DriverPaymentManageView} from "./views/driver-payment-manage.view";
import {Driver_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {DRIVER_COMPONENT} from "./components";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', data: {title: 'Driver', header:'Driver Management'},
                resolve: { items: DriverAPIResolver },
                component: DriverManageView
            },
            {
                path: 'payout', data: {title: 'Driver Payout', header:'Driver Payout Management'},
                component: DriverPayoutManageView
            },
            {
                path: 'payment', data: {title: 'Payment', header:'Payment Management'},
                component: DriverPaymentManageView
            }
        ]),
        GlobalModule
    ],
    providers: [
        DriverAPIResolver, DriverService, DriverPayoutService, DriverPaymentService
    ],
    declarations: [DriverManageView, DriverPayoutManageView, DriverPaymentManageView, Driver_GRID_COLUMN_CELL_COMPONENTS, DRIVER_COMPONENT]
})
export class DriverModule {}
