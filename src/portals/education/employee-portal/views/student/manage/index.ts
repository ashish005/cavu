import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {STUDENT_SERVICE} from "./services";
import {STUDENT_VIEWS, StudentRoutes} from "./student.routing";
import {STUDENT_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {STD_MANAGE_COMPONENTS} from "./components";
import {GlobalModule} from "@app-global";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(StudentRoutes),
        GlobalModule
    ],
    providers: [STUDENT_SERVICE],
    declarations: [STUDENT_VIEWS, STUDENT_GRID_COLUMN_CELL_COMPONENTS, STD_MANAGE_COMPONENTS]
})
export class StudentManageModule{}
