import {CoreQueryOptions, CoreResource} from "@app-global";

export class VehicleInspectionScheduleQueryOptions extends CoreQueryOptions {
    vehicleId: number;
    constructor(data: any = {}){
        super(data);
    }

    override toQueryString (){
        const obj = {
            vehicleId: this.vehicleId
        };
        return super.getParamByObject(obj);
    }
}

export class InspectionSchedule extends CoreResource
{
    dueDate: string;
    headName: string;
    serviceStatus: string;
    certificateRequired: string;

    isLocked: boolean;
    status: string;
    constructor(model: any = <any>{}){
        super();
        const { id, dueDate, headName, serviceStatus, certificateRequired, isLocked, status } = model;
        this.id = id;
        this.dueDate = dueDate;
        this.headName = headName;
        this.serviceStatus = serviceStatus;
        this.certificateRequired = certificateRequired;

        this.isLocked = isLocked;
        this.status = status;
    }
}

export class VehicleInspectionSchedule extends CoreResource
{
    vehicleNo: string;
    dueDate: string;
    headCount: number;
    heads: Array<InspectionSchedule>;
    constructor(model: any = <any>{}){
        super();
        const { id, vehicleNo, dueDate, headCount, heads } = model;
        this.id = id;
        this.vehicleNo = vehicleNo;
        this.dueDate = dueDate;
        this.headCount = headCount;
        this.heads = (heads || []).map(r => new InspectionSchedule(r));
    }
}

export class VehicleInspectionScheduleSerializer {
  fromJson(json: any): VehicleInspectionSchedule { return new VehicleInspectionSchedule(json); }
  toJson(model: any): any {return model;}
}
