import {CoreQueryOptions, CoreResource} from "@app-global";
export class OrgTaskQueryOptions extends CoreQueryOptions {
  constructor(model: any = {}){ super(model); }
  override toQueryString (){
    const obj = {};
    return super.getParamByObject(obj);
  }
}

export class OrgTask extends CoreResource {
    name: string;
    remark: string;

    defaultFrequencyTypeId: number;
    //taskTypeId: number;
    taskPriorityId: number;
    orgProcessId: number;
    orgProcessName: string;

    isManual: boolean;
    isPrimary: boolean;

    //masterType: string;
    isVerificationRequired: boolean;
    isStatusOnMailRequired: boolean;
    isStatusOnMailDaily: boolean;
    isStatusOnMailWeekly: boolean;
    isStatusOnMailMonthly: boolean;

    verifiedById: string;
    reportedToId: string;
    assignedToId: string;
    // defaultDay: number;
    // defaultMonth: number;
    isLocked: boolean;
    isActive: boolean;

    verifiedByName: string;
    reportedToName: string;
    assignedToName: string;

    defaultFrequencyTypeName: string;
    //taskTypeName: string;
    taskPriorityName: string;

    isFeeTask:  boolean;
    isPeriodType:  boolean;
  constructor(model: any = <any>{}) {
      super();
      const {
          id, name,
          taskPriorityId,
          isVerificationRequired, isStatusOnMailRequired,
          isStatusOnMailDaily, isStatusOnMailWeekly, isStatusOnMailMonthly,
          verifiedById, reportedToId,
          defaultFrequencyTypeId, orgProcessName,
          //defaultDay, defaultMonth,
          remark,
          isManual, isPrimary, orgProcessId, assignedToId,
          verifiedByName, reportedToName, assignedToName,
          defaultFrequencyTypeName, taskPriorityName,
          isLocked, isActive,
          isFeeTask, isPeriodType
      } = model;

      this.id = id;
      this.name = name;
      this.remark = remark;

      this.taskPriorityId = taskPriorityId;

      this.isVerificationRequired = isVerificationRequired;
      this.isStatusOnMailRequired = isStatusOnMailRequired;
      this.isStatusOnMailDaily = isStatusOnMailDaily;
      this.isStatusOnMailWeekly = isStatusOnMailWeekly;
      this.isStatusOnMailMonthly = isStatusOnMailMonthly;
      this.verifiedById = verifiedById;
      this.reportedToId = reportedToId;
      this.defaultFrequencyTypeId = defaultFrequencyTypeId;
      // this.defaultDay = defaultDay;
      // this.defaultMonth = defaultMonth;

      this.isManual = isManual;
      this.isPrimary = isPrimary;

      this.isLocked = isLocked;
      this.isActive = isActive;

      this.orgProcessId = orgProcessId;
      this.orgProcessName = orgProcessName;
      this.assignedToId = assignedToId;

      this.verifiedByName = verifiedByName;
      this.reportedToName = reportedToName;
      this.assignedToName = assignedToName;

      this.defaultFrequencyTypeName = defaultFrequencyTypeName;
      this.taskPriorityName = taskPriorityName;

      this.isFeeTask = isFeeTask;
      this.isPeriodType = isPeriodType;
  }
}

export class OrgTaskSerializer {
  fromJson(json: any): OrgTask { return new OrgTask(json); }
  toJson(data: any): any { return data; }
}
