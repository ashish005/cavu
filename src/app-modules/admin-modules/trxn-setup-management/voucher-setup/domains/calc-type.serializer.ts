import {CoreQueryOptions} from "@app-global";

export class VoucherCalcTypeQueryOptions extends CoreQueryOptions{
    constructor(){super();}
    override toQueryString ()
    {
        const obj = {};
        return super.getParamByObject(obj);
    }
}

export class VoucherCalcType {
    id: string;
    action: string;
    valueType: string;
    formula: string;
    sortOrder: number;
    isDefault: boolean;
    status: boolean;
    constructor(model: any = <any>{}){
        const { id, action, valueType, formula, sortOrder, isDefault, status }  = model;
        this.id = id;
        this.action = action;
        this.valueType = valueType;
        this.formula = formula;
        this.isDefault = isDefault;
        this.sortOrder = sortOrder;
        this.status = status;
    }
}

export class VoucherCalcTypeSerializer {
    fromJson(json: any): VoucherCalcType { return new VoucherCalcType(json); }
    toJson(data: any): any { return data; }
}
