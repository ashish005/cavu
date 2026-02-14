import {CoreQueryOptions, CoreResource} from "@app-global";

export class LedgerGroupSummaryQueryOptions extends CoreQueryOptions{
    startDate: string;
    endDate: string;

    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            fromDate: this.startDate,
            toDate: this.endDate
        };
        const params = super.getParamByObject(obj);
        return params;
    }
}

export class LedgerGroupSummary extends CoreResource {
    override id: string;
    head: string;

    accountGroupId: number;
    parentGroupId: number;
    accountNatureId: number;
    accountNature: string;

    isNominalGroup: boolean;
    isHighPriority: boolean;

    sortOrder: boolean;
    closingBalance: number;

    isLocked: boolean;
    status: string;

    constructor(model: any = <any>{}){
        super();
        const {
            id, head, accountGroupId, parentGroupId, accountNatureId, accountNature,
            isNominalGroup, isHighPriority, sortOrder,
            isLocked, status,
            closingBalance
        } = model;
        this.id = id;
        this.head = head;
        this.accountGroupId = accountGroupId;
        this.parentGroupId = parentGroupId;
        this.accountNatureId = accountNatureId;
        this.accountNature = accountNature;

        this.isNominalGroup = isNominalGroup;
        this.isHighPriority = isHighPriority;

        this.isLocked = isLocked;
        this.status = status;
        this.sortOrder =  sortOrder;

        this.closingBalance = closingBalance;
    }
}

export class LedgerGroupSummarySerializer {
    fromJson(json: LedgerGroupSummary): LedgerGroupSummary { return new LedgerGroupSummary(json); }
    toJson(model: any): any { return {}; }
}
