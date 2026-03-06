import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {StudentRoutes} from "./student.routing";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(StudentRoutes)
    ],
    providers: [],
    declarations: []
})
export class StudentModule{}
