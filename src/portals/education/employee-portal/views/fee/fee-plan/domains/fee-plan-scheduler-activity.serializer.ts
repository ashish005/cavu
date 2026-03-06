import {CoreQueryOptions} from "@app-global";

export class FeePlanSchedulerActivityQueryOptions extends CoreQueryOptions {
  feePlanId: any;
  scheduleId: any;
  constructor(model: any = {}){
    super(model);
  }

  override toQueryString (){
    const obj = {
      feePlanId: this.feePlanId,
      scheduleId: this.scheduleId
    };
    return super.getParamByObject(obj);
  }
}

export class FeePlanSchedulerActivity {
  id: number;
  orgTaskScheduleId: number;
  taskStatusTypeId: number;
  verifiedByEmployeeId: string;

  startDate: string;
  endDate: string;
  dueDate: string;
  isAutoRun: boolean;
  isSuccess: boolean;
  remark: string;
  verificationRemark: string;

  updatedDate: string;

  name: string;
  verifiedByEmployeeName: string;
  taskStatusTypeName: string;
  frequencyTypeName: string;

  date: string;
  constructor(model: any = <any>{}) {
    const {
      id, orgTaskScheduleId, taskStatusTypeId, verifiedByEmployeeId,
        startDate, endDate, dueDate, isAutoRun, isSuccess, remark, verificationRemark,
        updatedDate,
        name, taskStatusTypeName, frequencyTypeName, verifiedByEmployeeName
    } = model;
    this.id = id;
    this.name = name;
    this.orgTaskScheduleId = orgTaskScheduleId;
    this.taskStatusTypeId = taskStatusTypeId;
    this.verifiedByEmployeeId = verifiedByEmployeeId;

    this.startDate = startDate;
    this.endDate = endDate;
    this.dueDate = dueDate;
    this.isAutoRun = isAutoRun;
    this.isSuccess = isSuccess;
    this.remark = remark;
    this.verificationRemark = verificationRemark;

    this.updatedDate = updatedDate;

    this.taskStatusTypeName = taskStatusTypeName;
    this.frequencyTypeName = frequencyTypeName;
    this.verifiedByEmployeeName = verifiedByEmployeeName;

    this.date = dueDate;
  }
}

export class FeePlanSchedulerActivitySerializer {
  fromJson(json: any): FeePlanSchedulerActivity { return new FeePlanSchedulerActivity(json); }
  toJson(data: any): any { return data; }
}
