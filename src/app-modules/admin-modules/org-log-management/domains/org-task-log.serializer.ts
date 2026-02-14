import {CoreQueryOptions} from "@app-global";

export class OrgTaskLogQueryOptions extends CoreQueryOptions{
  constructor(model: any = {}){
    super(model);
  }
  override toQueryString (){
    const obj = {};
    return super.getParamByObject(obj);
  }
}

export class CommunicationTemplate {
  isTaskReminder: boolean;
  mediaType: string;
  notification: string;
  constructor(model: any = <any>{}) {
    const { isTaskReminder, mediaType, notification } = model;
    this.isTaskReminder = isTaskReminder;
    this.mediaType = mediaType;
    this.notification = notification;
  }
}

export class OrgTaskLog {
  id: string;
  startDate: string;
  endDate: string;
  dueDate: string;

  isAutoRun: boolean;
  isSuccess: boolean;
  remark: string;

  orgTaskId: number;
  orgTaskScheduleId: number;
  taskStatusTypeId: number;

  updatedDate: string;

  verifiedByEmployeeId: string;
  verificationRemark: string;

  verifiedByEmployeeName: string;
  taskStatusTypeName: string;

  name: string;
  orgTaskTypeName: string;
  frequencyTypeName: string;

  constructor(model: any = <any>{}){
    const {
      id,
      startDate, endDate, dueDate,
      isAutoRun, isSuccess, remark,
      orgTaskId, orgTaskScheduleId, taskStatusTypeId,
      updatedDate,
      verifiedByEmployeeId, verificationRemark,
      verifiedByEmployeeName, taskStatusTypeName, name, orgTaskTypeName, frequencyTypeName
    } = model;

    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.dueDate = dueDate;

    this.isAutoRun = isAutoRun;
    this.isSuccess = isSuccess;
    this.remark = remark;

    this.orgTaskId = orgTaskId;
    this.orgTaskScheduleId = orgTaskScheduleId;
    this.taskStatusTypeId = taskStatusTypeId;

    this.updatedDate = updatedDate;

    this.verifiedByEmployeeId = verifiedByEmployeeId;
    this.verificationRemark = verificationRemark;

    this.verifiedByEmployeeName = verifiedByEmployeeName;
    this.taskStatusTypeName = taskStatusTypeName;
    this.name = name;
    this.orgTaskTypeName = orgTaskTypeName;
    this.frequencyTypeName = frequencyTypeName;
  }
}

export class OrgTaskLogSerializer {
  fromJson(json: any): OrgTaskLog {
    return new OrgTaskLog(json);
  }

  toJson(data: any): any {
    return {};
  }
}
