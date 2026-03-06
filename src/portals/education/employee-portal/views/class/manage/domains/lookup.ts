import {CoreResource} from "@app-global";

export class CourseLookup extends CoreResource {
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
  countryId: number;
  parentId: number;
  orgUnitId: string;
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
    this.sections = model.sections.map((r)=> new CourseSectionLookup(r));
    this.countryId = model.countryId;
    this.studyModes = model.studyModes;
    this.parentId = model.parentId;
    this.orgUnitId = model.orgUnitId;
  }

  get sectionCount(){
    return (this.sections || []).length;
  }
}

export class StudyModeTypeLookup {
  id: string;
  name: string;
  parentId: number;
  isDefault: boolean;
  sortOrder: number;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.parentId = model.parentId;
    this.isDefault = model.isDefault;
    this.sortOrder = model.sortOrder;
  }
}

class CourseSubject extends CoreResource {
  name: string;
  code: string;
  constructor(model: any = <any>{}){
    super();
    this.id = model.id;
    this.name = model.name;
    this.code = model.code;
  }
}

export class CourseSectionLookup extends CoreResource{
  name: string;
  code: string;
  courseId: string;
  subjects: Array<CourseSubject>;

  constructor(model: any = <any>{}){
    super();
    this.id = model.id;
    this.name = model.name;
    this.code = model.code;
    this.courseId = this.courseId;
    this.subjects = (model.subjects || []).map((r)=> new CourseSubject(r));
  }
}

export class LookupClassMasterType extends CoreResource{
  studyMode: Array<StudyModeTypeLookup> = [];
  course: Array<CourseLookup> = [];

  constructor(model: any = <any>{}){
    super();
    this.studyMode = (model.studyMode || []).map(r => new StudyModeTypeLookup(r));
    this.course = (model.course || []).map(r => new CourseLookup(r));
  }

  public getCourseByStudyMode(studyModeId: any){
    return this.course.filter((item, index: number, arr: Array<any>)=> {
      return item.studyModes.some((r)=> r == studyModeId);
    });
  }
}

export class LookupClassMasterTypeSerializer {
  fromJson(json: any): LookupClassMasterType {
    return new LookupClassMasterType(json);
  }

  toJson(data: any): any {
    return {};
  }
}
