import {CoreQueryOptions, CoreResource} from "@app-global";

export class TimeTrackingQueryOptions extends CoreQueryOptions{
    projectId: string;
    accountId: string;
    moduleId: string;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            projectId:this.projectId,
            accountId:this.accountId,
            moduleId:this.moduleId
        };
        return super.getParamByObject(obj);
    }
}

export class TimeTracking extends CoreResource {
    name: string;

    constructor(model: any = <any>{}){
        const {id, name} = model;
        super();
        this.id = model.id;
        this.name = model.name;
    }
}

export class TimeTrackingSerializer {
    fromJson(json: any): TimeTracking { return new TimeTracking(json); }
    toJson(project: any): any {
        return {
            name: project.name
        };
    }
}
