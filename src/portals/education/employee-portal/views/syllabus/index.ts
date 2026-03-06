import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {SYLLABUS_VIEWS, SyllabusRoutes} from "./syllabus.routing";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(SyllabusRoutes),
        GlobalModule
    ],
    providers: [],
    declarations: [SYLLABUS_VIEWS]
})

export class SyllabusModule{}