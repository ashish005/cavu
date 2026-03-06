import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FEE_BY_SERVICES} from "./services";
import {STUDENT_FEE_GRID_CELL_COMPONENTS} from "./grid-cells";
import {STUDENT_FEE_VIEWS, StudentFeeRoutes} from "./student-fee.routing";
import {FeePaymentPluginModule} from "./components/fee-payment";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(StudentFeeRoutes),
        GlobalModule,
        FeePaymentPluginModule.forChild()
    ],
    providers: [FEE_BY_SERVICES],
    declarations: [ STUDENT_FEE_VIEWS, STUDENT_FEE_GRID_CELL_COMPONENTS]
})

export class StudentFeeModule{}
