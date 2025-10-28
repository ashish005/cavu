import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GlobalModule} from "@app-global";
import {RouterModule} from "@angular/router";
import {TASK_BY_ID_VIEWS, TaskByIdRoutes} from "./task-by-id.routing";
import {TASK_SERVICES} from "./services";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(TaskByIdRoutes),
      GlobalModule
    ],
    providers: [TASK_SERVICES],
    declarations: [TASK_BY_ID_VIEWS]
})
export class TaskByIdModule{}
