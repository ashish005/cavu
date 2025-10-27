import {CoreResource} from "@app-global";

export class PayoutPlan {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class TransportShift {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class LicenseType {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class DriverLookup extends CoreResource {
    licenseTypes: Array<LicenseType> = [];
    plans: Array<PayoutPlan> = [];
    shifts: Array<TransportShift> = [];
    constructor(model: any = <any>{}){
        super();
        const { plans, shifts, licenseTypes } = model;
        this.licenseTypes = (licenseTypes || []).map((r)=> new LicenseType(r));
        this.plans = (plans || []).map((r)=> new PayoutPlan(r));
        this.shifts  = (shifts || []).map((r)=> new TransportShift(r));
    }
}

export class DriverLookupSerializer {
    fromJson(json: any): DriverLookup { return new DriverLookup(json); }
    toJson(data: any): any { return {}; }
}
