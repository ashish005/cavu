import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ProjectRoutes} from "./project.routing";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ProjectRoutes)
    ],
    providers: [],
    declarations: []
})
export class ProjectModule{}
