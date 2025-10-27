import {CoreQueryOptions, CoreResource} from "@app-global";

export class StatusTrackingQueryOptions extends CoreQueryOptions{
    projectId: string;
    moduleId: string;
    accountId: string;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            projectId:this.projectId,
            moduleId:this.moduleId,
            accountId:this.accountId
        };
        return super.getParamByObject(obj);
    }
}

export class StatusTracking extends CoreResource {
    name: string;
    fromDate: string;
    toDate: string;
    process: string;
    phaseName: string;
    phaseId: number;
    statusType: string;

    constructor(model: any = <any>{}){
        const {id, name, fromDate, toDate, process, phaseName, phaseId, statusType} = model;
        super();
        this.id = id;
        this.name = name;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.process = process;
        this.phaseName = phaseName;
        this.phaseId = phaseId;
        this.statusType = statusType;
    }
}

export class StatusTrackingSerializer {
    fromJson(json: any): StatusTracking {
        return new StatusTracking(json);
    }
    toJson(project: any): any {
        return {
            name: project.name
        };
    }
}
