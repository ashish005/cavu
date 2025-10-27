import {CoreQueryOptions, CoreResource} from "@app-global";

export class VehicleInspectionQueryOptions extends CoreQueryOptions{
    vehicleId: number;
    tillDate: string;
    constructor(data: any = {}){
        super(data);
    }

    override toQueryString (){
        const obj = {
            vehicleId: this.vehicleId,
            tillDate: this.tillDate
        };
        return super.getParamByObject(obj);
    }
}

export class VehicleInspectionDetail extends CoreResource
{
    inspectionHeadId: number;
    inspectionHeadName: string;
    inspectionScheduleId: number;
    rateInspection: number;
    isInspected: boolean;
    inspectionStatus: string;
    inspectionStatusName: string;
    isRepairRequired: boolean;
    remark: string;

    constructor(model: any = <any>{}){
        super();
        const {
            id, inspectionHeadId, inspectionHeadName, inspectionScheduleId, rateInspection,
            isInspected, inspectionStatus, inspectionStatusName,
            isRepairRequired, remark
        } = model;
        this.id = id;
        this.inspectionHeadId = inspectionHeadId;
        this.inspectionHeadName = inspectionHeadName;
        this.inspectionScheduleId = inspectionScheduleId;
        this.rateInspection = rateInspection;
        this.isInspected = isInspected;
        this.inspectionStatus = inspectionStatus;
        this.inspectionStatusName = inspectionStatusName;
        this.isRepairRequired = isRepairRequired;
        this.remark = remark;
    }
}

export class VehicleInspection extends CoreResource
{
    vehicleId: number;
    vehicleNo: string;
    dueDate: string;
    inspectionStatus: string;
    inspectedByName: string;
    inspectedById: string;
    inspectedBy: string;
    detailCount: number;
    details: Array<VehicleInspectionDetail>;

    isLocked: boolean;
    status: string;
    constructor(model: any = <any>{}){
        super();
        const {
            id, vehicleId, vehicleNo, dueDate, inspectionStatus,
            inspectedById, inspectedByName,
            detailCount, details, isLocked, status
        } = model;
        this.id = id;
        this.vehicleId = vehicleId;
        this.vehicleNo = vehicleNo;
        this.dueDate = dueDate;
        this.inspectionStatus = inspectionStatus;
        this.inspectedById = inspectedById;
        this.inspectedByName = inspectedByName;
        this.detailCount = detailCount;
        this.details = (details || []).map(r => new VehicleInspectionDetail(r));

        this.isLocked = isLocked;
        this.status = status;
    }
}

export class VehicleInspectionSerializer {
  fromJson(json: any): VehicleInspection { return new VehicleInspection(json); }
  toJson(model: any): any {return model;}
}
