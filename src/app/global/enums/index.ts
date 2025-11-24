export {Referrals} from "./constants";

export {FREQUENCY_TYPE, WEEK_DAYS, MONTHS, DAYS, WEEK_OF, YEAR_MODES, YEAR_MODE_ENUM } from "./tasks.enums";

export {ORG_PROCESS_TYPE, ORG_NOTIFICATION_MEDIA_TYPE} from "./process-enums";

export enum CALC_TYPE {
    FIXED = 1,
    PERCENTAGE = 2
}

export enum PENALTY_FREQUENCY_TYPE {
    DAILY = 1,
    DAY_RANGE = 2
}

class CalculationTypeLookup {
    id: string;
    name: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
    }
}

class PenaltyFrequencyLookup {
    id: string;
    name: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
    }
}

export const calculationTypes: Array<CalculationTypeLookup> = [
    new CalculationTypeLookup({ id: CALC_TYPE.FIXED, name: 'Fixed' }),
    new CalculationTypeLookup({ id: CALC_TYPE.PERCENTAGE, name: '%' })
];

export const penaltyFrequencies: Array<PenaltyFrequencyLookup> = [
    new PenaltyFrequencyLookup({ id: PENALTY_FREQUENCY_TYPE.DAILY, name: 'Daily' }),
    new PenaltyFrequencyLookup({ id: PENALTY_FREQUENCY_TYPE.DAY_RANGE, name: 'Day Range' })
];