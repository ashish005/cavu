import {FeeByCommon} from "./fee-by.common";

export class FeeByClassSection extends FeeByCommon {
    //id: string;
    classId: number;
    classSectionId: number;

    className:string;
    classSectionName:string;
    totalStudents: number;

  constructor(model: any = <any>{}){
      super(model);
      const {
          totalStudents, classId, classSectionId,
          className, classSectionName
      } = model;
      this.totalStudents = totalStudents;
      this.classId = classId;
      this.classSectionId = classSectionId;

      this.className = className;
      this.classSectionName = classSectionName;
  }
}

export class FeeByClassSectionSerializer {
  fromJson(json: any): FeeByClassSection { return new FeeByClassSection(json); }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}


