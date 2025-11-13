import {CoreQueryOptions} from "../../../../services/models";

export class ProcessWorkflowQueryOptions extends CoreQueryOptions{
    parentId: number;
    processMasterType: string;
    override toQueryString (){
        const obj = {
            parentId: this.parentId,
            processMasterType: this.processMasterType
        };
        return super.getParamByObject(obj);
    }
}

export class WorkflowOrgTask {
    id: any;
    name: string;
    remark: string;

    defaultFrequencyTypeId: number;
    //taskTypeId: number;
    taskPriorityId: number;
    orgProcessId: number;

    isManual: boolean;
    isPrimary: boolean;

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

    frequencyTypeName: string;
    //taskTypeName: string;
    taskPriorityName: string;

    isFeeTask:  boolean;
    isPeriodType:  boolean;

    orgTaskSchedule: Array<any>;
    orgReminders: Array<any>;
    nextRunTime: string;
    lastRunTime: string;
    lastRunResult: string;
    constructor(model: any = {}){
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
            frequencyTypeName, taskPriorityName,
            isLocked, status,
            isFeeTask, isPeriodType,
            orgProcess,
            orgTaskSchedule, orgReminders,
            nextRunTime, lastRunTime, lastRunResult
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

        this.frequencyTypeName = frequencyTypeName;
        this.taskPriorityName = taskPriorityName;

        this.isFeeTask = isFeeTask;
        this.isPeriodType = isPeriodType;
        this.orgTaskSchedule = (orgTaskSchedule || []).map(r => r);
        this.orgReminders = (orgReminders || []).map(r => r);

        this.nextRunTime = nextRunTime;
        this.lastRunTime = lastRunTime;
        this.lastRunResult = lastRunResult;
    }
}

export class WorkflowOrgProcess {
    id: any;
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

    childItems: Array<WorkflowOrgProcess>;
    tasks: Array<WorkflowOrgTask>;
    constructor(model: any = <any>{}){
        const {
            id, name, description, parentId, sortOrder, masterType,
            processPhase, processPhaseOn, manualStatus, manualStatusOn,
            inchargeId, inchargeName,
            isLocked, status,
            childItems, tasks
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

        this.childItems = (childItems || []).map(r => new WorkflowOrgProcess(r));
        this.tasks = (tasks || []).map(r => new WorkflowOrgTask(r));
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

export class WorkflowOrgProcessSerializer {
    fromJson(json: any): WorkflowOrgProcess { return new WorkflowOrgProcess(json); }
    toJson(data: any): any { return data; }
}