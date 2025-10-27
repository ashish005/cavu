import {CoreQueryOptions, CoreResource} from "@app-global";

export class MyCalendarQueryOptions extends CoreQueryOptions {
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

export class MyCalendar extends CoreResource
{
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
        super();
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

export class MyCalendarSerializer {
    fromJson(json: any): MyCalendar { return new MyCalendar(json); }
    toJson(data: any): any {return data; }
}
