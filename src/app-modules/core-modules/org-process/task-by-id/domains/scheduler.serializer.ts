import {CoreQueryOptions, CoreResource} from "@app-global";

export class SchedulerQueryOptions extends CoreQueryOptions{
    orgTaskId: string;
    override toQueryString (){
        const obj = {
            orgTaskId: this.orgTaskId
        };
        return super.getParamByObject(obj);
    }
}

export class SchedulerLogSummary extends CoreResource {
    //id: any;
    startDate: string;
    endDate: string;
    dueDate: string;

    remark: string;

    orgTaskScheduleId: number;
    taskStatusTypeId: number;
    verifiedByEmployeeId: string;

    verificationRemark: string;
    verifiedByEmployeeName: string;
    taskStatusTypeName: string;
    constructor(model: any = <any>{}){
        super();
        const {
            id,
            startDate, endDate, dueDate, remark,
            orgTaskScheduleId, taskStatusTypeId, verifiedByEmployeeId,
            verificationRemark, verifiedByEmployeeName, taskStatusTypeName
        } = model || {};
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dueDate = dueDate;

        this.remark = remark || null;

        this.orgTaskScheduleId = orgTaskScheduleId || null;
        this.taskStatusTypeId = taskStatusTypeId;
        this.verifiedByEmployeeId = verifiedByEmployeeId;

        this.verificationRemark = verificationRemark;
        this.verifiedByEmployeeName = verifiedByEmployeeName;
        this.taskStatusTypeName = taskStatusTypeName;
    }
}
export class Scheduler extends CoreResource {
    name: string;
    description: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    frequencyTypeId: number;
    orgTaskId: number;
    isFeeTask: number;

    // isManual: boolean;
    // isPrimary: boolean;

    frequencyTypeName: string;
    taskName: string;
    taskPriority: string;
    processName: string;

    lastSuccessRun: SchedulerLogSummary;
    lastRun: SchedulerLogSummary;
    nextRun: SchedulerLogSummary;
    todayRun: SchedulerLogSummary;

    status: boolean;
    isLocked: boolean;
    constructor(model: any = <any>{}){
        super();
        const {
            id, name, description,
            startDate, startTime, endDate, endTime,
            frequencyTypeId, orgTaskId,
            isManual, isPrimary,
            frequencyTypeName, taskName, taskPriority, processName,

            lastSuccessRun, lastRun, nextRun, todayRun,
            status,
            isLocked
        } = model || {};
        this.id = id;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.startTime = startTime;
        this.endDate = endDate;
        this.endTime = endTime;
        this.frequencyTypeId = frequencyTypeId || null;
        this.orgTaskId = orgTaskId || null;
        // this.isPrimary = isPrimary || false;
        // this.isManual = isManual || true;


        this.frequencyTypeName = frequencyTypeName;
        this.taskName = taskName;
        this.taskPriority = taskPriority;
        this.processName = processName;
        this.lastSuccessRun = lastSuccessRun ? new SchedulerLogSummary(lastSuccessRun): null;
        this.lastRun = lastRun ? new SchedulerLogSummary(lastRun): null;
        this.nextRun = nextRun ? new SchedulerLogSummary(nextRun): null;
        this.todayRun = todayRun ? new SchedulerLogSummary(todayRun): null;

        this.status = status;
        this.isLocked = isLocked;
    }
}

export class SchedulerSerializer {
  fromJson(json: any): Scheduler { return new Scheduler(json); }
  toJson(data: any): any { return data; }
}
