import {CoreQueryOptions} from "@app-global";

export class PaymentModeQueryOptions extends CoreQueryOptions {
    systemTypeId: any;
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {
            systemTypeId: this.systemTypeId
        };
        return super.getParamByObject(obj);
    }
}

export class PaymentMode {
    id: string;
    name: string;
    description: string;
    instrumentId: number;
    instrumentName: string;
    isLocked: boolean;
    status: string;

    constructor(model: any = <any>{}){
        const { id, name, masterType, description, instrumentId, instrumentName, isLocked, status }  = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.instrumentId = instrumentId;
        this.instrumentName = instrumentName;
        this.isLocked = isLocked;
        this.status =  status;
    }
}

export class PaymentModeSerializer {
    fromJson(json: any): PaymentMode { return new PaymentMode(json); }
    toJson(data: any): any { return data; }
}
