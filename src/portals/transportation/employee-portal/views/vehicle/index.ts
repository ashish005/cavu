import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Injectable, Injector, ModuleWithProviders, NgModule, OnInit} from "@angular/core";
import {VehicleAPIResolver} from "./services/api.resolver";
import {VehiclePayoutService, VehicleService} from "./services/vehicle.service";
import {VehicleManageView} from "./views/vehicle-manage.view";
import {RouterModule} from "@angular/router";
import {VEHICLE_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {VehiclePayoutManageView} from "./views/payout-manage.view";
import {VEHICLE_COMPONENTS} from "./components";
import {VehicleInspectionView} from "./views/vehicle-inspection.view";
import {VehicleInspectionScheduleService, VehicleInspectionService} from "./services/vehicle-inspection.service";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', data: {title: 'Vehicle', header:'Vehicle Management'},
                resolve: { items: VehicleAPIResolver },
                component: VehicleManageView
            },

            {
                path: 'payout', data: {title: 'Vehicle Payout', header:'Vehicle Payout Management'},
                component: VehiclePayoutManageView
            },
            {
                path: 'inspection', data: {title: 'Inspection History', header:'Inspection History'},
                resolve: { items: VehicleAPIResolver },
                component: VehicleInspectionView
            },
        ]),
        GlobalModule
    ],
    providers: [
        VehicleAPIResolver, VehicleService, VehiclePayoutService, VehicleInspectionService, VehicleInspectionScheduleService
    ],
    declarations: [VehicleManageView, VehiclePayoutManageView, VehicleInspectionView, VEHICLE_GRID_COLUMN_CELL_COMPONENTS, VEHICLE_COMPONENTS]
})
export class VehicleModule {}
