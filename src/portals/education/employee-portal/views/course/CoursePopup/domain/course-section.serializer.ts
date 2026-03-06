import {CoreQueryOptions, CoreResource} from "@app-global";

export class CourseSubject extends CoreResource {
    name: string;
    code: string;
    constructor(model: any = <any>{}){
        super();
        this.id = model.id;
        this.name = model.name;
        this.code = model.code;
    }
}

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
  fromJson(json: any): CourseSection { return new CourseSection(json); }
  toJson(data: any): any { return data; }
}
