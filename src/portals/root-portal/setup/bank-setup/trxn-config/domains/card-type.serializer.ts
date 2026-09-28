import {CoreQueryOptions} from "@app-global";

export class PaymentCardTypeQueryOptions extends CoreQueryOptions{
    startDate: string;
    constructor(){super();}

    override toQueryString ()
    {
        const obj = {
            startDate: this.startDate
        };
        return super.getParamByObject(obj);
    }
}

export class PaymentCardType {
    id: number;
    name: string;
    description: string;
    code: string;
    categoryName: string;
    category: number;
    supportsContactless: boolean;
    supportsOnline: boolean;
    supportsRecurring: boolean;
    supportsTokenization: boolean;
    sortOrder: number;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, description, code, categoryName, category,
            supportsContactless,
            supportsOnline,
            supportsRecurring,
            supportsTokenization,
            sortOrder,
            isActive
        }  = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.code = code;

        this.category = category;
        this.categoryName = categoryName;

        this.supportsContactless = supportsContactless;
        this.supportsOnline = supportsOnline;
        this.supportsRecurring = supportsRecurring;
        this.supportsTokenization = supportsTokenization;
        this.sortOrder = sortOrder;
        this.isActive = isActive;
    }
}

export class PaymentCardTypeSerializer {
    fromJson(json: any): PaymentCardType { return new PaymentCardType(json); }
    toJson(data: any): any { return data; }
}
