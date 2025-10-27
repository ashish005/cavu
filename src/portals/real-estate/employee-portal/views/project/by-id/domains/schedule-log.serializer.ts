import {CoreQueryOptions, CoreResource} from "@app-global";

export class ProjectScheduleLogQueryOptions extends CoreQueryOptions {
    orgUserId: string;
    projectId: string;
    accountId: string;
    customerId: string;
    moduleId: string;
    constructor(model: any = {}){ super(model); }

    toQueryString (){
        const obj = {
            orgUserId: this.orgUserId,
            projectId: this.projectId,
            accountId: this.accountId,
            customerId: this.customerId,
            moduleId: this.moduleId
        };
        return super.getParamByObject(obj);
    }
}

export class ProjectScheduleLog
{
    id: number;
    startDate: string;
    endDate: string;
    dueDate: string;

    isAutoRun: boolean;
    isSuccess: boolean;

    remark: string;
    orgTaskScheduleId: number;
    taskStatusTypeId: number;
    verifiedByEmployeeId: string;

    verificationRemark: string;
    verifiedByEmployeeName: string;
    taskStatusTypeName: string;

    name: string;
    orgTaskTypeName: string;
    frequencyTypeName: string;

    taskPriorityName: string;
    orgProcessName: string;
    projectProcessName: string;
    constructor(model: any = <any>{}) {
        const {
            id,
            startDate, endDate, dueDate, isAutoRun,
            remark, orgTaskScheduleId, taskStatusTypeId, verifiedByEmployeeId,
            verificationRemark, verifiedByEmployeeName, taskStatusTypeName,
            name, orgTaskTypeName, frequencyTypeName,
            taskPriorityName, orgProcessName, projectProcessName
        }=  model;

        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dueDate = dueDate;

        this.isAutoRun = isAutoRun;

        this.remark = remark;
        this.orgTaskScheduleId = orgTaskScheduleId;
        this.taskStatusTypeId = taskStatusTypeId;
        this.verifiedByEmployeeId = verifiedByEmployeeId;

        this.verificationRemark = verificationRemark;
        this.verifiedByEmployeeName = verifiedByEmployeeName;
        this.taskStatusTypeName = taskStatusTypeName;

        this.name = name;
        this.orgTaskTypeName = orgTaskTypeName;
        this.frequencyTypeName = frequencyTypeName;

        this.taskPriorityName = taskPriorityName;
        this.orgProcessName = orgProcessName;
        this.projectProcessName = projectProcessName;
    }

    public get controlStartDate(){ return this.startDate; }
    public get controlEndDate(){ return this.endDate; }
}

export class ProjectScheduleLogSerializer {
    fromJson(json: any): ProjectScheduleLog { return new ProjectScheduleLog(json); }
    toJson(data: any): any {return data; }
}
