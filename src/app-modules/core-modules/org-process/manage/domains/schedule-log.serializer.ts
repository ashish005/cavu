import {CoreQueryOptions, CoreResource} from "@app-global";

export class ScheduleLogQueryOptions extends CoreQueryOptions {
    orgUserId: string;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            orgUserId: this.orgUserId
        };
        return super.getParamByObject(obj);
    }
}
export class ScheduleLog
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
    frequencyTypeName: string;
    taskName: string;
    processName: string;
    taskPriorityName: string;

    createdDate: string;
    constructor(model: any = <any>{}) {
        const {
            id,
            startDate, endDate, dueDate, isAutoRun,
            remark, orgTaskScheduleId, taskStatusTypeId, verifiedByEmployeeId,
            verificationRemark, verifiedByEmployeeName, taskStatusTypeName,
            name, frequencyTypeName, taskName, processName, taskPriorityName, createdDate
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
        this.frequencyTypeName = frequencyTypeName;
        this.taskName = taskName;
        this.processName = processName;
        this.taskPriorityName = taskPriorityName;
        this.createdDate = createdDate;
    }

    public get controlStartDate(){ return this.startDate; }
    public get controlEndDate(){ return this.endDate; }
}

export class ScheduleLogSerializer {
    fromJson(json: any): ScheduleLog { return new ScheduleLog(json); }
    toJson(data: any): any {return data; }
}
