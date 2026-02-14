import {CoreQueryOptions, CoreResource} from "@app-global";

export class ComplianceDetailQueryOptions extends CoreQueryOptions {
  complianceId: number;
  constructor(model: any = <any>{}){ super(); }

  override toQueryString (){
    const obj = {
      complianceId: this.complianceId
    };
    return super.getParamByObject(obj);
  }
}

export class ComplianceDetail {
  public id: number;
  public complianceId: number;
  public dueDate: string;
  public isActive: boolean;
  public isLocked: boolean;
  constructor(model: any = {}){
    const { id, complianceId, name, dueDate, isActive, isLocked } = model;
    this.id = id;
    this.complianceId = complianceId;
    this.dueDate = dueDate;
    this.isActive = isActive;
    this.isLocked = isLocked;
  }
}

export class ComplianceDetailSerializer {
  fromJson(json: any): ComplianceDetail { return new ComplianceDetail(json); }
  toJson(data: any): any { return data; }
}
