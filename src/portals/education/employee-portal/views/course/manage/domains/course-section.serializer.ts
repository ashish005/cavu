import {CoreResource} from "@app-global";
import {CourseSubject} from "./course-subject.serializer";


export class CourseSection extends CoreResource{
  name: string;
  code: string;
  courseId: string;
  courseSectionId: string;
  subjects: Array<CourseSubject>;

  constructor(model: any = <any>{}){
    super();
    this.id = model.id;
    this.name = model.name;
    this.code = model.code;
    this.courseId = this.courseId;
    this.courseSectionId = this.courseSectionId;
    this.subjects = (model.subjects || []).map((r)=> new CourseSubject(r));
  }
}

export class CourseSectionSerializer {
  fromJson(json: any): CourseSection {
    return new CourseSection(json);
  }
  toJson(data: CourseSection): any {
    let _data = {
      id: data.id,
      name: data.name,
      code: data.code,
      courseId: data.courseId,
      courseSectionId: data.courseSectionId,
      subjects: data.subjects
    };
    return _data;
  }
}
