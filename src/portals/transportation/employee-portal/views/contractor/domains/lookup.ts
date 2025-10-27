import {CoreResource} from "@app-global";
export class ContractorLookup extends CoreResource {
    constructor(model: any = <any>{}){
        super();
        const {} = model;
    }
}

export class ContractorLookupSerializer {
    fromJson(json: any): ContractorLookup { return new ContractorLookup(json); }
    toJson(data: any): any { return {}; }
}
