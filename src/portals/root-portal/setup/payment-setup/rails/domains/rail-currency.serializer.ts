import {CoreQueryOptions} from "@app-global";
export class RailCurrencyQueryOptions extends CoreQueryOptions {
    railId: number;
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {
            railId: this.railId
        };
        return super.getParamByObject(obj);
    }
}

export class RailCurrency {
    id: number;
    name: string;
    currencyId: string;
    isEnabled: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, currencyId, isEnabled
        }  = model;
        this.id = id;
        this.name = name;
        this.currencyId = currencyId;
        this.isEnabled = isEnabled;
    }
}

export class RailCurrencySerializer {
    fromJson(json: any): RailCurrency { return new RailCurrency(json); }
    toJson(data: any): any { return data; }
}
