import {Injectable, Injector} from '@angular/core';
import  { OrgResourceService } from "@app-global";
import {CourseListInfo, CourseListInfoSerializer} from "../domains/course-list-info.serializer";
import {Course, CourseQueryOptions, CourseSerializer} from "../domains/course.serializer";
import {CourseSection, CourseSectionSerializer} from "../domains/course-section.serializer";

@Injectable()
export class CourseListInfoService extends OrgResourceService<CourseListInfo>{
  constructor(public override injector: Injector) { super(injector, 'course/list', new CourseListInfoSerializer()); }
}

@Injectable()
export class CourseService extends OrgResourceService<Course>{
  constructor(public override injector: Injector) { super(injector, 'course', new CourseSerializer()); }
}

@Injectable()
export class CourseSectionService extends OrgResourceService<CourseSection>{
  private query = new CourseQueryOptions();
  constructor(public override injector: Injector) { super(injector, 'course-section', new CourseSectionSerializer()); }
}

