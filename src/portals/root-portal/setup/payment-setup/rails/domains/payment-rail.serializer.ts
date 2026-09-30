import {CoreQueryOptions} from "@app-global";
export class PaymentRailQueryOptions extends CoreQueryOptions {
    constructor(model: any = {}){super(model);}
    override toQueryString (){
        const obj = {};
        return super.getParamByObject(obj);
    }
}

export class PaymentRail {
    id: number;
    name: string;
    code: string;
    description: string;

    typeName: string;

    currencies: number;
    countries: number;
    paymentModes: number;
    providers: number;

    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, code, description, typeName,
            currencies, countries, paymentModes, providers,
            isActive
        }  = model;
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.typeName = typeName;

        this.currencies = currencies;
        this.countries = countries;
        this.paymentModes = paymentModes;
        this.providers = providers;

        this.isActive = isActive;
    }
}

export class PaymentRailSerializer {
    fromJson(json: any): PaymentRail { return new PaymentRail(json); }
    toJson(data: any): any { return data; }
}
