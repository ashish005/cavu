import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GlobalModule} from "@app-global";
import {RouterModule, Routes} from "@angular/router";
import {PROJECT_VIEWS, ProjectRoutes} from "./project.routing";
import {PROJECT_COMPONENT} from "./components";
import {PROJECT_SERVICES} from "./services";
import {PROJECT_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(ProjectRoutes),
        GlobalModule
    ],
    providers: [PROJECT_SERVICES],
    declarations: [PROJECT_VIEWS, PROJECT_COMPONENT, PROJECT_GRID_COLUMN_CELL_COMPONENTS]
})
export class ProjectByIdModule{}
