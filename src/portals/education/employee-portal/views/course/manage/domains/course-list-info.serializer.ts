import {CoreQueryOptions, CoreResource} from "@app-global";
import {CourseSectionSerializer} from "./course-section.serializer";

export enum COURSE_ENUM {
  MASTER = 'MASTER',
  SLAVE  = 'SLAVE'
};

export class CourseListInfoQueryOptions extends CoreQueryOptions{
  viewType: string | COURSE_ENUM;
  degreeTypeId: number;
  studyLevelId: number;
  studyLevelParentId: number;

  constructor(model: any = {}){
    super(model);
    this.viewType = model.viewType || '';
    this.degreeTypeId = model.degreeTypeId || '';
    this.studyLevelId = model.studyLevelId || '';
    this.studyLevelParentId = model.studyLevelParentId || '';
  }

  override toQueryString (){
    const obj = {
      viewType: this.viewType,
      degreeTypeId: this.degreeTypeId,
      studyLevelId: this.studyLevelId,
      studyLevelParentId: this.studyLevelParentId
    };
    return super.getParamByObject(obj);
  }
}

export class CourseListInfo extends CoreResource {
    name: string;
    abbreviation: string;
    parentId: number;
    sections: Array<any>;
    subjects: Array<any>;
    isMasterCourse: boolean;
    isRunning: boolean;
    totalSection: number;
    totalSubjects: number;

    studyDegree: string;
    studyLevel: string;
    studyProgram: string;
    studyStream: string;

    constructor(model: any = <any>{}){
        super();
        this.id = model.id;
        this.name = model.name;
        this.abbreviation = model.abbreviation;
        this.parentId = model.parentId;
        this.sections = model.sections;
        this.subjects = model.subjects;
        this.isMasterCourse = model.isMasterCourse;
        this.totalSection = model.totalSection;
        this.totalSubjects = model.totalSubjects;

        this.studyDegree = model.studyDegree;
        this.studyLevel = model.studyLevel;
        this.studyProgram = model.studyProgram;
        this.studyStream = model.studyStream;
    }

    search(searchText){
        return this.name.toLowerCase().indexOf(searchText)>=0;
    }
}

export class CourseListInfoSerializer {
  fromJson(json: any): CourseListInfo {
    return new CourseListInfo(json);
  }

  toJson(course: any): any {
    return null;
  }
}
