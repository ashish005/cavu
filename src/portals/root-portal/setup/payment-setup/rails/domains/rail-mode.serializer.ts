import {CoreQueryOptions} from "@app-global";
export class RailModeQueryOptions extends CoreQueryOptions {
    railId: number;
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {
            railId: this.railId
        };
        return super.getParamByObject(obj);
    }
}

export class RailMode {
    id: number;
    name: string;
    paymentModeId: number;
    isPrimary: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, paymentModeId, isPrimary
        }  = model;
        this.id = id;
        this.name = name;
        this.paymentModeId = paymentModeId;
        this.isPrimary = isPrimary;
    }
}

export class RailModeSerializer {
    fromJson(json: any): RailMode { return new RailMode(json); }
    toJson(data: any): any { return data; }
}