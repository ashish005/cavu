import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {EMP_MASTER_VIEWS, EmployeeMasterRoutes} from "./master.routing";
import {GlobalModule} from "@app-global";
import {DutyCeComponent, PostCeComponent} from "./components";
import {GRID_CELL_COMPONENTS} from "./grid-cell";
import {EMP_MASTER_SERVICES} from "./services";
import {ReactiveFormsModule} from "@angular/forms";

const MASTER_COMPONENT = [ DutyCeComponent, PostCeComponent ];

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(EmployeeMasterRoutes),
        GlobalModule
    ],
    providers: [EMP_MASTER_SERVICES],
    declarations: [EMP_MASTER_VIEWS, MASTER_COMPONENT, GRID_CELL_COMPONENTS]
})
export class OrgEmployeeMasterModule{}
