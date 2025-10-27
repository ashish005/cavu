import {CoreQueryOptions, CoreResource} from "@app-global";//, SchedularDomain

export class MyTaskScheduleQueryOptions extends CoreQueryOptions {
    orgUserId: string;
    constructor(model: any = {}){
        super(model);
    }

    override toQueryString (){
        const obj = {
            orgUserId: this.orgUserId
        };
        return super.getParamByObject(obj);
    }
}
export class MyTaskSchedule //extends SchedularDomain
{
  id: string;
    description: string;
    frequencyType: string;
    frequencyMasterType: string;
    isFeeType: boolean;
    isPeriodType: boolean;
    isValidForSession: boolean;

    nextRunTime: string;

    lastRunStartTime: string;
    lastRunEndTime: string;
    lastRunResult: string;
    lastRunRemark: string;
    lastRunVerificationRemark: string;
    lastRunVerifiedByEmployeeId: string;
    lastRunVerifiedByEmployee: string;

    status: boolean;
    constructor(model: any = <any>{}) {
        //super(model);
        const { description, frequencyType, frequencyMasterType, isFeeType, isPeriodType, isValidForSession,
            lastRunStartTime, lastRunEndTime, lastRunResult, lastRunRemark, lastRunVerificationRemark, lastRunVerifiedByEmployeeId, lastRunVerifiedByEmployee,
            status }=  model;

        this.description = description;
        this.frequencyType = frequencyType;
        this.frequencyMasterType = frequencyMasterType;
        this.isFeeType = isFeeType;
        this.isPeriodType = isPeriodType;
        this.isValidForSession = isValidForSession || true;

        this.lastRunStartTime = lastRunStartTime;
        this.lastRunEndTime = lastRunEndTime;
        this.lastRunResult = lastRunResult;
        this.lastRunRemark = lastRunRemark;
        this.lastRunVerificationRemark = lastRunVerificationRemark;
        this.lastRunVerifiedByEmployeeId = lastRunVerifiedByEmployeeId;
        this.lastRunVerifiedByEmployee = lastRunVerifiedByEmployee;

        this.status = status;
    }
}

export class MyTaskScheduleSerializer {
    fromJson(json: any): MyTaskSchedule { return new MyTaskSchedule(json); }
    toJson(data: any): any {return data; }
}
