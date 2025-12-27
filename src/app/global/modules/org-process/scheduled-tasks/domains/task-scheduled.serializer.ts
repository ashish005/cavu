import {CoreQueryOptions} from "../../../../services/models";

export class TaskScheduledQueryOptions extends CoreQueryOptions {
  nextDays: string;
  constructor(data: any = {}){
    super(data);
    this.nextDays = data.nextDays;
  }

  override toQueryString (){
    const obj = {
      nextDays: this.nextDays || '7'
    };
    return super.getParamByObject(obj);
  }
}

export class TaskScheduled {
  id: string;
  orgTaskName: string;
  scheduleDate: string;
  taskId: number;
  modifiedDate: string;

  constructor(model: any = <any>{}) {
    this.id = model.id;
    this.orgTaskName = model.orgTaskName;
    this.scheduleDate = model.scheduleDate;
    this.taskId = model.taskId;
    this.modifiedDate = model.modifiedDate;
  }
}

export class TaskScheduledSerializer {
  fromJson(json: any): TaskScheduled {
    return new TaskScheduled(json);
  }

  toJson(data: any): any {
    const {
      name
    } = data;
    return {
      name: name
    };
  }
}
