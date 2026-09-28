import {CoreQueryOptions} from "@app-global";

export class BankAccountTypeQueryOptions extends CoreQueryOptions{
    constructor(){super();}
    override toQueryString ()
    {
        const obj = {};
        return super.getParamByObject(obj);
    }
}

export class BankAccountType {
    id: number;
    name: string;
    description: string;
    code: string;

    isBusiness: boolean;
    isPersonal: boolean;
    supportsIncoming: boolean;
    supportsOutgoing: boolean;
    supportsDirectDebit: boolean;
    supportsInterest: boolean;

    sortOrder: number;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, description, code,
            isBusiness, isPersonal,
            supportsIncoming, supportsOutgoing,
            supportsDirectDebit, supportsInterest,
            sortOrder,
            isActive
        }  = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.code = code;
        this.isBusiness = isBusiness;
        this.isPersonal = isPersonal;
        this.supportsIncoming = supportsIncoming;
        this.supportsOutgoing = supportsOutgoing;
        this.supportsDirectDebit = supportsDirectDebit;
        this.supportsInterest = supportsInterest;
        this.sortOrder = sortOrder;
        this.isActive = isActive;
    }
}


export class BankAccountTypeSerializer {
    fromJson(json: any): BankAccountType { return new BankAccountType(json); }
    toJson(data: any): any { return data; }
}
