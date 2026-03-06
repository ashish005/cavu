import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {SUB_STUDENT_VIEWS, SubStudentRoutes} from "./sub_student.routing";
import {SUB_STUDENT_SERVICE} from "./services";
import {SUB_STUDENT_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {SUB_STUDENT_COMPONENTS} from "./components";
import {GlobalModule} from "@app-global";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(SubStudentRoutes),
        GlobalModule
    ],
    providers: [SUB_STUDENT_SERVICE],
    declarations: [SUB_STUDENT_VIEWS, SUB_STUDENT_COMPONENTS, SUB_STUDENT_GRID_COLUMN_CELL_COMPONENTS]
})
export class SubStudentModule{}
