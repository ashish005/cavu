import {CoreQueryOptions} from "@app-global";

export class BankTransactionTypeQueryOptions extends CoreQueryOptions{
    constructor(){super();}
    override toQueryString ()
    {
        const obj = {};
        return super.getParamByObject(obj);
    }
}

export class BankTransactionType {
    id: number;
    name: string;
    description: string;
    code: string;
    direction: boolean;
    directionName: string;

    isReconciliationRelevant: boolean;
    sortOrder: number;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, description, code,
            direction, directionName,
            isReconciliationRelevant,
            sortOrder,
            isActive
        }  = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.code = code;
        this.direction = direction;
        this.directionName = directionName;
        this.isReconciliationRelevant = isReconciliationRelevant;
        this.sortOrder = sortOrder;
        this.isActive = isActive;
    }
}


export class BankTransactionTypeSerializer {
    fromJson(json: any): BankTransactionType { return new BankTransactionType(json); }
    toJson(data: any): any { return data; }
}
