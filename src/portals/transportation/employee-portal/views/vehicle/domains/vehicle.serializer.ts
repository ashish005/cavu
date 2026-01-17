import { CoreQueryOptions, CoreResource } from "@app-global";

export class VehicleQueryOptions extends CoreQueryOptions {
    code: string;

    constructor(data: any = {}){
        super(data);
        this.code = data.code;
    }

    override toQueryString (){
        const obj = {
            code:this.code
        };
        return super.getParamByObject(obj);
    }
}

export class Vehicle extends CoreResource
{
    override id: number;
    ownerUserId: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;

    vehicleNo: string;
    mileage: string;
    mileageType: number;
    registrationValidity: string;

    insuranceNo: string;
    insuranceValidity: string;
    isDriveByOwner: boolean;

    modelId: number;
    fuelTypeId: number;

    planId: number;
    reportTypeId: number;
    insuranceCompanyId: number;
    insuranceTypeId: number;

    contractorId: number;
    contractorName:string;
    contractTypeId: number;
    contractTypeName:string;
    contractAmount: number;
    inspectionFrequency: number;
    inspectionFrequencyName: string;

    lastInspectionDate: string;
    lastServiceDate: string;
    vehicleStatus: string;
    isUnderInspection: boolean;
    isUnderService: boolean;

    modelName: string;
    vehicleTypeName: string;
    manufactureName: string;

    fuelTypeName: string;
    planName: string;
    reportTypeName: string;

    insuranceCompanyName: string;
    insuranceTypeName: string;

    registrationDocumentId: number;
    insuranceDocumentId: number;
    mileageName: string;
    constructor(model: any = <any>{}){
        super();
        const {
            id, ownerUserId, ownerName, ownerEmail, ownerPhone, vehicleNo,
            mileage, mileageType,
            registrationValidity, insuranceNo,insuranceValidity,
            isDriveByOwner,modelId, fuelTypeId,
            contractorId, contractorName, contractTypeId, contractAmount, contractTypeName,
            inspectionFrequency, inspectionFrequencyName, lastInspectionDate, lastServiceDate, vehicleStatus,
            planId, reportTypeId,
            insuranceCompanyId, insuranceTypeId,
            modelName, fuelTypeName, planName, reportTypeName,
            vehicleTypeName, manufactureName,
            insuranceCompanyName, insuranceTypeName,
            registrationDocumentId, insuranceDocumentId, mileageName,
            isUnderInspection, isUnderService
        } = model;
        this.id = id;
        this.ownerUserId = ownerUserId;
        this.ownerName = ownerName;
        this.ownerEmail = ownerEmail;
        this.ownerPhone = ownerPhone;
        this.vehicleNo = vehicleNo;
        this.mileage = mileage;
        this.mileageType = mileageType;
        this.registrationValidity = registrationValidity;
        this.insuranceNo = insuranceNo;
        this.insuranceValidity = insuranceValidity;
        this.isDriveByOwner = isDriveByOwner;

        this.mileageName = mileageName;
        this.modelId = modelId;
        this.fuelTypeId = fuelTypeId;

        this.contractorId = contractorId;
        this.contractorName = contractorName;
        this.contractTypeId = contractTypeId;
        this.contractTypeName = contractTypeName;
        this.contractAmount = contractAmount;
        this.inspectionFrequency = inspectionFrequency;

        this.lastInspectionDate = lastInspectionDate;
        this.lastServiceDate = lastServiceDate;
        this.vehicleStatus = vehicleStatus;
        this.isUnderInspection = isUnderInspection;
        this.isUnderService = isUnderService;

        this.planId = planId;
        this.reportTypeId = reportTypeId;
        this.insuranceCompanyId = insuranceCompanyId;
        this.insuranceTypeId = insuranceTypeId;

        this.modelName = modelName;
        this.vehicleTypeName = vehicleTypeName;
        this.manufactureName = manufactureName;
        this.fuelTypeName = fuelTypeName;
        this.planName = planName;
        this.reportTypeName = reportTypeName;
        this.insuranceCompanyName = insuranceCompanyName;
        this.insuranceTypeName = insuranceTypeName;

        this.registrationDocumentId = registrationDocumentId;
        this.insuranceDocumentId = insuranceDocumentId;
        this.inspectionFrequencyName = inspectionFrequencyName;
    }
}

export class VehicleSerializer {
  fromJson(json: any): Vehicle { return new Vehicle(json); }
  toJson(model: any): any {return model;}
}
