import {CoreQueryOptions} from "@app-global";

export class PurchaseTypeQueryOptions extends CoreQueryOptions{
    constructor(){super();}

    override toQueryString ()
    {
        const obj = {};
        return super.getParamByObject(obj);
    }
}

export class PurchaseType {
    id: string;
    name: string;
    sortOrder: number;
    isDefault: boolean;
    status: boolean;
    isLocked: boolean;

    constructor(model: any = <any>{}){
        const { id, name, sortOrder, isDefault, status, isLocked }  = model;
        this.id = id;
        this.name = name;
        this.isDefault = isDefault;
        this.sortOrder = sortOrder;
        this.status = status;
        this.isLocked = isLocked;
    }
}

export class PurchaseTypeSerializer {
    fromJson(json: any): PurchaseType { return new PurchaseType(json); }
    toJson(data: any): any { return data; }
}
