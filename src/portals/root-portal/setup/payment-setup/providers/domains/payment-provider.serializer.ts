import {CoreQueryOptions} from "@app-global";
export class PaymentProviderQueryOptions extends CoreQueryOptions {
    constructor(model: any = {}){super(model);}
    override toQueryString (){
        const obj = {};
        return super.getParamByObject(obj);
    }
}

export class PaymentProvider {
    id: number;
    name: string;
    code: string;
    description: string;

    typeName: string;
    website: string;
    railCount: boolean;
    countries: boolean;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, code, description,
            typeName, website, railCount, countries,
            isActive
        }  = model;
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;

        this.typeName = typeName;
        this.website = website;
        this.railCount = railCount;
        this.countries = countries;
        this.isActive = isActive;
    }
}

export class PaymentProviderSerializer {
    fromJson(json: any): PaymentProvider { return new PaymentProvider(json); }
    toJson(data: any): any { return data; }
}
