import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CourseSeedService} from "./services/course-seeder.service";
import {COURSE_SEEDER_VIEWS, CourseSeederRoute} from "./course.routing";
import {COURSE_SEEDER_COMPONENTS, COURSE_SEEDER_ENTRY_COMPONENTS} from "./components";
import {CourseSeederAPIResolver} from "./services/api.resolver";
import {GlobalModule} from "@app-global";

const SEEDER_SERVICES = [ CourseSeederAPIResolver, CourseSeedService ];

@NgModule({
    imports: [
        CommonModule,
        CourseSeederRoute,
        GlobalModule
    ],
    providers: [SEEDER_SERVICES],
    declarations: [COURSE_SEEDER_VIEWS, COURSE_SEEDER_COMPONENTS]
})

export class CourseSeederModule{}
