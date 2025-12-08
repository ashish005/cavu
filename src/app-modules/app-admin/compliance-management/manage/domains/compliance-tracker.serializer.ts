import {CoreQueryOptions} from "@app-global";

export class BoardTrackerTaskQueryOptions extends CoreQueryOptions {
  statusId: any;
  constructor(model: any = {}){ super(model); }
  override toQueryString (){
    const obj = {
      statusId: this.statusId
    };
    return super.getParamByObject(obj);
  }
}

export class ComplianceTracker {
  public id: number;
  public name: string;
  public complianceStatus: string;
  public complianceId: number;
  public dueDate: string;
  public isActive: boolean;
  public isLocked: boolean;
  constructor(model: any = {}){
    const { id, complianceId, name, complianceStatus, dueDate, isActive, isLocked } = model;
    this.id = id;
    this.name = name;
    this.complianceId = complianceId;
    this.complianceStatus = complianceStatus;
    this.dueDate = dueDate;
    this.isActive = isActive;
    this.isLocked = isLocked;
  }
}

export class ComplianceTrackerSerializer {
  fromJson(json: any): ComplianceTracker { return new ComplianceTracker(json); }
  toJson(data: any): any { return data; }
}
