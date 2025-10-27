import {CoreQueryOptions, CoreResource} from "@app-global";

export class ProjectScheduleQueryOptions extends CoreQueryOptions{
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

export class ProjectSchedule extends CoreResource {
    id: any;
    name: string;
    description: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    frequencyTypeId: number;
    orgTaskId: number;
    isFeeTask: number;

    isManual: boolean;

    frequencyTypeName: string;

    // lastSuccessRun: SchedulerLogSummary;
    // lastRun: SchedulerLogSummary;
    // nextRun: SchedulerLogSummary;
    // todayRun: SchedulerLogSummary;

    status: boolean;
    isLocked: boolean;
    constructor(model: any = <any>{}){
        super();
        const {
            id, name, description,
            startDate, startTime, endDate, endTime,
            frequencyTypeId, orgTaskId,
            isManual,
            frequencyTypeName,

            lastSuccessRun, lastRun, nextRun, todayRun,
            status,
            isLocked
        } = model || {};
        this.id = id;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.startTime = startTime || '09:00';
        this.endDate = endDate;
        this.endTime = endTime || '19:00';
        this.frequencyTypeId = frequencyTypeId || null;
        this.orgTaskId = orgTaskId || null;

        this.frequencyTypeName = frequencyTypeName;

        // this.lastSuccessRun = lastSuccessRun ? new SchedulerLogSummary(lastSuccessRun): null;
        // this.lastRun = lastRun ? new SchedulerLogSummary(lastRun): null;
        // this.nextRun = nextRun ? new SchedulerLogSummary(nextRun): null;
        // this.todayRun = todayRun ? new SchedulerLogSummary(todayRun): null;

        this.status = status;
        this.isLocked = isLocked;
    }
}

export class ProjectScheduleSerializer {
  fromJson(json: any): ProjectSchedule { return new ProjectSchedule(json); }
  toJson(data: any): any { return data; }
}
