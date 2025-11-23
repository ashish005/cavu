import {CoreQueryOptions, CoreResource} from "@app-global";

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

class OrgProcessCommon extends CoreResource {
    name: string;
    description: string;
    parentId: number;
    sortOrder: string;
    masterType: string;

    processPhase: string;
    processPhaseOn: string;
    manualStatus: string;
    manualStatusOn: string;
    inchargeId: number;
    inchargeName: string;
    isLocked: boolean;
    status: string;
    constructor(model: any = <any>{}){
        super();
        const {id, name, description, parentId, sortOrder, masterType,
            processPhase, processPhaseOn, manualStatus, manualStatusOn,
            inchargeId, inchargeName,
            isLocked, status
        } = model;
        this.id = id;
        this.name = name;
        this.description = description;

        this.masterType = masterType;
        this.parentId = parentId;
        this.sortOrder = sortOrder;

        this.processPhase = processPhase;
        this.processPhaseOn = processPhaseOn;
        this.manualStatus = manualStatus;
        this.manualStatusOn = manualStatusOn;
        this.inchargeId = inchargeId;
        this.inchargeName = inchargeName;
        this.isLocked = isLocked;
        this.status = status;
    }
}

export class OrgProcessWorkflowQueryOptions extends CoreQueryOptions{
    parentId: number | string;

    constructor(model: any = {}){
        super(model);
    }

    override toQueryString (){
        const obj = {
            parentId:this.parentId
        };
        return super.getParamByObject(obj);
    }
}

export class OrgProcessTask extends OrgTaskCommon {
  lastRun: Date;
  nextDueDate: Date;
  constructor(model: any = <any>{}){
    super(model);
    this.lastRun =  model.lastRun;
    this.nextDueDate =  model.nextDueDate;
  }
}

export class OrgProcessWorkflow extends OrgProcessCommon {
  tasks: Array<OrgProcessTask>;
  childItems: Array<OrgProcessWorkflow>;
  constructor(model: any = <any>{}){
    super(model);
    this.childItems = (model.childItems || []).map(r => new OrgProcessWorkflow(r));
    this.tasks = (model.tasks || []).map(r => new OrgProcessTask(r));
  }

  getAllTasks(){
    let tasks = [];
    tasks = this.childItems.reduce((result, current) => {
      const _tasks = current.tasks || [];
      if(_tasks.length>0){
        result = result.concat(_tasks);
      }
      return result;
    }, this.tasks || []);
    return tasks;
  }
}

export class OrgProcessWorkflowSerializer {
  fromJson(json: any): OrgProcessWorkflow {
    return new OrgProcessWorkflow(json);
  }

  toJson(data: any): any {
    return data;
  }
}
