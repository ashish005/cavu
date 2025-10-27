import {CoreQueryOptions, CoreResource, STATUS_ENUM} from "@app-global";

export class DriverPayoutPlanQueryOptions extends CoreQueryOptions{}

export class DriverPayoutPlanHead {
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
export class DriverPayoutPlan extends CoreResource {
    name: string;
    isDefault: boolean;
    payoutFrequency: number;
    frequencyName: string;
    payoutDay: number;
    weekDay: number;
    planHeads: Array<DriverPayoutPlanHead>;

    isLocked: boolean;
    status: string;
  constructor(model: any = <any>{}){
    super();
      const { id, name, payoutFrequency, frequencyName, payoutDay, weekDay, isLocked, status, planHeads} = model;
      this.id = id;
      this.name = name;
      this.payoutFrequency = payoutFrequency;
      this.frequencyName = frequencyName;
      this.payoutDay = payoutDay;
      this.weekDay = weekDay;
      this.isLocked = isLocked;
      this.status = status;
      this.planHeads = (planHeads || []).map((r)=> new DriverPayoutPlanHead(r));
  }
}

export class DriverPayoutPlanSerializer {
  fromJson(json: any): DriverPayoutPlan { return new DriverPayoutPlan(json); }

  toJson(data: any): any {

      data.planHeads.map(r => {
          r.status = r.isActive ? STATUS_ENUM.ACTIVE: STATUS_ENUM.INACTIVE;
      });
      return data;
  }
}
