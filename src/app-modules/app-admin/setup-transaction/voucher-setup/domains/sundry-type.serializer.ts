import {CoreQueryOptions} from "@app-global";

export class VoucherSundryTypeQueryOptions extends CoreQueryOptions{
    constructor(){super();}

    override toQueryString ()
    {
        const obj = {};
        return super.getParamByObject(obj);
    }
}

export class VoucherSundryType {
    id: string;
    name: string;
    status: boolean;
    isLocked: boolean;

    accountId: string;
    hasTax: boolean;
    hasVoucherCredit: boolean;
    constructor(model: any = <any>{}){
        const { id, name, status, isLocked, accountId, hasTax, hasVoucherCredit }  = model;
        this.id = id;
        this.name = name;
        this.status = status;
        this.isLocked = isLocked;

        this.accountId = accountId;
        this.hasTax = hasTax;
        this.hasVoucherCredit = hasVoucherCredit;
    }
}

export class VoucherSundryTypeSerializer {
    fromJson(json: any): VoucherSundryType { return new VoucherSundryType(json); }
    toJson(data: any): any { return data; }
}
