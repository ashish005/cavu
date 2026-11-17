import {CoreQueryOptions, CoreResource} from "@app-global";

export class RunQueryOptions extends CoreQueryOptions {
    constructor(model: any = {}) { super(model); }

    override toQueryString() {
        const obj = {};
        return super.getParamByObject(obj);
    }
}

export class Run extends CoreResource {
    query: string;
    sourcesJson: string;
    results: number;
    qualifiedCount?: number;
    geography?: string;
    ranAt: string;
    constructor(model: any = <any>{}) {
        const {
            id, query, sourcesJson, results, qualifiedCount, geography, ranAt
        } = model;
        super();
        this.id = id;
        this.query = query;
        this.sourcesJson = sourcesJson;
        this.results = results;
        this.qualifiedCount = qualifiedCount;
        this.geography = geography;
        this.ranAt = ranAt;
    }
}

export class RunSerializer {
    fromJson(json: any): Run { return new Run(json); }
    toJson(model: any): any { return model; }
}
