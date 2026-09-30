import {CoreQueryOptions} from "@app-global";
export class ProviderCountryQueryOptions extends CoreQueryOptions {
    providerId: number;
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {
            providerId: this.providerId
        };
        return super.getParamByObject(obj);
    }
}

export class ProviderCountry {
    id: number;
    name: string;
    isEnabled: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, isEnabled
        }  = model;
        this.id = id;
        this.name = name;
        this.isEnabled = isEnabled;
    }
}

export class ProviderCountrySerializer {
    fromJson(json: any): ProviderCountry { return new ProviderCountry(json); }
    toJson(data: any): any { return data; }
}
