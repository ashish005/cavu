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

export class ProjectProcessQueryOptions extends CoreQueryOptions{
    accountId: string;
    projectId: string;
    moduleId: string;
    constructor(model: any = {}){ super(model); }

    toQueryString (){
        const obj = {
            accountId: this.accountId,
            projectId: this.projectId,
            moduleId: this.moduleId,
            masterType: 'PROJECT_MANAGEMENT'
        };
        return super.getParamByObject(obj);
    }
}

export class ProjectTask extends OrgTaskCommon {
    processId: string;
    taskId: number;
    constructor(model: any = {}){
        super(model);
        const { id, processId, taskId, name } = model;

        this.id = id;
        this.processId = processId;
        this.taskId = taskId;
    }
}

export class ProjectProcess extends CoreResource
{
    name: string;
    moduleId: string;

    processStartDate: string;
    processEndDate: string;

    startPhaseId: number;
    endPhaseId: number;

    startPhaseName: string;
    endPhaseName: string;

    sortOrder: number;
    isCompleted: boolean;
    isStarted: boolean;
    children: Array<ProjectProcess>;
    tasks: Array<ProjectTask>;
    //userAudit: UserAuditInfo;
    constructor(model: any = <any>{}){
        super();
        const {id,
            name, moduleId,
            processStartDate, processEndDate,
            startPhaseId, endPhaseId, startPhaseName, endPhaseName,
            sortOrder, isCompleted, isStarted,
            children, tasks,
            //userAuditInfo,

        } = model;
        this.id = id;
        this.name = name;
        this.moduleId = moduleId;
        this.processStartDate = (processStartDate) ? processStartDate: null;
        this.processEndDate = (processEndDate)? processEndDate: null;

        this.startPhaseId = startPhaseId;
        this.endPhaseId = endPhaseId;
        this.startPhaseName = startPhaseName;
        this.endPhaseName = endPhaseName;

        this.sortOrder = sortOrder;
        this.isCompleted = isCompleted;
        this.isStarted = isStarted;

        //this.orgProcess = new OrgProcess(orgProcess || {});
        //this.status = status;
        this.children = (children || []).map(r => new ProjectProcess(r));
        this.tasks = (tasks || []).map(r => new ProjectTask(r));
        //this.userAudit = new UserAuditInfo(userAuditInfo);
    }
}

export class ProjectProcessSerializer {
  fromJson(json: any): ProjectProcess { return new ProjectProcess(json); }
  toJson(model: any): any {return model;}
}
