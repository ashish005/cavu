import {CoreQueryOptions} from "@app-global";
export class MasterType {
  isLocked: boolean;
  status: string;
  isDeleted: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;

  constructor(model: any = <any>{}){
    this.isLocked = model.isLocked;
    this.status = model.status;
    this.isDeleted = model.isDeleted;
    this.createdBy = model.createdBy;
    this.createdDate = new Date(model.createdDate).toDateString();
    this.modifiedBy = model.modifiedBy;
    this.modifiedDate = model.modifiedDate? new Date(model.modifiedDate).toDateString(): null;
  }
}

export class StudyDegreeTypeQueryOptions extends CoreQueryOptions{}
export class StudyLevelTypeQueryOptions extends CoreQueryOptions{}
export class StudyProgramTypeQueryOptions extends CoreQueryOptions {
  degreeTypeId: string;
  studyLevelId: string;

  constructor(model: any = {}){
    super(model);
    this.studyLevelId = model.studyLevelId || '';
  }

  override toQueryString (){
    const obj = {
      degreeTypeId: this.degreeTypeId,
      studyLevelId: this.studyLevelId
    };
    return super.getParamByObject(obj);
  }
}
export class StudyStreamTypeQueryOptions extends CoreQueryOptions{}

export class StudyDegreeType extends MasterType {
  id: string;
  name: string;

  constructor(model: any = <any>{}){
    super(model);
    this.id = model.id;
    this.name = model.name;
  }
}
export class StudyDegreeTypeSerializer {
  fromJson(json: any): StudyDegreeType {
    return new StudyDegreeType(json);
  }

  toJson(data: StudyDegreeType): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}

export class StudyLevelType extends MasterType {
  id: string;
  name: string;
  parentId: number;
  constructor(model: any = <any>{}){
    super(model);
    this.id = model.id;
    this.name = model.name;
    this.parentId = model.parentId;
  }
}
export class StudyLevelTypeSerializer {
  fromJson(json: any): StudyLevelType {
    return new StudyLevelType(json);
  }

  toJson(data: StudyLevelType): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}

export class StudyProgramType extends MasterType {
  id: string;
  name: string;
  courseCount: number;

  constructor(model: any = <any>{}){
    super(model);
    this.id = model.id;
    this.name = model.name;
    this.courseCount = model.courseCount;
  }
}
export class StudyProgramTypeSerializer {
  fromJson(json: any): StudyProgramType {
    return new StudyProgramType(json);
  }

  toJson(data: StudyProgramType): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}

export class StudyStreamType extends MasterType {
  id: string;
  name: string;

  constructor(model: any = <any>{}){
    super(model);
    this.id = model.id;
    this.name = model.name;
  }
}
export class StudyStreamTypeSerializer {
  fromJson(json: any): StudyStreamType {
    return new StudyStreamType(json);
  }

  toJson(data: StudyStreamType): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}
