import {CoreQueryOptions, CoreResource} from "@app-global";
import {HttpParams} from "@angular/common/http";

export class GlobalSearchQueryOptions extends CoreQueryOptions{
  sessionId: number;
  classId: number;
  classSectionId: number;
  courseId: number;
  courseSectionId: number;
  sortBy: string;
  sortDirection: string;

  constructor(model: any = {}){
    super(model);
    this.sessionId = model.sessionId || '';

    this.classId = model.classId || '';
    this.classSectionId = model.classSectionId || '';
    this.courseId = model.courseId || '';
    this.courseSectionId = model.courseSectionId || '';

    this.sortBy = model.sortBy || '';
    this.sortDirection = model.sortDirection || '';
  }

  override toQueryString (){
    const obj = {
      sortBy:this.sortBy,
      sortDirection:this.sortDirection
    };
    const params = Object.keys(obj).filter(r=> obj[r]).reduce((p, key) => p.set(key, obj[key]), new HttpParams());
    return params;
  }
}

export class SearchChildSection {
  id: number;
  name: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
  }
}

export class SearchClass {
  id: number;
  name: string;
  children: Array<SearchChildSection> = [];

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.children = (model.classSection).map(r => new SearchChildSection(r));
  }
}

export class SearchCourse {
  id: number;
  name: string;
  children: Array<SearchChildSection> = [];

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.children = (model.sections).map(r => new SearchChildSection(r));
  }
}

export class GlobalSearchLookup extends CoreResource{
  course: Array<SearchCourse> = [];
  classes: Array<SearchClass> = [];
  constructor(model: any = <any>{}){
    super();
    this.course = (model.course || []).map(r => new SearchCourse(r));
    this.classes = (model.classes || []).map(r => new SearchClass(r));
  }
}

export class GlobalSearchLookupSerializer {
  fromJson(json: any): GlobalSearchLookup {
    return new GlobalSearchLookup(json);
  }

  toJson(data: any): any {
    return {};
  }
}
