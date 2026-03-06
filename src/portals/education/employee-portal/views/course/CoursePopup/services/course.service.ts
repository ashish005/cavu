import {Injectable, Injector} from '@angular/core';
import  { OrgResourceService } from "@app-global";
import {Course, CourseSerializer} from "../domain/course.serializer";
import {CourseSection, CourseSectionSerializer} from "../domain/course-section.serializer";

@Injectable()
export class CourseService extends OrgResourceService<Course>{
    constructor(public override injector: Injector) { super(injector, 'course', new CourseSerializer()); }
}

@Injectable()
export class CourseSectionService extends OrgResourceService<CourseSection>{
    constructor(public override injector: Injector) { super(injector, 'course-section', new CourseSectionSerializer()); }
}