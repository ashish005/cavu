import { CoreQueryOptions } from "@app-global";

export class OrgTaskCalendarQueryOptions extends CoreQueryOptions {
    orgTaskId: any;
    orgUserId: string;

    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            orgTaskId: this.orgTaskId,
            orgUserId: this.orgUserId
        };
        return super.getParamByObject(obj);
    }
}
export class OrgTaskCalendar {
    id: number;
    orgTaskId: number;
    name: string;
    remark: string;
    inchargeId: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    inchargeName: string;
    taskName: string;

    constructor(model: any = <any>{}) {
        const { id, orgTaskId, name, remark, inchargeId, startDate, startTime, endDate, endTime, inchargeName, taskName } = model;
        this.id = id;
        this.orgTaskId = orgTaskId;
        this.name = name;
        this.remark = remark;
        this.inchargeId = inchargeId;
        this.startDate = startDate;
        this.startTime = startTime || '09:00';
        this.endDate = endDate;
        this.endTime = endTime || '21:00';
        this.inchargeName = inchargeName;
        this.taskName = taskName;
    }
}

export class OrgTaskCalendarSerializer {
    fromJson(json: any): OrgTaskCalendar { return new OrgTaskCalendar(json); }
    toJson(data: any): any { return data; }
}