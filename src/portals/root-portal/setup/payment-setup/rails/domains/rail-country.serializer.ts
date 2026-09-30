import {CoreQueryOptions} from "@app-global";
export class RailCountryQueryOptions extends CoreQueryOptions {
    railId: number;
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {
            railId: this.railId
        };
        return super.getParamByObject(obj);
    }
}

export class RailCountry
{
    id: number;
    name: string;
    code: string;
    countryId: number;
    isEnabled: boolean;
    supportsIncoming: boolean;
    supportsOutgoing: boolean;
    supportsRefund: boolean;
    supportsRecurring: boolean;
    supportsMandate: boolean;
    effectiveFrom: boolean;
    effectiveTo: boolean;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, code,
            countryId, isEnabled,
            supportsIncoming, supportsOutgoing, supportsRefund, supportsRecurring,
            supportsMandate, effectiveFrom, effectiveTo,
            isActive
        }  = model;
        this.id = id;
        this.name = name;
        this.code = code;

        this.countryId = countryId;
        this.isEnabled = isEnabled;
        this.supportsIncoming = supportsIncoming;
        this.supportsOutgoing = supportsOutgoing;
        this.supportsRefund = supportsRefund;
        this.supportsRecurring = supportsRecurring;

        this.supportsMandate = supportsMandate;
        this.effectiveFrom = effectiveFrom;
        this.effectiveTo = effectiveTo;
        this.isActive = isActive;
    }
}

export class RailCountrySerializer {
    fromJson(json: any): RailCountry { return new RailCountry(json); }
    toJson(data: any): any { return data; }
}
