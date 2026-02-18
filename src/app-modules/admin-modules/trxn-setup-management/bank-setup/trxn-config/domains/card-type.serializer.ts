import {CoreQueryOptions} from "@app-global";

export class PaymentCardTypeQueryOptions extends CoreQueryOptions{
    startDate: string;
    constructor(){super();}

    override toQueryString ()
    {
        const obj = {
            startDate: this.startDate
        };
        return super.getParamByObject(obj);
    }
}

export class PaymentCardType {
    id: string;
    name: string;
    isLocked: boolean;
    status: string;

    constructor(model: any = <any>{}){
        const { id, name, isLocked, status}  = model;
        this.id = id;
        this.name = name;
        this.isLocked = isLocked;
        this.status = status;
    }
}


export class PaymentCardTypeSerializer {
    fromJson(json: any): PaymentCardType { return new PaymentCardType(json); }
    toJson(data: any): any { return data; }
}
