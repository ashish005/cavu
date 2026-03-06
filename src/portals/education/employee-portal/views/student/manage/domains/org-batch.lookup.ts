

class CourseSectionLookup {
    id: string;
    name: string;
    code: string;
    courseId: string;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.name = model.name;
        this.code = model.code;
        this.courseId = model.courseId;
    }
}
export class CourseLookup {
  id: string;
  name: string;
  abbreviation: string;
  duration: string;
  eligibility: string;
  created: string;
  sections: Array<CourseSectionLookup>;
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
  studyLevelName: string;
  studyModes: Array<number>;

  constructor(model: any = <any>{}) {
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
    this.sections = model.sections.map((r) => new CourseSectionLookup(r));
    this.countryId = model.countryId;
    this.studyModes = model.studyModes;
    this.parentId = model.parentId;
    this.orgUnitId = model.orgUnitId;
    this.studyLevelName = model.studyLevelName;
  }

  get sectionCount() {
    return (this.sections || []).length;
  }
}

class ClassSectionLookup{
    id: string;
    name: string;

    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

class ClassLookup{
    id: number;
    name: string;
    studyModeTypeId: number;
    classSections: Array<ClassSectionLookup>;

    constructor(model: any = <any>{}){
        const { id, name, studyModeTypeId, classSections } = model;
        this.id = id;
        this.name = name;
        this.studyModeTypeId = studyModeTypeId;
        this.classSections = (classSections || []).map((r)=> new ClassSectionLookup(r));
    }
}

export class ByOrgBatchLookup {
    id: string;
    courses: Array<CourseLookup> = [];
    classes: Array<ClassLookup>;
    //feePlans: Array<FeePlanLookup>;

    constructor(model: any = <any>{}) {
        const { courses, classes, feePlans } = model;
        this.courses = (courses || []).map(r => new CourseLookup(r));
        this.classes = (classes || []).map(r => new ClassLookup(r));
        //this.feePlans = (feePlans || []).map(r => new FeePlanLookup(r));
    }
}
export class ByOrgBatchLookupSerializer {
  fromJson(json: any):  ByOrgBatchLookup { return new ByOrgBatchLookup(json); }
  toJson(data: any): any { return {}; }
}
