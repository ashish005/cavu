import {CoreQueryOptions, CoreResource} from "@app-global";

export class CourseSubjectQueryOptions extends CoreQueryOptions{}

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
