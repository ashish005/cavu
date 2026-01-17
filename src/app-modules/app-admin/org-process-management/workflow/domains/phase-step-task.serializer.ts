import {CoreQueryOptions, CoreResource} from "@app-global";

export class PhaseStepTaskQueryOptions extends CoreQueryOptions {
  workflowId: number;
  phaseStepId?: number;
  constructor(model: any = {}){
      super(model);
      this.workflowId = model.workflowId;
      this.phaseStepId = model.phaseStepId;
  }
  override toQueryString (){
    const obj: any = {
        workflowId: this.workflowId
    };
    if (this.phaseStepId) {
        obj.phaseStepId = this.phaseStepId;
    }
    return super.getParamByObject(obj);
  }
}

export class PhaseStepTask extends CoreResource
{
    phaseStepId: number;
    taskPriorityId: number;
    phaseStepName: string;
    taskPriorityName: string;
    name?: string;
    remark?: string;

    isManual: boolean;
    isSystemTask: boolean;
    isPrimary: boolean;
    isVerificationRequired: boolean;
    isStatusOnMailRequired: boolean;
    isActive: boolean;

    yearMode: string;
    fyStartDay: number;
    fyStartMonth: number;
    timeZone: string;

    frequencyTypeId: number;
    frequencyTypeName: string;
    dueDate: string;
    dueMonth: string;

    constructor(model: any = {}) {
        super();
        const {
            id, name, remark, phaseStepId, taskPriorityId, taskPriorityName,
            isManual, isSystemTask, isPrimary, isVerificationRequired, isStatusOnMailRequired, isActive,
            yearMode, fyStartDay, fyStartMonth, timeZone,
            frequencyTypeId, frequencyTypeName, phaseStepName, dueDate, dueMonth
        } = model;

        this.id = id;
        this.name = name;
        this.remark = remark;
        this.phaseStepId = phaseStepId;
        this.taskPriorityId = taskPriorityId;
        this.phaseStepName = phaseStepName;
        this.taskPriorityName = taskPriorityName;
        this.isManual = isManual;
        this.isSystemTask = isSystemTask;
        this.isPrimary = isPrimary;
        this.isVerificationRequired = isVerificationRequired;
        this.isStatusOnMailRequired = isStatusOnMailRequired;
        this.isActive = isActive;
        this.yearMode = yearMode;
        this.fyStartDay = fyStartDay;
        this.fyStartMonth = fyStartMonth;
        this.timeZone = timeZone;
        this.frequencyTypeId = frequencyTypeId;
        this.frequencyTypeName = frequencyTypeName;
        this.dueDate = dueDate;
        this.dueMonth = dueMonth;
    }
}

export class PhaseStepTaskSerializer {
  fromJson(json: any): PhaseStepTask { return new PhaseStepTask(json); }
  toJson(data: any): any { return data; }
}
