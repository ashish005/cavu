import {CoreQueryOptions} from "@app-global";

export class DutyMasterTypeQueryOptions extends CoreQueryOptions{}

export class DutyConstraintRule {
  id: string;
  constraintTypeId: number;
  employeeGrade: string;
  employeeGradeId: number;
  value: any;
  status: boolean;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.constraintTypeId = model.constraintTypeId || null;
    this.employeeGrade = model.employeeGrade;
    this.employeeGradeId = model.employeeGradeId;
    this.value = model.value;
    this.status = model.status;
  }
}

export class DutyMasterType {
  id: any;
  name: string;
  dutyConstraintRule: Array<DutyConstraintRule>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.dutyConstraintRule = (model.dutyConstraintRule || []).map(r=> new DutyConstraintRule(r));
  }
}

export class DutyConstraintUserType {
  id: number;
  name: string;
  accountGroupId: number;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.accountGroupId = model.accountGroupId;
  }
}

export class DutyConstraintGrade {
  id: number;
  name: string;
  priority?: number;
  status: boolean;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.priority = model.priority;
    this.status = model.status;
  }
}

export class DutyConstraintTypeWrapper {
  id: string;
  data: any;
  entities: Array<DutyMasterType>;
  count: number;
  hasNext: boolean;
  hasPrevious: boolean;

  constructor(model: any = <any>{}){
    this.data = {
      //userTypes: (model.data.userTypes || []).map(r => new DutyConstraintUserType(r)),
      grades: (model.data.grades || []).map(r => new DutyConstraintGrade(r)),
    };
    this.entities = model.entities.map(r => new DutyMasterType(r));
    this.count = model.count;
    this.hasNext = model.hasNext;
    this.hasPrevious = model.hasPrevious;
  }
}

export class DutyConstraintTypeWrapperSerializer {
  fromJson(json: any): DutyConstraintTypeWrapper {
    return new DutyConstraintTypeWrapper(json);
  }

  toJson(data: any): any {
    return {};
  }
}

export class DutyMasterTypeSerializer {
  fromJson(json: any): DutyMasterType {
    return new DutyMasterType(json);
  }

  toJson(info: any): any {
    const data = {
      name: info.name,
      dutyConstraintRule: (info.dutyConstraintRule || []).map(r => {
        const item: any = {
          value: r.value,
          employeeGradeId: r.employeeGradeId || null,
          status: r.status || false,
        };

        if(r.id){
          item.id = r.id
        }

        if(r.constraintTypeId){
          item.constraintTypeId = r.constraintTypeId;
        }
        return item;
      })
    };
    return data;
  }
}
