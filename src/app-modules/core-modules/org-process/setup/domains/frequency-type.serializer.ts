import {CoreQueryOptions} from "@app-global";

export class FrequencyTypeQueryOptions extends CoreQueryOptions{
    constructor(){super();}

    override toQueryString ()
    {
        const obj = {};
        return super.getParamByObject(obj);
    }
}

export class FrequencyType {
    id: string;
    name: string;
    isFeeType: boolean;
    isPeriodType: boolean;
    status: boolean;
    isLocked: boolean;

    constructor(model: any = <any>{}){
        const { id, name, isFeeType, isPeriodType, status, isLocked, accountId, hasTax, hasVoucherCredit }  = model;
        this.id = id;
        this.name = name;
        this.isFeeType = isFeeType;
        this.isPeriodType = isPeriodType;

        this.status = status;
        this.isLocked = isLocked;
    }
}

export class FrequencyTypeSerializer {
    fromJson(json: any): FrequencyType { return new FrequencyType(json); }
    toJson(data: any): any { return data; }
}
