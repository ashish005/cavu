import {CoreQueryOptions, CoreResource} from "@app-global";

export class CourseSeedQueryOptions extends CoreQueryOptions{}

export class BaseCourseSeed extends CoreResource {
  name: string;
  abbreviation: string;
  duration: string;
  eligibility: string;
  studyDegreeId: number;
  studyLevelId: number;
  parentStudyLevelId: number;
  studyStreamId: number;
  studyProgramId: number;
  division: number;
  durationTerm: number;
  durationYear: number;
  durationType: number;
  countryId: number;
  parentId: number;

  // For test
  studyOther: boolean;

  constructor(model: any = <any>{}){
    super();
    this.id = model.id;
    this.name = model.name;
    this.abbreviation = model.abbreviation;
    this.duration = model.duration;
    this.eligibility = model.eligibility;
    this.division = model.division;
    this.durationTerm = model.durationTerm;
    this.durationYear = model.durationYear;
    this.durationType = model.durationType;
    this.studyDegreeId = model.studyDegreeId;
    this.studyLevelId = model.studyLevelId;
    this.parentStudyLevelId = model.parentStudyLevelId;
    this.studyStreamId = model.studyStreamId;
    this.studyProgramId = model.studyProgramId;
    this.countryId = model.countryId;
    this.parentId = model.parentId;
  }
}

export class CourseToBeUplooad extends BaseCourseSeed{
  links: string;
  constructor(model: any = <any>{}){
    super(model);
    this.links = model.links;
  }
}

/*export class CourseToSeed {
  name: string;
  degree: Array<any>;
  diploma: Array<any>;
  cerificate: Array<any>;
  constructor(model: any = <any>{}){
    this.name = model.name;
    this.degree = (model.degree || []).map(r => new CourseToBeUplooad(r));
    this.diploma = (model.diploma || []).map(r => new CourseToBeUplooad(r));
    this.cerificate = (model.cerificate || []).map(r => new CourseToBeUplooad(r));
  }
}*/

export class CourseBranch {
  name: string;
  link: string;
  degree: number;
  diploma: number;
  certificate: number;

  constructor(model: any = <any>{}){
    this.name = model.name;
    this.link = model.link;
    this.degree = model.degree;
    this.diploma = model.diploma;
    this.certificate = model.certificate;
  }
}

export class CourseSeed extends CoreResource {
  name: string;
  key: string;
  studyStreamId: string;
  courseBranches: Array<CourseBranch>;
  courses: Array<CourseToBeUplooad>;

  isUpdating: boolean = false;
  isLoading: boolean = false;
  message: string;
  degreeCount: number;
  diplomaCount: number;
  certificateCount: number;

  constructor(model: any = <any>{}){
    super();
    this.name = model.name;
    this.key = model.key;
    this.studyStreamId = model.studyStreamId;
    this.courseBranches = (model.courseBranches || []).map(r => new CourseBranch(r));
    this.courses = (model.courses || []).map(r => new CourseToBeUplooad(r));

    this.isUpdating = false;
    this.isLoading = false;
    this.message = null;

    this.degreeCount = null;
    this.diplomaCount = null;
    this.certificateCount = null;
  }
}

export class CourseSeedSerializer {
  fromJson(json: any): CourseSeed {
    return new CourseSeed(json);
  }
  toJson(course: any): any {
    return course;
  }
}
