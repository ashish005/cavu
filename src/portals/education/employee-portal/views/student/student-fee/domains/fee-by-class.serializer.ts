
import {HttpParams} from "@angular/common/http";
import {FeeByCommon} from "./fee-by.common";
import {CoreQueryOptions} from "@app-global";

export class StudentFeeQueryOptions extends CoreQueryOptions{
  studentId:string;
  parentId: number;
  employeeId:string;
  fromDate: Date;
  toDate: Date;
  classId: number;
  classSectionId: number;
  courseId: number;
  courseSectionId: number;
  studyModeId: number;
  feeTypeId: number;
  sessionId: number;
  batchId: number;
  viewType: string;
  searchAction: string;
  sortBy: string;
  sortDirection: string;

  constructor(model: any = {}){
    super(model);
    // this.studentId = model.studentId || '';
    // this.parentId = model.parentId || '';
    // this.employeeId = model.employeeId || '';
    // this.fromDate = model.fromDate || '';
    // this.toDate = model.toDate || '';
    // this.classSectionId = model.classSectionId || '';
    // this.courseId = model.courseId || '';
    // this.courseSectionId = model.courseSectionId || '';
    // this.studyModeId = model.studyModeId || '';
    // this.feeTypeId = model.feeTypeId || '';
    // this.sessionId = model.sessionId || '';
    // this.batchId = model.batchId || '';
    // this.viewType = model.viewType || '';
    // this.searchAction = model.searchAction || '';
    // this.sortBy = model.sortBy || '';
    // this.sortDirection = model.sortDirection || '';
    // this.classId = model.classId || '';
  }

  override toQueryString (){
    const obj = {
      skip: this.skip,
      take:this.take,
      studentId:this.studentId,
      parentId:this.parentId,
      employeeId:this.employeeId,
      fromDate:this.fromDate,
      toDate:this.toDate,
      classId:this.classId,
      classSectionId:this.classSectionId,
      courseId:this.courseId,
      courseSectionId:this.courseSectionId,
      studyModeId:this.studyModeId,
      feeTypeId:this.feeTypeId,
      sessionId:this.sessionId,
      batchId:this.batchId,
      viewType:this.viewType,
      searchAction:this.searchAction,
      sortBy:this.sortBy,
      sortDirection:this.sortDirection
    };
   /* let params = new HttpParams()
      .set('skip', this.skip.toString())
      .set('take', this.take.toString())
      .set('studentId', (this.studentId)?this.studentId.toString():'')
      .set('parentId', (this.parentId)?this.parentId.toString():'')
      .set('employeeId', (this.employeeId)?this.employeeId.toString():'')
      .set('fromDate', (this.fromDate)?this.fromDate.toString():'')
      .set('toDate', (this.toDate)?this.toDate.toString():'')
      .set('classId', (this.classId)?this.classId.toString(): '')
      .set('classSectionId', (this.classSectionId)?this.classSectionId.toString():'')
      .set('courseId', (this.courseId)?this.courseId.toString(): '')
      .set('courseSectionId', (this.courseSectionId)?this.courseSectionId.toString():'')
      .set('studyModeId', (this.studyModeId)?this.studyModeId.toString():'')
      .set('feeTypeId', (this.feeTypeId)?this.feeTypeId.toString():'')
      .set('sessionId', (this.sessionId)?this.sessionId.toString():'')
      .set('batchId', (this.batchId)?this.batchId.toString():'')
      .set('viewType', (this.viewType)?this.viewType.toString():'')
      .set('searchAction', (this.searchAction)?this.searchAction.toString():'')
      .set('sortBy', (this.sortBy)?this.sortBy.toString():'')
      .set('sortDirection', (this.sortDirection)?this.sortDirection.toString():'');*/
    //.set('includeProperties',  "id, name");
    // .set('filters', this.filters.toString())
    // .set('sortCriteria', this.sortCriteria.toString());

    const params = Object.keys(obj).filter(r=> obj[r]).reduce((p, key) => p.set(key, obj[key]), new HttpParams());
    return params;
  }
}

export class FeeByClass extends FeeByCommon {
  //id: string;
  classId: number;
  studyModeTypeId: number;
  classTeacherId: string;

  name:string;
  studyModeTypeName:string;
  classTeacherName:string;
  totalStudents: number;

  constructor(model: any = <any>{}){
    super(model);
    const {
      totalStudents, classId, studyModeTypeId, classTeacherId,
        name, studyModeTypeName, classTeacherName
    } = model;
    this.totalStudents = totalStudents;
    this.classId = classId;
    this.studyModeTypeId = studyModeTypeId;
    this.classTeacherId = classTeacherId;

    this.name = name;
    this.studyModeTypeName = studyModeTypeName;
    this.classTeacherName = classTeacherName;
  }
}

export class FeeByClassSerializer {
  fromJson(json: any): FeeByClass { return new FeeByClass(json); }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}


