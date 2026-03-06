import {CoreQueryOptions} from "@app-global";

export class StudyBoardTypeQueryOptions extends CoreQueryOptions{}

export class StudyBoardType {
  id: string;
  name: string;
  isLocked: boolean;
  status: boolean;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.isLocked = model.isLocked;
    this.status = model.status;
  }
}

export class StudyBoardTypeSerializer {
  fromJson(json: any): StudyBoardType {
    return new StudyBoardType(json);
  }

  toJson(data: StudyBoardType): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}

export class StudyModeTypeQueryOptions extends CoreQueryOptions{}

export class StudyModeType {
  id: string;
  name: string;
  isDefault: boolean;
  sortOrder: number;
  isLocked: boolean;
  status: boolean;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.isDefault = model.isDefault;
    this.sortOrder = model.sortOrder;
    this.isLocked = model.isLocked;
    this.status = model.status;
  }
}

export class StudyModeTypeSerializer {
  fromJson(json: any): StudyModeType {
    return new StudyModeType(json);
  }

  toJson(data: StudyModeType): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}
