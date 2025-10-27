export class FinanceLedgerGroupLookup {
    id: string;
    name: string;

    accountGroupId: number;
    parentGroupId: number;
    accountNatureId: number;
    accountNature: string;

    isNominalGroup: boolean;
    isHighPriority: boolean;

    sortOrder: boolean;

    accountCount: number;
    groupAccountCount: number;

    isLocked: boolean;
    status: string;

    children: Array<FinanceLedgerGroupLookup>;

    constructor(model: any = <any>{}){
        const {
            id, name, accountGroupId, parentGroupId, accountNatureId, accountNature,
            isNominalGroup, isHighPriority, sortOrder,
            isLocked, status,
            accountCount, groupAccountCount, children
        } = model;
        this.id = id;
        this.name = name;
        this.accountGroupId = accountGroupId;
        this.parentGroupId = parentGroupId;
        this.accountNatureId = accountNatureId;
        this.accountNature = accountNature;

        this.isNominalGroup = isNominalGroup;
        this.isHighPriority = isHighPriority;

        this.isLocked = isLocked;
        this.status = status;
        this.sortOrder =  sortOrder;

        this.accountCount = accountCount;
        this.groupAccountCount = groupAccountCount;
        this.children = (children || []).map((r)=> new FinanceLedgerGroupLookup(r));
    }
}