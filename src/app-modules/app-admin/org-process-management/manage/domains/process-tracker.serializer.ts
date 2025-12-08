import {CoreQueryOptions} from "@app-global";

export class ProcessTrackerQueryOptions extends CoreQueryOptions {
  statusId: any;
  constructor(model: any = {}){ super(model); }
  override toQueryString (){
    const obj = {
      statusId: this.statusId
    };
    return super.getParamByObject(obj);
  }
}

export class ProcessTracker {
  public id: number;
  public name: string;
  public processStatus: string;
  public dueDate: string;
  public isActive: boolean;
  public isLocked: boolean;
  constructor(model: any = {}){
    const { id, name, processStatus, dueDate, isActive, isLocked } = model;
    this.id = id;
    this.name = name;
    this.processStatus = processStatus;
    this.dueDate = dueDate;
    this.isActive = isActive;
    this.isLocked = isLocked;
  }
}

export class ProcessTrackerSerializer {
  fromJson(json: any): ProcessTracker { return new ProcessTracker(json); }
  toJson(data: any): any { return data; }
}
