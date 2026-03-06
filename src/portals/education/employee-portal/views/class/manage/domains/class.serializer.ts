import {CoreQueryOptions} from "@app-global";

export class OrgClassQueryOptions extends CoreQueryOptions{
    studyModeTypeId: string;

  override toQueryString(){
    const obj = {
        studyModeTypeId: this.studyModeTypeId
    };
    return super.getParamByObject(obj);
  }
}

export class OrgClassSection {
  id: string;
  name: string;
  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
  }
}

export class OrgClass {
  id: string;
  name: string;
  courseId: number;
  courseSectionId: number;
  studyModeTypeId: number;
  classTeacherId: string;

  studyModeTypeName: string;
  course: string;
  courseSection: string;
  classTeacherName: string;
  isDemo: boolean;
  classSections: Array<OrgClassSection>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.courseId = model.courseId;
    this.courseSectionId = model.courseSectionId;
    this.studyModeTypeId = model.studyModeTypeId;

    this.classTeacherId = model.classTeacherId;
    this.classTeacherName = model.classTeacherName;

    this.studyModeTypeName = model.studyModeTypeName;
    this.course = model.course;
    this.courseSection = model.courseSection;
    this.isDemo = model.isDemo;

    this.classSections = (model.classSections || []).map((r)=> new OrgClassSection(r));
  }

  get totalSection(){
    return (this.classSections || []).length;
  }
}

export class OrgClassSerializer {
  fromJson(json: any): OrgClass {
    return new OrgClass(json);
  }

  toJson(data: any): any {
    let info = {
      id: data.id,
      name: data.name,
      courseId: data.courseId,
      courseSectionId: data.courseSectionId,
      studyModeTypeId: data.studyModeTypeId,
      classTeacherId: data.classTeacherId,
      classSections: (data.classSections || []).map((r)=> new OrgClassSection(r))
    };

    if(!info.id){
      delete info.id;
    }

    return info;
  }
}
