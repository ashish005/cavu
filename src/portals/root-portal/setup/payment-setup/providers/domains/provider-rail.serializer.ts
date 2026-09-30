import {CoreQueryOptions} from "@app-global";
export class ProviderRailQueryOptions extends CoreQueryOptions {
    providerId: number;
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {
            providerId: this.providerId
        };
        return super.getParamByObject(obj);
    }
}

export class ProviderRail
{
    id: number;
    name: string;
    isEnabled: boolean;
    supportsIncoming: boolean;
    supportsOutgoing: boolean;
    supportsRefund: boolean;
    supportsRecurring: boolean;
    supportsMandate: boolean;
    effectiveFrom: string;
    effectiveTo: string;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, code, isEnabled,
            supportsIncoming, supportsOutgoing, supportsRefund, supportsRecurring,
            supportsMandate, effectiveFrom, effectiveTo,
            isActive
        }  = model;
        this.id = id;
        this.name = name;

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

export class ProviderRailSerializer {
    fromJson(json: any): ProviderRail { return new ProviderRail(json); }
    toJson(data: any): any { return data; }
}
