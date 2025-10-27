import {CoreQueryOptions, CoreResource, STATUS_ENUM} from "@app-global";

export class VehiclePayoutPlanQueryOptions extends CoreQueryOptions{}

export class VehiclePayoutPlanHead {
    id: number;
    headName: string;
    headId: boolean;
    amount: number;
    basedOn: string;
    frequency: string;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const { id, headName, headId, amount, basedOn, frequency, isActive} = model;
        this.id = id;
        this.headName = headName;
        this.headId = headId;
        this.amount = amount;
        this.basedOn = basedOn;
        this.frequency = frequency;
        this.isActive = isActive;
    }
}
export class VehiclePayoutPlan extends CoreResource {
    name: string;
    planHeads: Array<VehiclePayoutPlanHead>;

    isLocked: boolean;
    status: string;
    constructor(model: any = <any>{}){
        super();
        const { id, name, isLocked, status, planHeads} = model;
        this.id = id;
        this.name = name;
        this.isLocked = isLocked;
        this.status = status;
        this.planHeads = (planHeads || []).map((r)=> new VehiclePayoutPlanHead(r));
    }
}

export class VehiclePayoutPlanSerializer {
  fromJson(json: any): VehiclePayoutPlan { return new VehiclePayoutPlan(json); }

  toJson(data: any): any {
      data.planHeads.map(r => {
          r.status = r.isActive ? STATUS_ENUM.ACTIVE: STATUS_ENUM.INACTIVE;
      });
      return data;
  }
}
