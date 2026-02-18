import { CoreQueryOptions, CoreResource } from "@app-global";

export class TrxnTypeAllocationQueryOptions extends CoreQueryOptions {
    modeTypeId: string;
    constructor(model: any = <any>{}){ super(); }
    override toQueryString (){
        const obj = { modeTypeId: this.modeTypeId };
        return super.getParamByObject(obj);
    }
}

export class TrxnTypeAllocation extends CoreResource{
    //id: string;
    modeTypeId: number;
    accountGroupId: number;
    accountId: string;
    isDefault: boolean;
    isAllowed: boolean;
    sortNo: number;

    accountGroupName: string;
    accountName: string;
    //children: Array<TrxnTypeAllocation>;

    constructor(model: any = <any>{}){
        super();
        const { id, modeTypeId, accountGroupId, accountId, isDefault, isAllowed, sortNo, accountGroupName, accountName }  = model;
        this.id = id;
        this.modeTypeId = modeTypeId;
        this.accountGroupId = accountGroupId;
        this.accountId = accountId;
        this.isDefault = isDefault;
        this.isAllowed = isAllowed;
        this.sortNo = sortNo;

        this.accountGroupName = accountGroupName;
        this.accountName = accountName;
    }
}

export class TrxnTypeAllocationSerializer {
    fromJson(json: any): TrxnTypeAllocation { return new TrxnTypeAllocation(json); }
    toJson(data: any): any { return data; }
}
