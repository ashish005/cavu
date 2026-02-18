import {CoreQueryOptions} from "@app-global";

export class SaleChannelQueryOptions extends CoreQueryOptions{
    constructor(){super();}

    override toQueryString ()
    {
        const obj = {};
        return super.getParamByObject(obj);
    }
}

export class SaleChannel {
    id: string;
    name: string;
    commissionRate: number;
    status: boolean;
    isLocked: boolean;

    constructor(model: any = <any>{}){
        const { id, name, commissionRate, status, isLocked }  = model;
        this.id = id;
        this.name = name;
        this.commissionRate = commissionRate;
        this.status = status;
        this.isLocked = isLocked;
    }
}

export class SaleChannelSerializer {
    fromJson(json: any): SaleChannel { return new SaleChannel(json); }
    toJson(data: any): any { return data; }
}
