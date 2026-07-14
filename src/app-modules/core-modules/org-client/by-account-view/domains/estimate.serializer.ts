import {CoreQueryOptions, CoreResource} from "@app-global";

export class EstimateQueryOptions extends CoreQueryOptions{
    projectId: string;
    accountId: string;
    constructor(model: any = {}){
        super(model);
    }

    toQueryString (){
        const obj = {
            projectId:this.projectId,
            accountId:this.accountId
        };
        return super.getParamByObject(obj);
    }
}

export class Estimate extends CoreResource {
    name: string;

    constructor(model: any = <any>{}){
        const {id, name} = model;
        super();
        this.id = model.id;
        this.name = model.name;
    }
}

export class EstimateSerializer {
    fromJson(json: any): Estimate { return new Estimate(json); }
    toJson(project: any): any {
        return {
            name: project.name
        };
    }
}
