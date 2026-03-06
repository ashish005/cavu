import {CoreQueryOptions} from "@app-global";

export class FeePenaltyTypeQueryOptions extends CoreQueryOptions{}

export class FeePenaltyRule {
    id: number;
    //feePenalityTypeId: number;
    isBalanceDue: boolean;

    fromDay: number;
    toDay: number;

    penaltyFrequency: number;
    calculationType: any;
    value: any;

    constructor(model: any = <any>{}) {
        const { id, feePenalityTypeId, isBalanceDue,
            penaltyFrequency, fromDay, toDay,
            calculationType, value
        } = model;
        this.id = id;
        //this.feePenalityTypeId = feePenalityTypeId;
        this.isBalanceDue = isBalanceDue;
        this.penaltyFrequency = penaltyFrequency;
        this.fromDay = fromDay;
        this.toDay = toDay;
        this.calculationType = calculationType;
        this.value = value;
    }
}

export class FeePenaltyType {
    id: string;
    name: string;

    rules: Array<FeePenaltyRule>;
    constructor(model: any = <any>{}) {
        const { id, name, rules } = model;
        this.id = id;
        this.name = name;
        this.rules = (rules || []).map(r => new FeePenaltyRule(r));
    }
}

export class FeePenaltyTypeSerializer {
    fromJson(json: any): FeePenaltyType { return new FeePenaltyType(json); }
    toJson(data: any): any {
        return data;
    }
}