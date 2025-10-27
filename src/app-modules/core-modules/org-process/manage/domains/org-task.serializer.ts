import {CoreQueryOptions, CoreResource} from "@app-global";

export class OrgTaskQueryOptions extends CoreQueryOptions {
  constructor(model: any = {}){
    super(model);
  }

  override toQueryString (){
    const obj = {};
    return super.getParamByObject(obj);
  }
}

class OrgProcess {
    id: number;
    name: string;
    description: string;
    processStatus: string;
    processStatusOn: string;
    manualStatus: string;
    manualStatusOn: string;

    constructor(model: any = <any>{}) {
        const { id, name, description, processStatus, processStatusOn, manualStatus, manualStatusOn } = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.processStatus = processStatus;
        this.processStatusOn = processStatusOn;
        this.manualStatus = manualStatus;
        this.manualStatusOn = manualStatusOn;
    }
}
class OrgTaskCommon extends CoreResource {
    name: string;
    remark: string;

    defaultFrequencyTypeId: number;
    //taskTypeId: number;
    taskPriorityId: number;
    orgProcessId: number;

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

    defaultDay: number;
    defaultMonth: number;

    isLocked: boolean;
    status: string;

    verifiedByName: string;
    reportedToName: string;
    assignedToName: string;

    defaultFrequencyTypeName: string;
    //taskTypeName: string;
    taskPriorityName: string;

    isFeeTask:  boolean;
    isPeriodType:  boolean;
    orgProcess: OrgProcess;
    constructor(model: any = {}){
        super();
        const {
            id, name,
            taskPriorityId,
            isVerificationRequired, isStatusOnMailRequired,
            isStatusOnMailDaily, isStatusOnMailWeekly, isStatusOnMailMonthly,
            verifiedById, reportedToId,
            defaultFrequencyTypeId,
            defaultDay, defaultMonth, remark,
            isManual, isPrimary, orgProcessId, assignedToId,
            verifiedByName, reportedToName, assignedToName,
            defaultFrequencyTypeName, taskPriorityName,
            isLocked, status,
            isFeeTask, isPeriodType,
            orgProcess
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
        this.defaultDay = defaultDay;
        this.defaultMonth = defaultMonth;

        this.isManual = isManual;
        this.isPrimary = isPrimary;

        this.isLocked = isLocked;
        this.status = status;

        this.orgProcessId = orgProcessId;
        this.assignedToId = assignedToId;

        this.verifiedByName = verifiedByName;
        this.reportedToName = reportedToName;
        this.assignedToName = assignedToName;

        this.defaultFrequencyTypeName = defaultFrequencyTypeName;
        this.taskPriorityName = taskPriorityName;

        this.isFeeTask = isFeeTask;
        this.isPeriodType = isPeriodType;
        this.orgProcess = new OrgProcess(orgProcess || {});
    }
}
export class OrgTask extends OrgTaskCommon {
  constructor(model: any = <any>{}) {
    super(model);
  }
}

export class OrgTaskSerializer {
  fromJson(json: any): OrgTask { return new OrgTask(json); }

  toJson(data: any): any {
    data.orgProcessId = data.orgProcessId || data.orgParentProcessId;
    // Special handling for orgParentProcessId
    return data;
  }
}
