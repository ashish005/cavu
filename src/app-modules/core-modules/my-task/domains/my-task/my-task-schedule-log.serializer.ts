import {CoreQueryOptions, CoreResource} from "@app-global";

export class MyTaskScheduleLogQueryOptions extends CoreQueryOptions {
    orgUserId: string;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            orgUserId: this.orgUserId
        };
        return super.getParamByObject(obj);
    }
}
export class MyTaskScheduleLog
{
    id: number;
    startDate: string;
    endDate: string;
    dueDate: string;

    isAutoRun: boolean;

    remark: string;
    orgTaskScheduleId: number;
    taskStatusTypeId: number;
    verifiedByEmployeeId: string;

    verificationRemark: string;
    verifiedByEmployeeName: string;
    taskStatusTypeName: string;
    result: string;

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
            verificationRemark, verifiedByEmployeeName, taskStatusTypeName, result,
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
        this.result = result;

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

export class MyTaskScheduleLogSerializer {
    fromJson(json: any): MyTaskScheduleLog { return new MyTaskScheduleLog(json); }
    toJson(data: any): any {return data; }
}
