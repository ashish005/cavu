import {CoreQueryOptions, CoreResource} from "@app-global";

export class StudyDegreeType {
  id: any;
  name: string;
  masterType: string;
  count: number;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.masterType = (model.masterType || '').toLowerCase();
  }
}

export class StudyLevelType {
  id: string;
  name: string;
  parentId: number;
  parentName: string;
  degreeList: Array<string>;
  streamList: Array<string>;
  durationTerm: Array<string>;
  eligibility: Array<string>;
  programTypes: StudyProgramType[] = null;
  masterCourseCount: number;
  orgCourseCount: number;
  groupBy: Array<any>;

    constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.parentId = model.parentId;
    this.parentName = model.parentName;
    this.degreeList = (model.degreeList || []).map(r => r);
    this.streamList = (model.streamList || []).map(r => r);
    this.durationTerm = (model.durationTerm || []).map(r => r);
    this.eligibility = (model.eligibility || []).map(r => r);
    this.programTypes = (model.programTypes || []).map(r => new StudyProgramType(r));
  }

  get masterChildLevelId(){
      return this.parentId || this.id;
  }

  synchOtherDetails(masterCourseCount, groupBy, orgCourseCount){
      this.groupBy = groupBy;
      this.masterCourseCount = masterCourseCount;
      this.orgCourseCount = orgCourseCount;
  }
}

class StudyModeType {
  id: string;
  name: string;
  isDefault: boolean;
  sortOrder: number;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;

    this.isDefault = model.isDefault;
    this.sortOrder = model.sortOrder;
  }
}

class StudyStreamType {
  id: any;
  name: string;
  masterType: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.masterType = (model.masterType || '').toLowerCase();
  }
}

class StudyProgramType {
  id: any;
  name: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
  }
}

class StaticMasterType {
  id: string;
  duration: Array<any>;
  qualification: Array<any>;
  divisionType: Array<any>;
  durationTerms: Array<any>;

  constructor(model: any = <any>{}){
    this.duration = model.duration;
    this.qualification = model.qualification;
    this.divisionType = model.divisionType;
    this.durationTerms = model.durationTerms;
  }
}

export class CourseLookupQueryOptions extends CoreQueryOptions {
  countryId: string;

  constructor(model: any = {}){
    super(model);
    this.countryId = model.countryId || '';
  }

  override toQueryString (){
    const obj = {
      countryId:this.countryId
    };
    return super.getParamByObject(obj);
  }
}

export class CourseLookup extends CoreResource{
  studyDegree: StudyDegreeType[] = null;
  studyLevel: StudyLevelType[] = null;
  studyStream: StudyStreamType[] = null;
  studyMode: StudyModeType[] = null;
  staticMasterType:  StaticMasterType;

  filteredStudyProgram: StudyProgramType[] = [];
  studyDegreeList: StudyDegreeType[] = [];
  studyStreamList: StudyStreamType[] = [];
  eligibilityList: Array<any> = [];
  durationTermList: Array<any> = [];

  constructor(model: any = <any>{}){
    super();
    this.studyMode = model.studyMode.map(r => new StudyModeType(r));
    this.studyDegree = model.studyDegree.map(r => new StudyDegreeType(r));
    this.studyLevel = model.studyLevel.map(r => new StudyLevelType(r));
    this.studyStream = model.studyStream.map(r => new StudyStreamType(r));;
    this.staticMasterType = <StaticMasterType>model.staticMasterType;
  }

  updateStudyProgramBasedOnStudyLevel(levelId: any){
    const studyLevel = this.studyLevel.find(r => r.id == levelId);
    this.filteredStudyProgram = studyLevel.programTypes || [];
    this.studyDegreeList = this.studyDegree.filter(r => studyLevel.degreeList.includes(r.masterType));
    this.studyStreamList = this.studyStream.filter(r => studyLevel.streamList.includes(r.masterType));
    this.eligibilityList = this.staticMasterType.qualification.filter(r => studyLevel.eligibility.includes(r.masterType));
    this.durationTermList = this.staticMasterType.durationTerms.filter(r => studyLevel.durationTerm.includes(r.name));
  }

  getStudyLevelById(studyLevelId){
    return this.studyLevel.find(r => r.id == studyLevelId);
  }

  getDefaultStudyLevel(){
    return this.studyLevel[0];
  }

  populateStudyDegreeByLevelId(levelId: any){
    const studyLevel = this.studyLevel.find(r => r.id == levelId);
    this.studyDegreeList = this.studyDegree.filter(r => {
      const deg = studyLevel.degreeList.includes(r.masterType);
      if(deg){
          let groupItem = (studyLevel?.groupBy || []).find(k => k.name == r.name);
          r.count = groupItem?.count || 0;
      }
      return deg;
    } );
  }
}

export class CourseLookupSerializer {
  fromJson(json: any): CourseLookup { return new CourseLookup(json); }
  toJson(data: any): any { return {}; }
}
