import {RouterModule, Routes} from "@angular/router";
import {CourseModuleAPIResolver} from "./services/api.resolver";
import {CourseMasterLayout} from "./layout/layout";

export const Course_Routes: Routes = [
  {
    path: '', component: CourseMasterLayout, resolve: { items: CourseModuleAPIResolver },
    data: { title: 'modules.course.title', header: 'modules.course.header' }
  }
];
export const COURSE_VIEWS = [ CourseMasterLayout ];
export const CourseRoute = RouterModule.forChild(Course_Routes);
