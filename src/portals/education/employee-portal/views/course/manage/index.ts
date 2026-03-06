import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {CourseListInfoService, CourseSectionService, CourseService} from "./services/course.service";
import {COURSE_VIEWS, CourseRoute} from "./course.routing";
import {CourseModuleAPIResolver} from "./services/api.resolver";
import {CourseLookupService} from "./services/lookup.service";
import {COURSE_COMPONENTS} from "./components";
import {EduPluginModule} from "../CoursePopup";
import {GlobalModule} from "@app-global";
import {ReactiveFormsModule} from "@angular/forms";

const COURSE_SERVICES = [ CourseListInfoService, CourseService, CourseSectionService ];

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        CourseRoute,
        GlobalModule,
        EduPluginModule
    ],
    providers: [
        ...COURSE_SERVICES,
        CourseModuleAPIResolver,
        CourseLookupService
    ],
    declarations: [COURSE_COMPONENTS, COURSE_VIEWS]
})

export class ManageCourseModule{}
