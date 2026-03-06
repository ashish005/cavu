import {CoreQueryOptions, CoreResource} from "@app-global";
import {CourseSection, CourseSectionSerializer} from "./course-section.serializer";

export class CourseQueryOptions extends CoreQueryOptions{}

export class Course extends CoreResource {
  name: string;
  abbreviation: string;
  duration: string;
  eligibility: string;
  created: string;
  sections: Array<any>;
  studyDegreeId: number;
  studyLevelId: number;
  parentStudyLevelId: number;
  studyStreamId: number;
  studyProgramId: number;
  division: number;
  durationTerm: number;
  durationType: number;
  parentId: number;
  studyModes: Array<number>;

  constructor(model: any = <any>{}){
    super();
    this.id = model.id;
    this.name = model.name;
    this.abbreviation = model.abbreviation;
    this.duration = model.duration;
    this.eligibility = model.eligibility;
    this.division = model.division;
    this.durationTerm = model.durationTerm;
    this.durationType = model.durationType;
    this.studyDegreeId = model.studyDegreeId;
    this.studyLevelId = model.studyLevelId;
    this.parentStudyLevelId = model.parentStudyLevelId;
    this.studyStreamId = model.studyStreamId;
    this.studyProgramId = model.studyProgramId;
    this.sections = model.sections.map((r)=> new CourseSection(r));
    this.studyModes = model.studyModes;
    this.parentId = model.parentId;
  }

  get sectionCount(){
    return (this.sections || []).length;
  }
}

export class CourseSerializer {
  fromJson(json: any): Course {
    return new Course(json);
  }
  toJson(course: any): any {
    const sections = (course.sections || []).map((d)=> new CourseSectionSerializer().toJson(d));
    return {
      name: course.name,
      abbreviation: course.abbreviation,
      duration: course.duration,
      eligibility: course.eligibility,
      durationType: course.durationType,
      durationTerm: course.durationTerm,
      sections: sections,
      studyDegreeId: course.studyDegreeId,
      studyLevelId: course.studyLevelId,
      studyStreamId: course.studyStreamId,
      studyProgramId: course.studyProgramId,
      parentId: Number.isNaN(course.parentId)? 0: parseInt( course.parentId),
      studyModes: course.studyModes
    };
  }
}
