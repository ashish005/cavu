import {CoreQueryOptions, CoreResource} from "@app-global";

export class OrgWorkflowPhaseStepTaskQueryOptions extends CoreQueryOptions {
  workflowId?: number;
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

export class OrgWorkflowPhaseStepTask extends CoreResource
{
    override id: number;
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

    notification?: {
        notifyOnEnter: boolean;
        notifyOnExit: boolean;
        channels: string[];
        message: string;
    };
    notificationTemplates?: any[];
    notifications?: any[];

    constructor(model: any = {}) {
        super();
        const {
            id, name, remark, phaseStepId, taskPriorityId, taskPriorityName,
            isManual, isSystemTask, isPrimary, isVerificationRequired, isStatusOnMailRequired, isActive,
            yearMode, fyStartDay, fyStartMonth, timeZone,
            frequencyTypeId, frequencyTypeName, phaseStepName, dueDate, dueMonth,
            notification, notificationTemplates, notifications
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
        this.notification = notification;
        this.notificationTemplates = notificationTemplates;
        this.notifications = notifications;
    }
}

export class OrgWorkflowPhaseStepTaskSerializer {
  fromJson(json: any): OrgWorkflowPhaseStepTask { return new OrgWorkflowPhaseStepTask(json); }
  toJson(data: any): any { return data; }
}
