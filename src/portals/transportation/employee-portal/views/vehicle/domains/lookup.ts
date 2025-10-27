import {CoreResource} from "@app-global";
export class Contractor {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class ContractType {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class Model {
    id: string;
    name: string;
    fuelTypeId: number;
    manufactureId: number;
    vehicleTypeId: number;
    mileage: number;

    fuelTypeName: string;
    manufactureName: string;
    vehicleTypeName: string;
    constructor(model: any = <any>{}){
        const {
            id, name, fuelTypeId, manufactureId, vehicleTypeId, mileage,
            fuelTypeName, manufactureName, vehicleTypeName
        } = model;
        this.id = id;
        this.name = name;
        this.fuelTypeId = fuelTypeId;
        this.manufactureId = manufactureId;
        this.vehicleTypeId = vehicleTypeId;
        this.mileage = mileage;

        this.fuelTypeName = fuelTypeName;
        this.manufactureName = manufactureName;
        this.vehicleTypeName = vehicleTypeName;
    }

    get showName(){ return `${this.manufactureName}-${this.name}`; }
}

export class FuelType {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class PayoutPlan {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class ReportType {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class InsuranceCompany {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class InsuranceType {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class MileageType {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class InspectionFrequency {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class InspectionStatus {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class ServiceStatus {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class VehicleLookup extends CoreResource {
    contractors: Array<Contractor> = [];
    contractTypes: Array<ContractType> = [];
    models: Array<Model> = [];

    fuelTypes: Array<FuelType> = [];
    plans: Array<PayoutPlan> = [];
    reportTypes: Array<ReportType> = [];
    insuranceCompanies: Array<ReportType> = [];
    insuranceTypes: Array<InsuranceType> = [];
    mileageTypes: Array<MileageType> = [];
    inspectionFrequencies: Array<InspectionFrequency> = [];
    inspectionStatuses: Array<InspectionStatus> = [];
    serviceStatuses: Array<ServiceStatus> = [];
    constructor(model: any = <any>{}){
        super();
        const { contractors, contractTypes, models, fuelTypes, plans, reportTypes, insuranceCompanies, insuranceTypes, mileageTypes, inspectionFrequencies, inspectionStatuses, serviceStatuses } = model;
        this.contractors = (contractors || []).map((r)=> new Contractor(r));
        this.contractTypes = (contractTypes || []).map((r)=> new ContractType(r));
        this.models  = (models || []).map((r)=> new Model(r));

        this.fuelTypes  = (fuelTypes || []).map((r)=> new FuelType(r));
        this.plans  = (plans || []).map((r)=> new PayoutPlan(r));
        this.reportTypes  = (reportTypes || []).map((r)=> new ReportType(r));

        this.insuranceCompanies  = (insuranceCompanies || []).map((r)=> new InsuranceCompany(r));
        this.insuranceTypes  = (insuranceTypes || []).map((r)=> new InsuranceType(r));
        this.mileageTypes  = (mileageTypes || []).map((r)=> new MileageType(r));
        this.inspectionFrequencies  = (inspectionFrequencies || []).map((r)=> new InspectionFrequency(r));
        this.inspectionStatuses  = (inspectionStatuses || []).map((r)=> new InspectionStatus(r));
        this.serviceStatuses  = (serviceStatuses || []).map((r)=> new ServiceStatus(r));
    }

    getModelsByFuelType=(fuelTypeId)=> this.models.filter(r => r.fuelTypeId == fuelTypeId);
}

export class VehicleLookupSerializer {
    fromJson(json: any): VehicleLookup { return new VehicleLookup(json); }
    toJson(data: any): any { return {}; }
}
