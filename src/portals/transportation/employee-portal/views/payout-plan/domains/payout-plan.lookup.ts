import {CoreResource} from "@app-global";

class PayoutFrequency {
    id: string;
    name: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
    }
}

class PayoutBasis {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
    }
}

class VehiclePlanHead {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
    }
}

class DriverPlanHead {
    id: string;
    name: string;
    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
    }
}

export class PayoutPlanLookup extends CoreResource {
    payoutBasis: Array<PayoutBasis> = [];
    payoutFrequencies: Array<PayoutFrequency> = [];
    vehiclePayoutHeads: Array<VehiclePlanHead> = [];
    driverPayoutHeads: Array<DriverPlanHead> = [];
    constructor(model: any = <any>{}) {
        super();
        const { payoutBasis, payoutFrequencies, vehiclePayoutHeads, driverPayoutHeads } = model;
        this.payoutBasis = (payoutBasis || []).map(r => new PayoutBasis(r));
        this.payoutFrequencies = (payoutFrequencies || []).map(r => new PayoutFrequency(r));
        this.vehiclePayoutHeads = (vehiclePayoutHeads || []).map(r => new VehiclePlanHead(r));
        this.driverPayoutHeads = (driverPayoutHeads || []).map(r => new DriverPlanHead(r));
    }
}
export class PayoutPlanLookupSerializer {
  fromJson(json: any): PayoutPlanLookup { return new PayoutPlanLookup(json); }
  toJson(data: any): any { return {}; }
}
