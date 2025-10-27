import {CoreResource} from "@app-global";
export class TrackerLookup extends CoreResource {
    constructor(model: any = <any>{}){
        super();
        const {} = model;
    }
}

export class TrackerLookupSerializer {
    fromJson(json: any): TrackerLookup { return new TrackerLookup(json); }
    toJson(data: any): any { return {}; }
}
