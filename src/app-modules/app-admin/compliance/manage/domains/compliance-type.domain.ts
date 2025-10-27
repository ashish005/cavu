import {CoreQueryOptions, CoreResource} from "@app-global";

export class ComplianceTypeQueryOptions extends CoreQueryOptions {
    constructor(model: any = {}){super(model);}

    toQueryString (){
        const obj = {};
        return super.getParamByObject(obj);
    }
}

export class ComplianceSubscription  extends CoreResource {
    public id: number;
    public name: string;

    constructor(model: any = {}){
        super();
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class ComplianceType  extends CoreResource {
    public id: number;
    public name: string;
    public countryId: number;
    public subscriptions: Array<ComplianceSubscription>;

    constructor(model: any = {}){
        super();
        const { id, name, countryId, subscriptions } = model;
        this.id = id;
        this.name = name;

        this.countryId = countryId;
        this.subscriptions = (subscriptions || []).map(r => new ComplianceSubscription(r));
    }
}

export class ComplianceTypeSerializer {
    fromJson(json: any): ComplianceType { return new ComplianceType(json); }
    toJson(data: any): any { return data; }
}
