import {Injectable, Injector} from "@angular/core";
import {CoreQueryOptions, CoreResource, OrgResourceService} from "@app-global";

export class RetainerQueryOptions extends CoreQueryOptions{
    projectId: string;
    accountId: string;
    constructor(model: any = {}){
        super(model);
    }

    override toQueryString (){
        const obj = {
            projectId:this.projectId,
            accountId:this.accountId,
            invoiceMasterType: 'invoice',
            //vFor: 'retainer'
        };
        return super.getParamByObject(obj);
    }
}

export class Retainer extends CoreResource {
    name: string;

    constructor(model: any = <any>{}){
        const {id, name} = model;
        super();
        this.id = model.id;
        this.name = model.name;
    }
}

export class RetainerSerializer {
    fromJson(json: any): Retainer { return new Retainer(json); }
    toJson(project: any): any {
        return {
            name: project.name
        };
    }
}

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

@Injectable()
export class EstimateService extends OrgResourceService<Estimate>{
    constructor(public override injector: Injector) { super(injector, 'project/estimate', new EstimateSerializer()); }
}

@Injectable()
export class RetainerService extends OrgResourceService<Retainer>{
    constructor(public override injector: Injector) { super(injector, 'invoice/retainer', new RetainerSerializer()); }
}

